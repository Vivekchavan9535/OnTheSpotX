import axios from 'axios';

const instanceId = "71073659003";
const token = "3fd10ee038c54148bc871f733418369e3ab70b0421514b4c78";

//send whatsapp messages
const sendWhatsApp = async (to, message) => {
	try {
		await axios.post(
			`https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`,
			{
				chatId: `${to}@c.us`, // e.g. 919876543210@c.us
				message,
			}
		);
		console.log("WhatsApp message sent ✅");
	} catch (error) {
		console.error("WhatsApp Error:", error.response?.data || error.message);
	}
};

export default sendWhatsApp;




// import axios from 'axios';

// const instanceId = "instance147843";
// const token = "aa35p1nym13sz16o";

// //send whatsapp messages
// const sendWhatsApp = async (to, message) => {
// 	try {
// 		await axios.post(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
// 			token,
// 			to,
// 			body: message,
// 		});
// 	} catch (error) {
// 		console.error("WhatsApp Error:", error.response?.data || error.message);
// 	}
// };

// export default sendWhatsApp;