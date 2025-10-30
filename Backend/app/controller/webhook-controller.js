import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";


const webhookUrl = "https://webhook.site/8c5167bb-1394-4827-908c-dda8950698a7"
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

		const mechanic = await Mechanic.findOne({ phone: from })
		if (!mechanic) return res.status(404).json("Mechanic not found");

		const request = await ServiceRequest.findOne({ status: "waiting" });
		if (!request) return res.status(404).json("No pending requests");

		await sendWhatsApp(from, "You have been assigned the service request");
		console.log(from, "You have been assigned the service request");

		// Handle accepted condition
		if (request.status === "accepted" && String(request.mechanicId) !== String(mechanic._id)) {
			await sendWhatsApp(from, "This request has already been accepted by another mechanic.");
			return res.status(200).json("Already accepted");
		}

		// Handle responses
		if (messageText === "1") {
			if (request.status === "waiting") {
				request.status = "accepted";
				request.mechanicId = mechanic._id;
				await request.save();

				await sendWhatsApp(from, "You have been assigned the service request ✅");
				console.log(from, "You have been assigned the service request");

				// Notify others
				const otherMechanics = request.nearbyMechanics.filter(
					(m) => String(m.mechanicId) !== String(mechanic._id)
				);
				
				for (const other of otherMechanics) {
					await sendWhatsApp(other.phone, "Request already accepted by another mechanic.");
				}

				return res.status(200).json("Mechanic accepted the request");
			} else {
				await sendWhatsApp(from, "This request has already been accepted.");
				return res.status(200).json("Already accepted");
			}
		}


		if (messageText === "2") {
			await sendWhatsApp(from, "You have rejected this request.")
			console.log("Mechanic rejected the request");
			return res.status(200).json("Mechanic rejected the request");
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

