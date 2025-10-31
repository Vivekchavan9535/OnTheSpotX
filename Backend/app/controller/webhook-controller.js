import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";

const webhookCtrl = {};

webhookCtrl.handleWhatsapp = async (req, res) => {
  try {
    // Extract the incoming WhatsApp message data
    const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
    const from = (req.body?.data?.from || "").trim().replace("@c.us", "");

    console.log(`Message: ${messageText}, From: ${from}`);

    if (!messageText) {
      return res.status(400).json("Response is empty");
    }

    // Find mechanic by phone number
    const mechanic = await Mechanic.findOne({ phone: from });
    if (!mechanic) {
      console.log("Mechanic not found:", from);
      return res.status(404).json("Mechanic not found");
    }

    // Mechanic accepted (sent '1')
    if (messageText === "1") {
      await sendWhatsApp(from, "You have been assigned the service request.");
      console.log(`${from} accepted the request`);

      // You can update the ServiceRequest here if needed
      // await ServiceRequest.findOneAndUpdate({ status: "waiting" }, { status: "accepted", mechanicId: mechanic._id });

      return res.status(200).json("Mechanic accepted the request");
    }

    // Mechanic rejected (sent '2')
    if (messageText === "2") {
      await sendWhatsApp(from, "You have rejected this request.");
      console.log(`❌ ${from} rejected the request`);
      return res.status(200).json("Mechanic rejected the request");
    }

    console.log("Invalid response received");
    return res.status(400).json("Invalid response");

  } catch (error) {
    console.log("Webhook error:", error.message);
    res.status(500).json("webhook error: " + error.message);
  }
};

export default webhookCtrl;
