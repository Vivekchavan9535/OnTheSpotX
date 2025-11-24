// src/controller/webhook-controller.js
import axios from "axios";
import ServiceRequest from "../model/serviceRequest-model.js";
import Mechanic from "../model/mechanic-model.js";
import sendWhatsApp from "../controller/notification-controller.js";

const webhookUrl = "https://webhook.site/ce2753cf-967f-4d5b-86bd-6af0a6949dbd";
const webhookCtrl = {};

/**
 * Webhook handler for WhatsApp replies from mechanics.
 * Expect short replies: "1" = accept, "2" = reject.
 *
 * Atomic operations used to avoid race conditions:
 *  - findOneAndUpdate(...) for accepting a waiting request
 *  - findOneAndUpdate(...) for reopening an accepted request (on reject)
 */
webhookCtrl.handleWhatsapp = async (req, res) => {
  try {
    // mirror webhook payload to debugging site
    await axios.post(webhookUrl, { received: req.body });

    const messageText = (req.body?.data?.body || "").trim().slice(0, 1);
    const from = (req.body?.data?.from)
    console.log(`Webhook msg: "${messageText}" from: ${from}`);

    if (!messageText) {
      return res.status(409).json("Response is empty");
    }

    const mechanic = await Mechanic.findOne({ phone: from });
    if (!mechanic) {
      console.warn(`Mechanic not found for phone: ${from}`);
      return res.status(404).json("Mechanic not found");
    }

    // Try to find a waiting request that includes this mechanic
    let request = await ServiceRequest.findOne({
      status: "waiting",
      "nearbyMechanics.mechanicId": mechanic._id
    }).sort({ createdAt: -1 });

    // If not found, check if this mechanic already accepted a request earlier
    let alreadyAccepted = null;
    if (!request) {
      alreadyAccepted = await ServiceRequest.findOne({
        status: "accepted",
        mechanicId: mechanic._id
      });
    }

    // Accept (1)
    if (messageText === "1") {
      // Attempt atomic claim: only match waiting requests that include this mechanic
      const updated = await ServiceRequest.findOneAndUpdate(
        {
          status: "waiting",
          "nearbyMechanics.mechanicId": mechanic._id
        },
        {
          $set: {
            status: "accepted",
            mechanicId: mechanic._id,
            acceptedAt: new Date()
          }
        },
        { new: true } // return the updated document
      );

      if (!updated) {
        // nothing matched -> either already accepted by someone else, or no request
        // Check if mechanic already accepted one
        const already = await ServiceRequest.findOne({
          status: "accepted",
          mechanicId: mechanic._id
        });

        if (already) {
          await sendWhatsApp(from, "⚠️ You have already accepted a request.");
          return res.status(200).json("Already accepted by same mechanic");
        }

        // else someone else likely accepted it or there was no active request
        await sendWhatsApp(from, "⚠️ This request was already accepted by another mechanic or not available.");
        return res.status(409).json("Already accepted / not available");
      }

      // Success: 'updated' is the document that was accepted by this mechanic
      // Send mechanic a link that includes the request id so they can open your finding-mechanics (or assigned) page
      const frontendBase = process.env.FRONTEND_URL || "https://onthespotx.vercel.app";
      const link = `${frontendBase}/finding-mechanics?req=${updated._id}`;

      await sendWhatsApp(from, `✅ You have been assigned the service request.\nOpen here: ${link}`);

      console.log(`Mechanic ${mechanic.phone} accepted request ${updated._id}`);

      // Notify other nearby mechanics that the request was taken
      const otherMechanics = (updated.nearbyMechanics || []).filter(
        (m) => String(m.mechanicId) !== String(mechanic._id)
      );

      for (const other of otherMechanics) {
        try {
          await sendWhatsApp(other.phone, "ℹ️ This request was accepted by another mechanic.");
        } catch (e) {
          console.warn("Failed to notify other mechanic:", other.phone, e.message);
        }
      }

      return res.status(200).json("Mechanic accepted the request");
    }

    // Reject (2)
    if (messageText === "2") {
      // Mechanic is trying to reject a request they accepted earlier
      // Find an accepted request assigned to this mechanic
      const accepted = alreadyAccepted;
      if (!accepted) {
        await sendWhatsApp(from, "❌ You haven't accepted any request to reject.");
        console.log(`Mechanic ${from} tried to reject but had no accepted assignment.`);
        return res.status(200).json("Mechanic tried to reject but not assigned");
      }

      // Attempt atomic reopen only if this mechanic is still the assigned one
      const reopened = await ServiceRequest.findOneAndUpdate(
        {
          _id: accepted._id,
          mechanicId: mechanic._id,
          status: "accepted"
        },
        {
          $set: {
            status: "waiting",
            mechanicId: null,
            reopenedAt: new Date()
          }
        },
        { new: true }
      );

      if (!reopened) {
        await sendWhatsApp(from, "❌ Could not reopen — request changed or was reassigned.");
        console.log(`Mechanic ${from} tried to reopen request ${accepted._id} but it changed.`);
        return res.status(409).json("Could not reopen");
      }

      await sendWhatsApp(from, "❌ You have rejected this request. It’s now open again for others.");
      console.log(`Mechanic ${from} rejected and reopened request ${reopened._id}.`);

      // Re-notify nearby mechanics (exclude the one who rejected)
      for (const mech of reopened.nearbyMechanics.filter((mech) => String(mech.phone) !== String(from))) {
        try {
          const distance = mech.distanceMeters < 1000
            ? `${mech.distanceMeters} m`
            : `${(mech.distanceMeters / 1000).toFixed(1)} km`;

          await sendWhatsApp(
            mech.phone,
            `🔧 *Hey Mechanic!* You have a new service request:\n\n` +
              `🚗 *Vehicle:* ${reopened?.vehicleType}\n` +
              `⚠️ *Issue:* ${reopened?.issueDescription}\n` +
              `📍 *Location:* ${reopened?.userLocation?.address}\n` +
              `📏 *Distance:* ${distance}\n\n` +
              `Reply with:\n` +
              `✅ *1* — *Accept*\n` +
              `❌ *2* — *Reject*`
          );
          console.log(`Sent to nearby mechanic: ${mech?.name || mech.phone}`);
        } catch (e) {
          console.warn("Failed to re-notify mechanic:", mech.phone, e.message);
        }
      }

      return res.status(200).json("Mechanic rejected and reopened the request");
    }

    // Not a valid response
    console.log("Not valid response:", messageText);
    return res.status(409).json("Not valid response");
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return res.status(500).json("webhook error: " + (error.message || String(error)));
  }
};

// Optional reset route for testing (keeps your original reset behavior)
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
