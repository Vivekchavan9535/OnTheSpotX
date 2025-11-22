import Joi from "joi";

export const mechanicValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  location: Joi.when("role", {
	is: "mechanic",
	then: Joi.object({
	  latitude: Joi.number().required(),
	  longitude: Joi.number().required(),
	  address: Joi.string().optional(),
	}).required(),
	otherwise: Joi.optional().allow(null, ""),
  }),
  experience: Joi.number().min(0).optional(),
  specialization: Joi.when("role", {
	is: "mechanic",
	then: Joi.string().valid("two-wheeler", "four-wheeler", "both").required(),
	otherwise: Joi.allow(null, ""),
  }),
});

