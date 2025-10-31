import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";

const webhookUrl = "https://webhook.site/a27344d7-2ddf-4403-86b2-1942541a133e";
const webhookCtrl = {};

webhookCtrl.handleWhatsapp = async (req, res) => {
	try {
		await axios.post(webhookUrl, { received: req.body });

		// response object from WhatsApp on render
		const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
		const from = (req.body?.data?.from || "").trim().replace("@c.us", "");

		console.log(`Message : ${messageText}, \nFrom : ${from}`);

		if (!messageText) {
			return res.status(409).json("Response is empty");
		}

		const mechanic = await Mechanic.findOne({ phone: from });
		if (!mechanic) return res.status(404).json("Mechanic not found");

		// // find the latest service request, whether waiting or accepted
		// const request = await ServiceRequest.findOne().sort({ createdAt: -1 });
		// if (!request) return res.status(404).json("No requests found");

		// // if already accepted by another mechanic
		// if (request.status === "accepted" && String(request.mechanicId) !== String(mechanic._id)) {
		// 	await sendWhatsApp(from, "⚠️ This request has already been accepted by another mechanic.");
		// 	return res.status(200).json("Already accepted by someone else");
		// }

		// handle ACCEPT (1)
		if (messageText === "1") {

			// if (request.status === "waiting") {
			// 	request.status = "accepted";
			// 	request.mechanicId = mechanic._id;
			// 	await request.save();

			await sendWhatsApp(from, "You have been assigned the service request.");
			console.log(from, "accepted the request");



			// notify all others
			// const otherMechanics = request.nearbyMechanics.filter(
			// 	(m) => String(m.mechanicId) !== String(mechanic._id)
			// );

			// for (const other of otherMechanics) {
			// 	await sendWhatsApp(other.phone, "This request was accepted by another mechanic.");
			// }

			return res.status(200).json("Mechanic accepted the request");
		} 
		
		// else {
		// 	await sendWhatsApp(from, "This request has already been accepted.");
		// 	return res.status(200).json("Already accepted");
		// }



		// handle REJECT (2)
		if (messageText === "2") {
			await sendWhatsApp(from, "You have rejected this request.");
			console.log("Mechanic rejected the request");
			return res.status(200).json("Mechanic rejected the request");
		}

		console.log("Not valid response");
		return res.status(409).json("Not valid response");

	} catch (error) {
		console.log("Error in webhook:", error.message);
		res.status(500).json("webhook error: " + error.message);
	}
};

export default webhookCtrl;

