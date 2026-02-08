import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import axios from "axios";
import { getDistance } from "geolib";
import sendWhatsApp from './notification-controller.js'

const serviceReqCtrl = {};

serviceReqCtrl.create = async (req, res) => {
	const body = req.body;

	try {
		console.log("Service Request received from:", req.user?.email);
		console.log("Body:", JSON.stringify(body, null, 2));

		// Find all mechanics
		const mechanics = await Mechanic.find();
		console.log(`Found ${mechanics.length} mechanics in system`);

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

		console.log(`Found ${nearbyMechanics.length} nearby mechanics:`, nearbyMechanics.map(m => ({ fullName: m.fullName, phone: m.phone })));

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

		console.log("service request created:", newReq._id);

		// Send WhatsApp messages to all nearby mechanics
		for (const mech of nearbyMechanics) {
			// Extract mechanic info safely
			const mechanicName = mech.fullName || mech.name || "Mechanic";
			const mechanicPhone = mech.phone;

			//distance calculation in m and km for whatsapp distance body
			const distance = mech.distanceMeters < 1000
				? `${mech.distanceMeters} m`
				: `${(mech.distanceMeters / 1000).toFixed(1)} km`;

			console.log(`Attempting to send WhatsApp to ${mechanicName} at ${mechanicPhone}...`);

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
				console.log(`WhatsApp sent successfully to: ${mechanicName} (${mechanicPhone})`);
			} catch (whatsappError) {
				console.error(`WhatsApp failed for ${mechanicName} (${mechanicPhone}):`, whatsappError.message);
			}
		}

		//2 timeout funtion
		handleRequestTimeout(newReq._id);


		res.status(201).json({ message: "Requests sent to all nearby mechanics", requestId: newReq._id });
	} catch (error) {
		console.log("Error in create:", error.message);
		console.error("Full error:", error);
		res.status(500).json({ error: error.message });
	}

};





serviceReqCtrl.getMyRequest = async (req, res) => {
	const requestId = req.params.id;
	try {
		const request = await ServiceRequest.findById(requestId).populate("mechanicId");

		if (!request) return res.status(404).json("Not found");

		res.status(200).json({ request });
	} catch (err) {
		res.status(500).json(err.message);
	}
};



serviceReqCtrl.list = async (req, res) => {
	const page = req.query.page;
	const limit = 10;

	//filter by status
	const filter = {};
	if (req.query.status && req.query.status !== "total") {
		filter.status = req.query.status;
	}

	const total = await ServiceRequest.countDocuments(filter);

	try {
		const serviceRequests = await ServiceRequest.find(filter).skip((page - 1) * limit).limit(limit);
		if (!serviceRequests) return res.status(404).json("Not found");
		res.status(200).json({ serviceRequests, totalPages: Math.ceil(total / limit) });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

serviceReqCtrl.listStats = async (req, res) => {
	try {
		const totalRequests = await ServiceRequest.countDocuments();
		const pendingRequests = await ServiceRequest.countDocuments({ status: "waiting" });
		const acceptedRequests = await ServiceRequest.countDocuments({ status: "accepted" });
		const completedRequests = await ServiceRequest.countDocuments({ status: "completed" });
		const cancelledRequests = await ServiceRequest.countDocuments({ status: "cancelled" });
		res.status(200).json({
			totalRequests,
			pendingRequests,
			acceptedRequests,
			completedRequests,
			cancelledRequests
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};



//service timeout handler function
const handleRequestTimeout = async (requestId) => {
	//2 minutes timeout
	setTimeout(async () => {
		try {
			const request = await ServiceRequest.findById(requestId);
			if (!request) return;
			if (request.status === "waiting") {
				request.status = "cancelled";
				await request.save();
				console.log(`Service request ${request._id} cancelled due to timeout.`);

				// Notify customer about cancellation
				if (request.customerNumber) {
					await sendWhatsApp(
						request.customerNumber,
						`⏰ *Request Timed Out*\n\n` +
						`😔 We're sorry, but we couldn't find an available mechanic within 2 minutes.\n\n` +
						`📍 *Track status here:*\n` +
						`🔗 https://onthespotx.vercel.app/finding-mechanics/${request._id}\n\n` +
						`🙏 Thank you for your understanding!`
					);
				}

				if (request.nearbyMechanics && request.nearbyMechanics.length > 0) {
					// Notify nearby mechanics about cancellation
					for (const mech of request.nearbyMechanics) {
						if (mech.phone) {
							await sendWhatsApp(
								mech.phone,
								`⏰ *Request Timed Out*\n\n` +
								`😔 The service request from ${request.userLocation?.address || "a customer"} has timed out and is no longer available.\n\n` +
								`🙏 Thank you for your understanding!`
							);
						}
					}
				}
				console.log(`Notified customer and nearby mechanics about cancellation of request ${request._id}.`);
			}
		} catch (err) {
			console.log("Error in timeout handler:", err.message);
		}
	}, 2 * 20 * 1000);
};



export default serviceReqCtrl;