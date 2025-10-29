import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";


const webhookUrl = "https://webhook.site/f3d80dc1-c168-4aa9-867b-4cac0042164d"
const webhookCtrl = {}

webhookCtrl.handleWhatsapp = async (req, res) => {
	const message = req.body.message;
	const from = req.body.from;
	try {
		await axios.post(webhookUrl, { received: req.body })
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

