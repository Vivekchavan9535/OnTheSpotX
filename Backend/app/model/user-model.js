import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select:false
	},
	role: {
		type: String,
		enum: ['admin', 'customer', 'mechanic'],
		default: "customer",
		required: true,
		index: true
	},
}, { timestamps: true })


const User = mongoose.model('User', userSchema)

export default User