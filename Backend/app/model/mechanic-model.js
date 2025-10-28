import mongoose from 'mongoose'

const mechanicSchema = new mongoose.Schema({
	userId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true,
	},
	firstName:{
		type:String,
		required:true
	},
	lastName:{
		type:String,
		required:true	
	},
	phone: {
		type: String,
		required: true,
		unique: true
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
		latitude: {type:Number, required:true},
		longitude: {type:Number, required:true},
		address: String
	}
},{timestamps:true})

const Mechanic = mongoose.model("Mechanic", mechanicSchema);
export default Mechanic;