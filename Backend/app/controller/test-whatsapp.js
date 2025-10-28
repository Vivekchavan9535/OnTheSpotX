import axios from 'axios';

const instanceId = "instance147843";
const token = "9u7numn8ug2qx1xy";



const sendWhatsApp = async (to) => {
  try {
    await axios.post(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      token,
      to,
      body: `🚗 *Service Request (Test)*\n\n🛵 Vehicle: Two-wheeler\n⚙️ Issue: Flat tire\n📍 Location: MG Road\n\nReply with:\n👉 1 to ACCEPT\n👉 2 to REJECT`,
    });
    console.log("✅ Message sent!");
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
};

sendWhatsApp("6364151684"); // Replace with your WhatsApp number
