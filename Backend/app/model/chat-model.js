import mongoose from 'mongoose';


const chatSchema = new mongoose.Schema({
	requestId: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"ServiceRequest",
		required:true
	},
	senderId: {
		type:mongoose.Schema.Types.ObjectId,
		refPath:"senderModel"
	},
	senderModel: {
		type: String,
		enum: ["User", "Mechanic"],
		required:true
	},
	message: {
		type: String,
		required: true,
		trim: true
	},
	messageType: {
		type: String,
		enum: ["text", "image"],
		default: "text"
	},
	isSeen: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

const Chat = mongoose.model('Chat',chatSchema)
export default Chat;