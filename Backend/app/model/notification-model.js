import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
	receiverId: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: "receiverModel", //dynamic reference to User or Mechanic
	},
	receiverModel: {
		type: String,
		enum: ["User", "Mechanic"]
	},
	type: {
		type: String,
		enum: ["service_update", "payment", "review_request"]
	},
	message: {
		type: String,
		required: true,
		trim: true
	},
	isRead: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification;