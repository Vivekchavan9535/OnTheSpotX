import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	mechanicId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Mechanic",
	},
	serviceId: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"Service",
		required:true
	},
	issueDescription: {
		type: String,
		required: true
	},
	vehicleType: {
		type: String,
		enum: ["two-wheeler", "four-wheeler"],
		required: true
	},
	status: {
		type: String,
		enum: ["pending", "accepted", "onRoute", "arrived", "inProgress", "completed", "cancelled"],
		default: "pending"
	},
	userLocation: {
		latitude: {
			type: Number,
			required: true
		},
		longitude: {
			type: Number,
			required: true
		},
		address: { 
			type: String
		}
	},
	mechanicLocation: {
		latitude: { type: Number },
		longitude: { type: Number },
		address: { type: String }
	},
	distance: {
		type: Number // Distance in kilometers or meters
	},
	estimatedTime: {
		type: Number // Time in minutes
	},
	totalCost: {
		type: Number
	},
	completedAt: {
		type: Date
	},

}, { timestamps: true });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;