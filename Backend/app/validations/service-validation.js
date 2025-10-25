import Joi from 'joi';

const serviceValidationSchema = Joi.object({
	name: Joi.string().min(4).max(40).required(),
	description: Joi.string().min(0).max(40),
	basePrice: Joi.number().required()
});


export default serviceValidationSchema;