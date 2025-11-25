import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	serviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Service",
		required: true,
	},
	customerPhone:{
		type:String,
		required:true
	},
	vehicleType:{
		type:String,
		enum:["two-wheeler","three-wheeler","four-wheeler"]
	},
	issueDescription:{
		type:String
	},
	userLocation: {
		latitude: Number,
		longitude: Number,
		address: String,
	},
	basePrice:{
		type:Number
	},
	distanceMeters:{
		type:Number
	},
	status: {
		type: String,
		enum: ["waiting", "accepted", "rejected", "cancelled", "completed", "no-mechanic-found"],
		default: "waiting",
	},
	nearbyMechanics: [
		{
			mechanicId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Mechanic",
			},
			name: String,
			phone: String,
			distanceMeters: Number,
			notifiedAt: Date,
			response: {
				type: String,
				enum: ["pending", "accepted", "rejected"],
				default: "pending",
			},
		},
	],
	mechanicId: {
		type: mongoose.Schema.Types.ObjectId,
		ref:"Mechanic"
	},
	lastNotifiedAt: {
		type: Date,
	},
}, { timestamps: true });

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
