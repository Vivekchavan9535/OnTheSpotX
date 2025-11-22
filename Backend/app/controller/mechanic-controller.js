import mongoose from 'mongoose';
import Mechanic from '../model/mechanic-model.js';
import User from '../model/user-model.js';
import mechanicValidtionSchema from '../validations/mechanic-validation.js'

export const mechCtrl = {};


mechCtrl.create = async (req, res) => {
	const userId = req.userId //taking userId from authentication req obj middleware
	const body = req.body

	const { error, value } = mechanicValidtionSchema.validate(body);
	value.userId = userId

	if (error) {
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

mechCtrl.list = async (req, res) => {
	try {
		const allMechanics = await Mechanic.find()
		res.status(200).json(allMechanics)
	} catch (error) {
		res.status(500).json(error.message)
	}
}


mechCtrl.show = async (req, res) => {
	const id = req.params.id;
	try {
		const mechanic = await Mechanic.findById(id)
		if (!mechanic) {
			return res.status(404).json("mechanic not found")
		}
		res.status(200).json(mechanic)
	} catch (error) {
		res.status(500).json(erorr.message)
	}
}

// Show mechanic profile by user ID
mechCtrl.mechProfile = async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const mechanic = await Mechanic.findOne({ userId: user._id });

		if (!mechanic) {
			return res.status(404).json({ error: "Mechanic not found" });
		}
		res.status(200).json(mechanic);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


mechCtrl.update = async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const { err, value } = mechanicValidtionSchema.validate(body)
	if (err) {
		return res.status(400).json({err:error.details})
	}
	try {
		const mechanic = await Mechanic.findOneAndUpdate({ _id: id, userId: req.userId }, value, { new: true })

		if (!mechanic) {
			return res.status(404).json({error:"Mechanic not found"})
		}
		res.status(200).json(mechanic)

	} catch (err) {
		res.status(500).json({erorr:err.message})
	}
} 


mechCtrl.delete = async (req, res) => {
	const id = req.params.id;
	console.log(id);

	try {
		const mechanic = await Mechanic.findOneAndDelete({ _id: id, userId: req.userId })
		if (!mechanic) {
			return res.json("Mechanic not found")
		}
		res.status(200).json("Successfully deleted")
	} catch (error) {
		res.status(500).json(error.message)
	}
}