import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import axios from "axios";
import { getDistance } from "geolib";
import sendWhatsApp from './notification-controller.js'

const serviceReqCtrl = {};

serviceReqCtrl.create = async (req, res) => {
	const body = req.body;

	try {
		// Find all mechanics
		const mechanics = await Mechanic.find();

		// Filter and calculate distance (within 5km)
		const nearbyMechanics = mechanics
			.map((mech) => {
				if (mech.location?.latitude && mech.location?.longitude) {
					const distanceMeters = getDistance(
						{ latitude: body.userLocation.latitude, longitude: body.userLocation.longitude },
						{ latitude: mech.location.latitude, longitude: mech.location.longitude }
					);
					return { ...mech._doc, distanceMeters };
				}
				return null;
			}).filter((m) => m.distanceMeters <= 5000).sort((a, b) => a.distanceMeters - b.distanceMeters);

		// If no nearby mechanics
		if (nearbyMechanics.length === 0) {
			return res.status(404).json("No mechanics nearby");
		}

		// Create service request with extra fields
		const newReq = await ServiceRequest.create({
			...body,
			status: "waiting",
			nearbyMechanics: nearbyMechanics.map(m => ({
				mechanicId: m._id,
				name: m.name,
				phone: m.phone,
				distanceMeters: m.distanceMeters,
			})),
			currentMechanicIndex: 0,
		});

		console.log(nearbyMechanics);

		nearbyMechanics.map((mech) => {
			//distance calculation in m and km for whatsapp distance body
			const distance = mech.distanceMeters < 1000
				? `${mech.distanceMeters} m`
				: `${(mech.distanceMeters / 1000).toFixed(1)} km`;

			sendWhatsApp(
				Number(mech.phone),
				`🚨 New Service Request 🚨\n
Vehicle: ${body.vehicleType}
Issue: ${body.issueDescription}
Location: ${body.userLocation.address}
Distance: ${distance}\n
Reply with:\n👉 1 to ACCEPT\n👉 2 to REJECT`
			);
			console.log(`✅ Sent to nearby mechanics : ${mech.name}`);
		})
		res.status(201).json({ message: "Requests sent to all nearby mechanics" });
	} catch (error) {
		console.log("❌ Error in create:", error.message);
		res.status(500).json(error.message);
	}

};

export default serviceReqCtrl;