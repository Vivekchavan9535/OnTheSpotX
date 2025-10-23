import Joi from 'joi'

const mechanicValidtionSchema = Joi.object({
	name:Joi.srting().required().min(3).max(20),
	phone:Joi.string().required().min(10),
	email:Joi.string().email().required(),
	password:Joi.string().required().min(6).max(20),
	specialization:Joi.string().required(),
	experience:Joi.number().required(),	
})