import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	mechanicId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Mechanic",
		required: true
	},
	serviceRequestId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ServiceRequest",
		required: true
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		default: 0
	},
	comment: {
		type: String,
		trim: true
	}
}, {timestamps:true})

const Review = mongoose.model('Review', reviewSchema);
export default Review;