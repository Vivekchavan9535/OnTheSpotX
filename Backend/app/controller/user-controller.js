import mongoose from 'mongoose';
import { userRegisterValidationSchema,userLoginValidationSchema } from '../validations/user-validation.js';
import User from '../model/user-model.js'
import bcrypt from "bcrypt" ;
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'


dotenv.config()

export const userCtrl = {}


//creates new user
userCtrl.register = async (req, res) => {
	const body = req.body;

	try {
		const { error, value } = userRegisterValidationSchema.validate(body)

		//checks  if the user email is already stored inn db
		const userEmail = await User.findOne({ email: value.email })

		//id email is present in db it means the email is already taken
		if (userEmail) {
			return res.json("user email is already taken")
		}

		//hashed password before saving in db
		const hashedPassword =await bcrypt.hash(value.password,10)
		value.password = hashedPassword
		
		//saving the registered data in database
		const user = await User.create(value)
		res.json(user)
	} catch (error) {
		res.status(500).json(error.message)

	}
};


userCtrl.login = async (req,res)=>{
	const body = req.body;
	try {
		const {error,value}= userLoginValidationSchema.validate(body)
		if(error){
			res.status(401).json("Invalid email/password")
		}
		const user = await User.findOne({email:value.email})

		//if user is not found in db 
		if(!user){
			return res.status(404).json("user not found")
		}

		//if found we will compare hashedpassword with input password
		const passwordMatched = await bcrypt.compare(value.password,user.password)

		if(!passwordMatched){
			return res.status(409).json("Invalid email/password")
		}

		const tokenData = {userId:user._id, role:user.role}
		const token = jwt.sign(tokenData, process.env.SECRET_KEY)
		res.json({"token":token})
	} catch (error) {
		res.status(500).json({errors:'Something went wrong'})
	}
}

userCtrl.account=async(req,res)=>{
	try {
		const user = await User.findById(req.userId)
		res.json(user)
	} catch (error) {
		res.status(500).json({errors:error.message})
	}
}

//list all users
userCtrl.list = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error("Error in /users route:", error.message)
    res.status(500).json({ error: error.message })
  }
}

//show single user
userCtrl.show =  async(req,res)=>{
	const id = req.params.id
	
	try {
		const user = await User.findById(id)
		
		if(!user){
			return res.status(404).json("User not found!")
		}
		res.json(user)
	} catch (error) {
		res.status(500).json(error.message)
	}
}

//remove the user
userCtrl.remove = async(req,res)=>{
	const id = req.params.id
	try {
		const user = await User.findByIdAndDelete(id);
		res.json(user)
	} catch (error) {
		res.status(500).json({error:"Something went wrong"})		
	}
}

