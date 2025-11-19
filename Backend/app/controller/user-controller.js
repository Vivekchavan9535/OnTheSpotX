import mongoose from "mongoose";
import { userRegisterValidationSchema, userLoginValidationSchema } from "../validations/user-validation.js";
import User from "../model/user-model.js";
import Mechanic from "../model/mechanic-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userCtrl = {};

userCtrl.register = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { error, value } = userRegisterValidationSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.message });

		if (await User.findOne({ email: value.email }).session(session))
			return res.status(409).json({ error: "User email is already taken" });

		if (await User.findOne({ phone: value.phone }).session(session))
			return res.status(409).json({ error: "Phone number already exists" });

		value.password = await bcrypt.hash(value.password, 10);

		const created = await User.create([value], { session });
		const user = created[0];

		let mechanic = null;
		if (user.role === "mechanic") {
			const { location, specialization, experience } = req.body;
			const mechCreated = await Mechanic.create(
				[
					{
						userId: user._id,
						fullName: user.fullName,
						email: user.email,
						phone: user.phone,
						location: location || { latitude: 0, longitude: 0, address: "" },
						specialization: specialization || "both",
						experience: experience || 0,
					},
				],
				{ session }
			);
			mechanic = mechCreated[0];
		}

		await session.commitTransaction();
		return res.status(201).json({ user, mechanic });
	} catch (err) {
		await session.abortTransaction();
		return res.status(500).json({ error: err.message });
	} finally {
		session.endSession();
	}
};

userCtrl.login = async (req, res) => {
	try {
		const { error, value } = userLoginValidationSchema.validate(req.body);
		if (error) return res.status(401).json({ error: "Invalid email/password" });

		const user = await User.findOne({ email: value.email });
		if (!user) return res.status(404).json({ error: "User not found" });

		const ok = await bcrypt.compare(value.password, user.password);
		if (!ok) return res.status(401).json({ error: "Invalid email/password" });

		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY);
		return res.json({ token });
	} catch {
		return res.status(500).json({ error: "Something went wrong" });
	}
};

userCtrl.account = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

userCtrl.list = async (req, res) => {
	try {
		const page = Math.max(1, Number(req.query.page) || 1);
		const limit = Math.max(1, Number(req.query.limit) || 10);
		const skip = (page - 1) * limit;

		const q = req.query.q || "";
		const regex = new RegExp(q, "i");

		const filter = {
			$or: [
				{ fullName: regex },
				{ email: regex },
				{ phone: regex },
				{ role: regex }
			]
		};

		// paginated + searched users
		const users = await User.find(filter)
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		// total matching records
		const totalUsers = await User.countDocuments(filter);

		return res.json({
			users,
			currentPage: page,
			totalPages: Math.ceil(totalUsers / limit),
			totalUsers
		});

	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};


userCtrl.show = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ error: "User not found" });

		let mechanic = null;
		if (user.role === "mechanic") mechanic = await Mechanic.findOne({ userId: user._id });

		return res.json({ user, mechanic });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

userCtrl.remove = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		return res.json(user);
	} catch {
		return res.status(500).json({ error: "Something went wrong" });
	}
};
