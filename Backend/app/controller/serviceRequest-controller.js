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
			})
			.filter(Boolean)
			.filter((m) => m.distanceMeters <= 5000)
			.sort((a, b) => a.distanceMeters - b.distanceMeters);

		// 3️⃣ If no nearby mechanics
		if (nearbyMechanics.length === 0) {
			return res.status(404).json("No mechanics nearby");
		}

		// Create service request with extra fields
		const newReq = await ServiceRequest.create({
			...body,
			status: "waiting",
			nearbyMechanics: nearbyMechanics.map((m) => ({
				mechanicId: m._id,
				name: m.name,
				phone: m.phone,
				distanceMeters: m.distanceMeters,
				response: "pending",
			})),
			currentMechanicIndex: 0,
			lastNotifiedAt: new Date(),
		});

		// Send to first mechanic
		const nearestMechanic = nearbyMechanics[0];
		const distance =
			nearestMechanic.distanceMeters < 1000 ? `${nearestMechanic.distanceMeters} m` : `${(nearestMechanic.distanceMeters / 1000).toFixed(1)} km`;

		await sendWhatsApp(
			Number(nearestMechanic.phone),
			`🚨 New Service Request 🚨\n
Vehicle: ${body.vehicleType}
Issue: ${body.issueDescription}
Location: ${body.userLocation.address}
Distance: ${distance}\n
Reply with:\n👉 1 to ACCEPT\n👉 2 to REJECT`
		);

		console.log(`✅ Sent to first mechanic: ${nearestMechanic.name}`);

		res.json(201).json({
			message: "Request created & sent to mechanic",
			requestId: newReq._id,
			nearestMechanic,
		});
	} catch (error) {
		console.log("❌ Error in create:", error.message);
		res.status(500).json(error.message);
	}
};

export default serviceReqCtrl;
