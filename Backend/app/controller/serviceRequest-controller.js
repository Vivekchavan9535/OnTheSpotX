import mongoose from 'mongoose';
import ServiceRequest from '../model/serviceRequest-model.js';
import Service from '../model/service-model.js'
import Mechanic from '../model/mechanic-model.js'

const serviceReqCtrl={};



serviceReqCtrl.create = async(req,res)=>{
	const body = req.body;

	//from req.body we get serviceID by that service id we check service info
	const serviceType = await Service.findById(body.serviceId)

	//if  no service found
	if(!serviceType){
		return res.status(404).json("Service not found");
	}

	//return all the mechanics
	const mechanics = await Mechanic.find()
	console.log(mechanics);
	
	

	try {
		const serviceReq = await ServiceRequest.create(body)
		res.status(201).json(serviceReq)
	} catch (error) {
		res.status(500).json(error.message)
	}
}

export default serviceReqCtrl;