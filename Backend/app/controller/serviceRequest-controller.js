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
		const nearbyMechanics = mechanics.map((mech) => {
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
			nearbyMechanics: nearbyMechanics.map(mech => ({
				mechanicId: mech._id,
				name: mech.name,
				phone: mech.phone,
				distanceMeters: mech.distanceMeters,
			})),
		});

		

		console.log("nearby mechanics", nearbyMechanics);

		nearbyMechanics.map((mech) => {
			//distance calculation in m and km for whatsapp distance body
			const distance = mech.distanceMeters < 1000
				? `${mech.distanceMeters} m`
				: `${(mech.distanceMeters / 1000).toFixed(1)} km`;

			 sendWhatsApp(mech.phone,
  `🔧 *Hey Mechanic!* You have a new service request:\n\n` +
  `🚗 *Vehicle:* ${req.body.vehicleType}\n` +
  `⚠️ *Issue:* ${req.body.issueDescription}\n` +
  `📍 *Location:* ${req.body.userLocation?.address}\n` +
  `📏 *Distance:* ${distance}\n\n` +
  `Reply with:\n` +
  `✅ *1* — To Accept\n` +
  `❌ *2* — To Reject`
			 )

			console.log(`Sent to nearby mechanics : ${mech.firstName}`);
		})

		const request = await ServiceRequest.findOne().sort({createdAt:-1})
		console.log("newReq All nearby mechanics",request);

		res.status(201).json({ message: "Requests sent to all nearby mechanics" });
	} catch (error) {
		console.log("❌ Error in create:", error.message);
		res.status(500).json(error.message);
	}

};




export default serviceReqCtrl;