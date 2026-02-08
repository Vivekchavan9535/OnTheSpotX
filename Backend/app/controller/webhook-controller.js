import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";

const webhookUrl = process.env.WEBHOOK_URL;
const webhookCtrl = {};

webhookCtrl.handleWhatsapp = async (req, res) => {
	try {
		// await axios.post(webhookUrl, { received: req.body });

		console.log("Received webhook data:", req.body);	
		const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
		const from = ("+" + (req.body?.data?.from || "").replace("@c.us", "").trim()).replace("++", "+");



		console.log(`Message : ${messageText}, \nFrom : ${from}`);

		if (!messageText) return res.status(409).json("Response is empty");

		const mechanic = await Mechanic.findOne({ phone: from });
		if (!mechanic) return res.status(404).json("Mechanic not found");

		// try to find the request accepted by this mechanic
		let request = await ServiceRequest.findOne({
			status: "accepted",
			mechanicId: mechanic._id
		});

		// if none then find the latest waiting request
		if (!request) {
			request = await ServiceRequest.findOne({ status: "waiting" }).sort({ createdAt: -1 });
		}


		// Handle accept (1)
		if (messageText === "1") {
			if (request.status === "waiting") {
				request.status = "accepted";
				request.mechanicId = mechanic._id;

				//handling status of request and changing response of mechanic who accepted the request
				const mech = request.nearbyMechanics.find(
					m => m.mechanicId.equals(mechanic._id)
				);

				if (mech) {
					mech.response = "accepted";
					console.log("Mechanic updated in nearbyMechanics:", mech.name, mech.response);
				} else {
					console.log("Mechanic not found in nearbyMechanics for request", request._id);
				}

				await request.save();

				await sendWhatsApp(from, "✅ You have been assigned the service request.");

				console.log(`${from} accepted the request`);

				//customer will get notified if mech accepts his service request
				console.log("customer num" + " " + request.customerNumber);

				if (request.customerNumber) {
					const to = request.customerNumber
					await sendWhatsApp(
						to,
						`🟢 *Request Accepted!*\n` +
						`━━━━━━━━━━━━━━\n` +
						`👨‍🔧 *Mechanic Assigned*\n` +
						`🚹 Name: *${mechanic.fullName || "Assigned Mechanic"}*\n` +
						`📞 Phone: *${mechanic.phone}*\n` +
						`━━━━━━━━━━━━━━\n` +
						`📍 *Track Your Mechanic:*\n` +
						`🔗 https://onthespotx.vercel.app/finding-mechanics/${request._id}\n` +
						`━━━━━━━━━━━━━━\n` +
						`🕒 Estimated Arrival: *10-20 min*\n` +
						`✅ Stay available for calls.\n\n` +
						`🙌 Thank you for choosing us!`
					);
				}


				// Notify others
				const otherMechanics = request.nearbyMechanics.filter(
					(m) => String(m.mechanicId) !== String(mechanic._id)
				);

				for (const other of otherMechanics) {
					await sendWhatsApp(other.phone, "ℹ️ This request was accepted by another mechanic.");
				}

				return res.status(200).json("Mechanic accepted the request");
			}

			// If already accepted by this mechanic
			if (String(request.mechanicId) === String(mechanic._id)) {
				await sendWhatsApp(from, "⚠️ You have already accepted this request.");
				return res.status(200).json("Already accepted by same mechanic");
			}

			// If accepted by someone else
			await sendWhatsApp(from, "⚠️ This request was already accepted by another mechanic.");
			return res.status(200).json("Already accepted by someone else");
		}


		// Handle REJECT (2)
		if (messageText === "2") {
			//handle reject and re notify
			if (request.status === "accepted" && String(request.mechanicId) === String(mechanic._id)) {
				request.status = "waiting";
				request.mechanicId = null;

				//handling status of request and changing response of mechanic who reject the request
				const mech = request.nearbyMechanics.find(
					m => m.mechanicId.equals(mechanic._id)
				);

				if (mech) {
					mech.response = "rejected";
					console.log("Mechanic updated in nearbyMechanics:", mech.name, mech.response);
				} else {
					console.log("Mechanic not found in nearbyMechanics for request", request._id);
				}

				await request.save();

				await sendWhatsApp(from, "❌ You have rejected this request. It’s now open again for others.");




				//re notify nearby mechanics // im using for..of loop bcz sendWhatsapp is async
				for (const mech of request.nearbyMechanics.filter((mech) => String(mech.phone) !== String(from))) {

					console.log(mech.phone !== from);

					const distance = mech.distanceMeters < 1000
						? `${mech.distanceMeters} m`
						: `${(mech.distanceMeters / 1000).toFixed(1)} km`;

					sendWhatsApp(mech.phone,
						`🔧 *Hey Mechanic!* You have a new service request:\n\n` +
						`🚗 *Vehicle:* ${request?.vehicleType}\n` +
						`⚠️ *Issue:* ${request?.issueDescription}\n` +
						`📍 *Location:* ${request?.userLocation?.address}\n` +
						`📏 *Distance:* ${distance}\n\n` +
						`Reply with:\n` +
						`✅ *1* — *Accept*\n` +
						`❌ *2* — *Reject*`
					)
					console.log(`Sent to nearby mechanics : ${mech?.name}`);
				}

				console.log(`Mechanic ${from} rejected and reopened the request.`);

				// if mech rejects tell customer that mechanic rejected
				if (request.customerNumber) {
					await sendWhatsApp(
						request.customerNumber,
						`❌ *Mechanic Declined*\n\n` +
						`🔍 Searching for another mechanic…\n\n` +
						`📍 *Track status here:*\n` +
						`🔗 https://onthespotx.vercel.app/finding-mechanics/${request._id}\n\n` +
						`🙏 Thank you for your patience!`
					);
				}



				return res.status(200).json("Mechanic rejected and reopened the request");
			}
			await sendWhatsApp(from, "❌ You have rejected this request.");


			console.log(`Mechanic ${from} rejected but was not assigned.`);
			return res.status(200).json("Mechanic rejected but not assigned");
		}

		console.log("Not valid response");
		return res.status(409).json("Not valid response");

	} catch (error) {
		console.log("Error in webhook:", error.message);
		res.status(500).json("webhook error: " + error.message);
	}
};







// Optional Reset API (for testing)
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

