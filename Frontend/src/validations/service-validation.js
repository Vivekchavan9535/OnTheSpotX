import Joi from "joi";

const serviceValidationSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title must be less than or equal to 100 characters",
  }),
  description: Joi.string().trim().min(10).max(1000).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description must be less than or equal to 1000 characters",
  }),
  basePrice: Joi.number().min(0).required().messages({
    "number.base": "Base price must be a number",
    "number.min": "Base price cannot be negative",
    "any.required": "Base price is required",
  }),
});

export default serviceValidationSchema;
