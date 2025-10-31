import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";

const webhookUrl = "https://webhook.site/b5028fe3-e8f8-4530-bef0-1cef52bdf930";
const webhookCtrl = {};

webhookCtrl.handleWhatsapp = async (req, res) => {
	try {
		await axios.post(webhookUrl, { received: req.body });

		// response object from WhatsApp on render
		const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
		const from = (req.body?.data?.from || "").slice(2).trim().replace("@c.us", "");

		console.log(`Message : ${messageText}, \nFrom : ${from}`);

		if (!messageText) {
			return res.status(409).json("Response is empty");
		}

		const mechanic = await Mechanic.findOne({ phone: from });
		if (!mechanic) return res.status(404).json("Mechanic not found");

		// find the latest service request, whether waiting or accepted
		const request = await ServiceRequest.findOne().sort({ createdAt: -1 });
		if (!request) return res.status(404).json("No requests found");

		// if already accepted by another mechanic
		if (request.status === "accepted" && String(request.mechanicId) !== String(mechanic._id)) {
			await sendWhatsApp(from, "⚠️ This request has already been accepted by another mechanic.");
			return res.status(200).json("Already accepted by someone else");
		}

		// handle ACCEPT (1)
		if (messageText === "1") {
			if (request.status === "waiting") {
				request.status = "accepted";
				request.mechanicId = mechanic._id;
				await request.save();

				await sendWhatsApp(from, "✅ You have been assigned the service request.");
				console.log(from, "accepted the request");

				// notify all others
				const otherMechanics = request.nearbyMechanics.filter(
					(m) => String(m.mechanicId) !== String(mechanic._id)
				);

				for (const other of otherMechanics) {
					await sendWhatsApp(other.phone, "ℹ️ This request was accepted by another mechanic.");
				}

				return res.status(200).json("Mechanic accepted the request");
			} else {
				await sendWhatsApp(from, "⚠️ This request has already been accepted.");
				return res.status(200).json("Already accepted");
			}
		}

		// handle REJECT (2)
		// Handle REJECT (2)
		if (messageText === "2") {
			// Only reset if this mechanic was the one who accepted
			if (request.status === "accepted" && String(request.mechanicId) === String(mechanic._id)) {
				request.status = "waiting";
				request.mechanicId = null;
				await request.save();

				await sendWhatsApp(from, "❌ You have rejected this request. It's now open again for others.");
				console.log(`Mechanic ${from} rejected the request — reopened.`);
			} else {
				await sendWhatsApp(from, "❌ You have rejected this request.");
				console.log(`Mechanic ${from} rejected but was not the assigned one.`);
			}

			return res.status(200).json("Mechanic rejected the request");
		}

	} catch (error) {
		console.log("Error in webhook:", error.message);
		res.status(500).json("webhook error: " + error.message);
	}
};



webhookCtrl.resetAllRequests = async (req, res) => {
  try {
    const result = await ServiceRequest.updateMany(
      { status: "accepted" },
      { $set: { status: "waiting", mechanicId: null } }
    );

    console.log(`Reset ${result.modifiedCount} accepted requests to waiting`);
    res.status(200).json({ message: "All accepted requests reset to waiting", modified: result.modifiedCount });
  } catch (err) {
    console.log("Error resetting requests:", err.message);
    res.status(500).json({ error: err.message });
  }
};


export default webhookCtrl;
