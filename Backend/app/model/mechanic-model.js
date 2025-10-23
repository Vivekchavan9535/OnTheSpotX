import mongoose from 'mongoose'

const mechanicSchema = new mongoose.Schema({
	firstName:{
		type:String,
		required:true
	},
	lastName:{
		type:String,
		required:true	
	},
	specialization: {
		type: String,  //car, bike , both\
		enum:['two-wheeler','four-wheeler','both']
	},
	experience: {
		type: Number
	},
	rating: {
		type: Number,
		default: 0
	},
	isVerified: {
		type: Boolean,
		default: true
	},
	location: {
		latitude: Number,
		longitude: Number,
		address: String
	}
})

export const Mechanic = mongoose.model("Mechanic", mechanicSchema)