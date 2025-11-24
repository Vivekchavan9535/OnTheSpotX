import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";

const webhookUrl = "https://webhook.site/ce2753cf-967f-4d5b-86bd-6af0a6949dbd";
const webhookCtrl = {};

webhookCtrl.handleWhatsapp = async (req, res) => {

	// if (req.body?.instanceData?.idInstance === 7107365993 || req.body?.typeWebhook === "incomingMessageReceived" || req.body?.instanceData?.typeInstance === "whatsapp") {
	// 	console.log("🛑 Ignored old Green-API webhook");
	// 	return res.status(200).send("ignored");
	// }


	try {
		await axios.post(webhookUrl, { received: req.body });

		const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
		const from = (req.body?.data?.from || "").slice(2).trim().replace("@c.us", "");


		console.log(`Message : ${messageText}, \nFrom : ${from}`);

		if (!messageText) return res.status(409).json("Response is empty");

		const mechanic = await Mechanic.findOne({ phone: from });
		if (!mechanic) return res.status(404).json("Mechanic not found");

		// Find the latest waiting request that includes this mechanic in nearbyMechanics
		let request = await ServiceRequest.findOne({
			status: "waiting",
			"nearbyMechanics.mechanicId": mechanic._id
		}).sort({ createdAt: -1 });

		// If no waiting request with this mechanic, check if they already accepted one
		let alreadyAccepted = null;
		if (!request) {
			alreadyAccepted = await ServiceRequest.findOne({
				status: "accepted",
				mechanicId: mechanic._id
			});
		}


		// Handle accept (1)
		if (messageText === "1") {
			// Case 1: Mechanic accepts a waiting request
			if (request && request.status === "waiting") {
				request.status = "accepted";
				request.mechanicId = mechanic._id;
				await request.save();

				await sendWhatsApp(from, "✅ You have been assigned the service request." + `https://localhost:3030/finding-mechanics`);
				console.log(`${from} accepted the request`);

				// Notify others that this request has been taken
				const otherMechanics = request.nearbyMechanics.filter(
					(m) => String(m.mechanicId) !== String(mechanic._id)
				);

				for (const other of otherMechanics) {
					await sendWhatsApp(other.phone, "ℹ️ This request was accepted by another mechanic.");
				}

				return res.status(200).json("Mechanic accepted the request");
			}

			// Case 2: Mechanic already accepted a request previously
			if (alreadyAccepted && String(alreadyAccepted.mechanicId) === String(mechanic._id)) {
				await sendWhatsApp(from, "⚠️ You have already accepted this request.");
				return res.status(200).json("Already accepted by same mechanic");
			}

			// Case 3: Another mechanic accepted it already
			if (alreadyAccepted && String(alreadyAccepted.mechanicId) !== String(mechanic._id)) {
				await sendWhatsApp(from, "⚠️ This request was already accepted by another mechanic.");
				return res.status(200).json("Already accepted by someone else");
			}

			// Case 4: No request found at all
			await sendWhatsApp(from, "❌ No active service request found. Please try again later.");
			return res.status(404).json("No service request found");
		}



		// ✅ Handle REJECT (2)
		if (messageText === "2") {
			//handle reject and re notify
			if (alreadyAccepted && String(alreadyAccepted.mechanicId) === String(mechanic._id)) {
				alreadyAccepted.status = "waiting";
				alreadyAccepted.mechanicId = null;
				await alreadyAccepted.save();

				await sendWhatsApp(from, "❌ You have rejected this request. It’s now open again for others.");




				//re notify nearby mechanics // im using for..of loop bcz sendWhatsapp is async
				for (const mech of alreadyAccepted.nearbyMechanics.filter((mech) => String(mech.phone) !== String(from))) {

					const distance = mech.distanceMeters < 1000
						? `${mech.distanceMeters} m`
						: `${(mech.distanceMeters / 1000).toFixed(1)} km`;

					await sendWhatsApp(mech.phone,
						`🔧 *Hey Mechanic!* You have a new service request:\n\n` +
						`🚗 *Vehicle:* ${alreadyAccepted?.vehicleType}\n` +
						`⚠️ *Issue:* ${alreadyAccepted?.issueDescription}\n` +
						`📍 *Location:* ${alreadyAccepted?.userLocation?.address}\n` +
						`📏 *Distance:* ${distance}\n\n` +
						`Reply with:\n` +
						`✅ *1* — *Accept*\n` +
						`❌ *2* — *Reject*`
					);
					console.log(`Sent to nearby mechanics : ${mech?.name}`);
				}

				console.log(`Mechanic ${from} rejected and reopened the request.`);
				return res.status(200).json("Mechanic rejected and reopened the request");
			}
			await sendWhatsApp(from, "❌ You haven't accepted any request to reject.");
			console.log(`Mechanic ${from} tried to reject but was not assigned.`);
			return res.status(200).json("Mechanic tried to reject but not assigned");
		}

		console.log("Not valid response");
		return res.status(409).json("Not valid response");

	} catch (error) {
		console.log("Error in webhook:", error.message);
		res.status(500).json("webhook error: " + error.message);
	}
};







// ✅ Optional Reset API (for testing)
webhookCtrl.resetAllRequests = async (req, res) => {
	try {
		const result = await ServiceRequest.updateMany(
			{ status: "accepted" },
			{ $set: { status: "waiting", mechanicId: null } }
		);

		console.log(`Reset ${result.modifiedCount} accepted requests to waiting`);
		res.status(200).json({
			message: "All accepted requests reset to waiting",
			modified: result.modifiedCount
		});
	} catch (err) {
		console.log("Error resetting requests:", err.message);
		res.status(500).json({ error: err.message });
	}
};

export default webhookCtrl;

