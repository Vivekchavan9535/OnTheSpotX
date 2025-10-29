import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";


const webhookUrl = "https://webhook.site/19f961e6-37ea-46f6-81dd-e7895e141b0d"
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

		// Handle responses
		if (messageText === "1") {
			console.log("Mechanic accepted the request");
			return res.status(200).json("accepted");
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

