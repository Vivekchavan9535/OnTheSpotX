import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import axios from "axios";
import { getDistance } from "geolib";
import sendWhatsApp from './notification-controller.js'

const serviceReqCtrl = {};



serviceReqCtrl.create = async (req, res) => {
	const body = req.body;

	try {
		// Save request
		const serviceReq = await ServiceRequest.create(body);

		// Find nearbyAllMechanics mechanics (within 5km)
		const mechanics = await Mechanic.find();

		const nearbyAllMechanics = mechanics.map((mech) => {
				if (mech.location?.latitude && mech.location?.longitude) {
					const distanceMeters = getDistance(
						{ latitude: body.userLocation.latitude, longitude: body.userLocation.longitude },
						{ latitude: mech.location.latitude, longitude: mech.location.longitude }
					);
					return { ...mech._doc, distanceMeters };
				}
			})
			.filter(Boolean)
			.filter((m) => m.distanceMeters <= 5000);

		if (!nearbyAllMechanics.length) {
			return res.status(404).json("No mechanics nearbyAllMechanics");
		}

		// Send request to first nearest mechanic
		const nearestMechanic = nearbyAllMechanics[0];

		//callling whatsapp msg function 
		await sendWhatsApp(Number(nearestMechanic.phone) , // must exist in Mechanic model
			`🚨 New Service Request 🚨\n
Vehicle: ${body.vehicleType}
Issue: ${body.issueDescription}
Location: ${body.userLocation.address}
Distance: ${(nearestMechanic.distanceMeters / 1000).toFixed(1)} km
\n
Reply with:\n👉 1 to ACCEPT\n👉 2 to REJECT`
		);
		console.log(nearestMechanic);
		
		res.status(201).json({ message: "Request created & sent to mechanic", serviceReq });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

export default serviceReqCtrl;
