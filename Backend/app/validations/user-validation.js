import Joi from 'joi'

export const userRegisterValidationSchema = Joi.object({
	fullName:Joi.string().required(),
	email:Joi.string().email().lowercase().required(),
	phone:Joi.string().min(10).required(),
	password:Joi.string().trim().min(6).max(16).required(),
	role:Joi.string().required(),
	location:Joi.object({
		latitude:Joi.number(),
		longitude:Joi.number(),
		address:Joi.string()
	}).optional(),
	specialization:Joi.string().optional(),
	experience:Joi.number().optional()
	// vehicleType:Joi.string().required()
}).unknown(true); // Allow extra fields like experience, specialization for mechanics

export const userLoginValidationSchema=Joi.object({
	email:Joi.string().email().lowercase().required(),
	password:Joi.string().trim().min(6).max(16).required(),
})

