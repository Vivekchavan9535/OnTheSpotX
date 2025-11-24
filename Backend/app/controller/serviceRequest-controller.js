import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import axios from "axios";
import { getDistance } from "geolib";
import sendWhatsApp from './notification-controller.js'

const serviceReqCtrl = {};

serviceReqCtrl.create = async (req, res) => {
	const body = req.body;

	try {
		console.log("📨 Service Request received from:", req.user?.email);
		console.log("📨 Body:", JSON.stringify(body, null, 2));

		// Find all mechanics
		const mechanics = await Mechanic.find();
		console.log(`🔧 Found ${mechanics.length} mechanics in system`);

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
		}).filter((m) => m !== null && m.distanceMeters <= 5000).sort((a, b) => a.distanceMeters - b.distanceMeters);

		console.log(`📍 Found ${nearbyMechanics.length} nearby mechanics:`, nearbyMechanics.map(m => ({ fullName: m.fullName, phone: m.phone })));

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
				name: mech.fullName,
				phone: mech.phone,
				distanceMeters: mech.distanceMeters,
			})),
		});

		console.log("✅ Service request created:", newReq._id);

		// Send WhatsApp messages to all nearby mechanics
		for (const mech of nearbyMechanics) {
			// Extract mechanic info safely
			const mechanicName = mech.fullName || mech.name || "Mechanic";
			const mechanicPhone = mech.phone;

			//distance calculation in m and km for whatsapp distance body
			const distance = mech.distanceMeters < 1000
				? `${mech.distanceMeters} m`
				: `${(mech.distanceMeters / 1000).toFixed(1)} km`;

			console.log(`📱 Attempting to send WhatsApp to ${mechanicName} at ${mechanicPhone}...`);

			try {
				await sendWhatsApp(mechanicPhone,
					`🔧 *Hey Mechanic!* You have a new service request:\n\n` +
					`🚗 *Vehicle:* ${req.body.vehicleType}\n` +
					`⚠️ *Issue:* ${req.body.issueDescription}\n` +
					`📍 *Location:* ${req.body.userLocation?.address}\n` +
					`📏 *Distance:* ${distance}\n\n` +
					`Reply with:\n` +
					`✅ *1* — *Accept*\n` +
					`❌ *2* — *Reject*`
				);
				console.log(`✅ WhatsApp sent successfully to: ${mechanicName} (${mechanicPhone})`);
			} catch (whatsappError) {
				console.error(`❌ WhatsApp failed for ${mechanicName} (${mechanicPhone}):`, whatsappError.message);
			}
		}

		res.status(201).json({ message: "Requests sent to all nearby mechanics", requestId: newReq._id });
	} catch (error) {
		console.log("❌ Error in create:", error.message);
		console.error("❌ Full error:", error);
		res.status(500).json({ error: error.message });
	}

};




export default serviceReqCtrl;