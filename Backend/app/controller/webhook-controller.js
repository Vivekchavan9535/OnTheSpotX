import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";


const webhookUrl = "https://webhook.site/451781a7-b795-4454-8745-a25fb36b866a"
const webhookCtrl = {}

webhookCtrl.handleWhatsapp = async (req, res) => {
	try {
		await axios.post(webhookUrl, { received: req.body })

		//response object from whatsapp on render
		const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
		const from = (req.body?.data?.from || "").trim().replace("@c.us", "");

		console.log(`Message : ${messageText}, \n From : ${from}`);

		if (!messageText) {
			return res.status(409).json("Response is empty")
		}

		const mechanic = await Mechanic.findOne({ phone: 6364151684 })
		if (!mechanic) return res.status(404).json("Mechanic not found");

		const request = await ServiceRequest.findOne({ status: "waiting" });
		if (!request) return res.status(404).json("No pending requests");



		// Handle responses
		if (messageText === "1") {
			request.status = "accepted"
			request.mechanicId = mechanic._id;
			await request.save()
			await sendWhatsApp(from, "✅ You have been assigned the service request. Please contact the customer.");

			const otherMechanics = request.nearbyMechanics.filter((m) => m.mechanicId.toString() !== mechanic._id.toString());
			for (const other of otherMechanics) {
				await sendWhatsApp(other.phone, "Request already accepted by another mechanic.");
			}

			return res.status(200).json("Mechanic accepted the request");
		}

		if (messageText === "2") {
			console.log("Mechanic rejected the request");
			return res.status(200).json("rejected");
		}

		//if not 1 or 2 
		console.log("Not valid response")
		return res.status(409).json("Not valid response")

	} catch (error) {
		console.log(error.message);
		res.status(500).json("webhook", error.message)
	}
}

export default webhookCtrl;

