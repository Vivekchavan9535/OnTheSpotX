import mongoose from 'mongoose';
import {Mechanic} from '../model/mechanic-model.js';

export const mechCtrl = {}

mechCtrl.create=async (req,res)=>{
	const body = req.body
	try {
		const mechanic = await Mechanic.create(body)
		res.status(201).json(mechanic)
	} catch (error) {
		res.status(401).json(error.message)
	}

}