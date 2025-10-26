import Joi from 'joi'

const mechanicValidtionSchema = Joi.object({
	firstName: Joi.string().required().min(3).max(20),
	lastName: Joi.string().required().min(3).max(20),
	phone: Joi.string().required().min(10),
	email: Joi.string().email().required(),
	specialization: Joi.string().required(),
	experience: Joi.number().required(),
	location: Joi.object({
		latitude: Joi.number().min(-90).max(90).required(),
		longitude: Joi.number().min(-180).max(180).required(),
		address: Joi.string().min(3).max(255).optional(),
	}).required(),
})

export default mechanicValidtionSchema;