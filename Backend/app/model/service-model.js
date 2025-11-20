import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
	title:{type:String}, //eg: towing , jumpstart, Puncture, Engine-problem
	description:String,
	basePrice:{
		type:Number,
		required: true
	}
},{ timestamps: true })

const Service = mongoose.model('Service',serviceSchema)
export default Service;