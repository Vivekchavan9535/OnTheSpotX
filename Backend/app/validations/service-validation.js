import Joi from 'joi';

const serviceValidationSchema = Joi.object({
	title: Joi.string().min(4).max(40).required(),
	description: Joi.string().min(0).max(200),
	basePrice: Joi.number().required()
});


export default serviceValidationSchema;