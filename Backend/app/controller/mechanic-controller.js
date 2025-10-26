import mongoose from 'mongoose';
import Mechanic from '../model/mechanic-model.js';
import User from '../model/user-model.js';
import mechanicValidtionSchema from '../validations/mechanic-validation.js'

export const mechCtrl = {}


mechCtrl.create = async (req, res) => {
	const userId = req.userId //taking userId from authentication req obj middleware
	const body = req.body
	
	const {error,value}= mechanicValidtionSchema.validate(body);
	value.userId = userId	

	if(error){
		return res.status(400).json(error.message)
	}

	try {
		const existingMechanic = await Mechanic.findOne({ userId })
		if (existingMechanic) {
			return res.status(400).json("Mechanic profile is already created!!")
		}
		const mechanic = await Mechanic.create(value)
		res.status(201).json(mechanic)
	} catch (error) {
		res.status(401).json(error.message)
	}

}

mechCtrl.list = async(req,res)=>{
 try {
	const allMechanics = await Mechanic.find()
	res.status(200).json(allMechanics)
 } catch (error) {
	res.status(500).json(error.message)
 }
}


mechCtrl.show = async(req,res)=>{
	const id = req.params.id;
	try {
		const mechanic = await Mechanic.findById(id)
		if(!mechanic){
			return res.status(404).json("mechanic not found")
		}
		res.status(200).json(mechanic)
	} catch (error) {
		res.status(500).json(erorr.message)
	}
}

mechCtrl.update=async(req,res)=>{
	const id = req.params.id;
	const body=req.body;
	const {error,value} = mechanicValidtionSchema.validate(body)
	if(error){
		res.status(400).json(error.details)
	}
	try {
		const mechanic = await Mechanic.findOneAndUpdate({_id:id,userId:req.userId},value,{new:true})
		console.log(mechanic);
		
		if(!mechanic){
			return res.status(404).json("Mechanic not found")
		}
		res.status(200).json(mechanic)

	} catch (error) {
		res.status(500).json(error.message)
	}
}


mechCtrl.delete = async(req,res)=>{
	const id = req.params.id;
	console.log(id);
	
	try {
		const mechanic = await Mechanic.findOneAndDelete({_id:id, userId:req.userId})
		if(!mechanic){
			return res.json("Mechanic not found")
		}
		res.status(200).json("Successfully deleted")
	} catch (error) {
		res.status(500).json(error.message)
	}
}