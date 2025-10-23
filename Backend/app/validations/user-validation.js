import Joi from 'joi'

export const userRegisterValidationSchema = Joi.object({
	username:Joi.string().required(),
	email:Joi.string().email().lowercase().required(),
	phone:Joi.string().min(10).required(),
	password:Joi.string().trim().min(6).max(16).required(),
	role:Joi.string().required(),
	location:{
		latitude:Joi.number(),
		longitude:Joi.number(),
		address:Joi.string().required()
	},
	vehicleType:Joi.string().required()
})

export const userLoginValidationSchema=Joi.object({
	email:Joi.string().email().lowercase().required(),
	password:Joi.string().trim().min(6).max(16).required(),
})

