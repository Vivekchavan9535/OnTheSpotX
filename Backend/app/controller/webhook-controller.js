import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";


const webhookUrl = "https://webhook.site/0c45d06d-9ea7-43e0-a993-9de6b7b183c0"
const webhookCtrl = {}

webhookCtrl.handleWhatsapp = async (req, res) => {
	const message = req.body.message;
	const from = req.body.from;
	try {
		await axios.post(webhookUrl, { received: req.body })
		
		// const data = req.body;
		// if(!data){
		// 	return res.json({ success: true, message: "No message data" });
		// }

		// const messageText =(data.body || "")
		// console.log(messageText);

		const { from, body, message } = req.body;

		const messageText = body || message || "";
		console.log("💬 Message text:", messageText);
		console.log("👤 From:", from);
		
		
		res.json({
			success: true,
			message: "Webhook received successfully",
			data: req.body,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json("webhook", error.message)
	}
}

export default webhookCtrl;

