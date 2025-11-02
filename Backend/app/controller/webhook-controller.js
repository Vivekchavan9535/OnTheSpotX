import axios from 'axios';
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";

const webhookUrl = "https://bin.webhookrelay.com/v1/webhooks/e60b47ee-f89e-4eaf-bb01-021be6f0f16a";
const webhookCtrl = {};

webhookCtrl.handleWhatsapp = async (req, res) => {
	try {
		await axios.post(webhookUrl, { received: req.body });

		const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
		const from = (req.body?.data?.from || "").slice(2).trim().replace("@c.us", "");

		//wati problem issue temp solution
		if (
			from.includes("wati") ||
			from.includes("broadcast") ||
			from.includes("wa.me"))
			 {
			// Immediately return and don't log anything
			return res.status(200).end();
		}


		console.log(`Message : ${messageText}, \nFrom : ${from}`);

		if (!messageText) return res.status(409).json("Response is empty");

		const mechanic = await Mechanic.findOne({ phone: from });
		if (!mechanic) return res.status(404).json("Mechanic not found");

		// try to find the request accepted by this mechanic
		let request = await ServiceRequest.findOne({
			status: "accepted",
			mechanicId: mechanic._id
		});

		// if none then find the latest waiting request
		if (!request) {
			request = await ServiceRequest.findOne({ status: "waiting" }).sort({ createdAt: -1 });
		}


		// Handle accept (1)
		if (messageText === "1") {
			if (request.status === "waiting") {
				request.status = "accepted";
				request.mechanicId = mechanic._id;
				await request.save();

				await sendWhatsApp(from, "✅ You have been assigned the service request.");
				console.log(`${from} accepted the request`);

				// Notify others
				const otherMechanics = request.nearbyMechanics.filter(
					(m) => String(m.mechanicId) !== String(mechanic._id)
				);

				for (const other of otherMechanics) {
					await sendWhatsApp(other.phone, "ℹ️ This request was accepted by another mechanic.");
				}

				return res.status(200).json("Mechanic accepted the request");
			}

			// If already accepted by this mechanic
			if (String(request.mechanicId) === String(mechanic._id)) {
				await sendWhatsApp(from, "⚠️ You have already accepted this request.");
				return res.status(200).json("Already accepted by same mechanic");
			}

			// If accepted by someone else
			await sendWhatsApp(from, "⚠️ This request was already accepted by another mechanic.");
			return res.status(200).json("Already accepted by someone else");
		}



		// ✅ Handle REJECT (2)
		if (messageText === "2") {
			//handle reject and re notify
			if (request.status === "accepted" && String(request.mechanicId) === String(mechanic._id)) {
				request.status = "waiting";
				request.mechanicId = null;
				await request.save();

				await sendWhatsApp(from, "❌ You have rejected this request. It’s now open again for others.");




				//re notify nearby mechanics // im using for..of loop bcz sendWhatsapp is async
				for (const mech of request.nearbyMechanics.filter((mech) => String(mech.phone) !== String(from))) {

					console.log(mech.phone !== from);

					const distance = mech.distanceMeters < 1000
						? `${mech.distanceMeters} m`
						: `${(mech.distanceMeters / 1000).toFixed(1)} km`;

					await sendWhatsApp(
						mech.phone,
						`🚨 New Service Request 🚨\n
Vehicle: ${request.vehicleType}
Issue: ${request.issueDescription}
Location: ${request.userLocation?.address}
Distance: ${distance}\n
Reply with:\n👉 1 to ACCEPT\n👉 2 to REJECT`
					);

					console.log(`Sent to nearby mechanics : ${mech.firstName}`);
				}

				console.log(`Mechanic ${from} rejected and reopened the request.`);
				return res.status(200).json("Mechanic rejected and reopened the request");
			}
			await sendWhatsApp(from, "❌ You have rejected this request.");
			console.log(`Mechanic ${from} rejected but was not assigned.`);
			return res.status(200).json("Mechanic rejected but not assigned");
		}

		console.log("Not valid response");
		return res.status(409).json("Not valid response");

	} catch (error) {
		console.log("Error in webhook:", error.message);
		res.status(500).json("webhook error: " + error.message);
	}
};







// ✅ Optional Reset API (for testing)
webhookCtrl.resetAllRequests = async (req, res) => {
	try {
		const result = await ServiceRequest.updateMany(
			{ status: "accepted" },
			{ $set: { status: "waiting", mechanicId: null } }
		);

		console.log(`Reset ${result.modifiedCount} accepted requests to waiting`);
		res.status(200).json({
			message: "All accepted requests reset to waiting",
			modified: result.modifiedCount
		});
	} catch (err) {
		console.log("Error resetting requests:", err.message);
		res.status(500).json({ error: err.message });
	}
};

export default webhookCtrl;

