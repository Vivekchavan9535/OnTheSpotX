import mongoose from 'mongoose';
import serviceValidationSchema from '../validations/service-validation.js'
import Service from '../model/service-model.js'

const serviceCtrl = {};

serviceCtrl.create = async (req, res) => {
	const body = req.body;
	const { error, value } = serviceValidationSchema.validate(body)
	if (error) {
		return res.status(400).json({error:error.message})
	}

	try {
		const existingService = await Service.findOne({ title: value.title })
		
		if (existingService) {
			return res.status(409).json({error:"Service is already exists"})
		}
		const service = await Service.create(value)
		res.status(201).json(service)
	} catch (err) {
		res.status(500).json({error:err.message});
	}
}


serviceCtrl.list = async (req, res) => {
	try {
		const services = await Service.find();
		res.status(200).json(services)
	} catch (err) {
		res.status(500).json({error:err.message})
	}
}

serviceCtrl.show = async (req, res) => {
	const id = req.params.id;
	try {
		const service = await Service.findById({ _id: id });
		if (!service) {
			return res.status(404).json("Service not found!")
		}
		res.status(200).json(service)
	} catch (err) {
		res.status(500).json({error:err.message})
	}
}

serviceCtrl.update = async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const { error, value } = serviceValidationSchema.validate(body)

	if (error) {
		return res.status(400).json(error.details);
	}
	try {
		const service = await Service.findOneAndUpdate({ _id: id }, value,{new:true})
		if (!service) {
			return res.status(404).json("Service not found!")
		}
		res.status(201).json(service)
	} catch (error) {
		res.status(500).json(error.message)
	}
}

serviceCtrl.remove = async (req, res) => {
	const id = req.params.id;
	try {
		const service = await Service.findOneAndDelete(
			{ _id: id })
		if (!service) {
			return res.status(404).json("Service not found");
		}
		res.status(200).json("Service successfully deleted!")
	} catch (error) {
		res.status(500).json(error.message)
	}
}


export default serviceCtrl;