import Joi from "joi";

const SignupValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$")
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 6 characters long and include one uppercase, one lowercase, one number, and one special character.",
      "string.empty": "Password is required.",
      "any.required": "Password is a mandatory field.",
    }),
  role: Joi.string().valid("customer", "mechanic", "admin").required(),

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

export default SignupValidationSchema;
