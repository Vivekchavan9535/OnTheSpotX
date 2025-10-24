import Joi from 'joi'

const mechanicValidtionSchema = Joi.object({
	firstName:Joi.string().required().min(3).max(20),
	lastName:Joi.string().required().min(3).max(20),
	phone:Joi.string().required().min(10),
	email:Joi.string().email().required(),
	specialization:Joi.string().required(),
	experience:Joi.number().required(),	
})

export default mechanicValidtionSchema;