import axios from 'axios';



const instanceId = "instance147843";
const token = "9u7numn8ug2qx1xy";

//send whatsapp messages
const sendWhatsApp = async (to, message) => {
	try {
		await axios.post(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
			token,
			to,
			body: message,
		});
	} catch (error) {
		console.error("WhatsApp Error:", error.response?.data || error.message);
	}
};

export default sendWhatsApp;