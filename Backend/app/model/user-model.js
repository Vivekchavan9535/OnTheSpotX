import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['admin', 'customer', 'mechanic'],
		default: "customer",
		required: true
	},
	location: {
		latitude: {
			type: Number,
		},
		longitude: {
			type: Number,
		},
		address: {
			type: String,
		}
	},
	vehicleType: {
		type: String,
	}

}, { timestamps: true })


const User = mongoose.model('User', userSchema)

export default User