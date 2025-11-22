// src/pages/Signup.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import UserContext from "../context/userContext";
import { useContext } from "react";
import Joi from "joi";
import axios from 'axios'
import SignupValidationSchema from "../validations/signup-validation.js"

export default function Signup() {
	const navigate = useNavigate();
	const { registerUser, serverErrors, userDispatch } = useContext(UserContext);
	const [locLoading, setLocLoading] = useState(false);

	// // Joi schema: location is an object when role === "mechanic"
	// const schema = Joi.object({
	// 	fullName: Joi.string().min(2).max(100).required().messages({
	// 		"string.empty": "Full name is required",
	// 		"string.min": "Full name must be at least 2 characters",
	// 	}),
	// 	phone: Joi.string()
	// 		.pattern(/^[6-9]\d{9}$/)
	// 		.required()
	// 		.messages({
	// 			"string.empty": "Phone is required",
	// 			"string.pattern.base": "Enter a valid 10-digit Indian number",
	// 		}),
	// 	email: Joi.string().email({ tlds: { allow: false } }).required().messages({
	// 		"string.empty": "Email is required",
	// 		"string.email": "Invalid email address",
	// 	}),
	// 	password: Joi.string().min(6).required().messages({
	// 		"string.empty": "Password is required",
	// 		"string.min": "Password must be at least 6 characters",
	// 	}),
	// 	role: Joi.string().valid("customer", "mechanic", "admin").required().messages({
	// 		"any.only": "Invalid role selected",
	// 		"string.empty": "Role is required",
	// 	}),

	// 	// when mechanic, require an object with latitude, longitude, address
	// 	location: Joi.any().when("role", {
	// 		is: "mechanic",
	// 		then: Joi.object({
	// 			latitude: Joi.number().required().messages({
	// 				"number.base": "Latitude must be a number",
	// 				"any.required": "Latitude is required",
	// 			}),
	// 			longitude: Joi.number().required().messages({
	// 				"number.base": "Longitude must be a number",
	// 				"any.required": "Longitude is required",
	// 			}),
	// 			address: Joi.string().allow("").required().messages({
	// 				"string.empty": "Address is required",
	// 			}),
	// 		}).required().messages({ "object.base": "Location must be an object" }),
	// 		otherwise: Joi.optional().allow("", null),
	// 	}),

	useEffect(() => {
		return () => {
			userDispatch({ type: "SERVER_ERRORS", payload: "" });
		}
	}, [])




	// map Joi error details -> Formik errors object
	const joiValidate = (values) => {
		const result = SignupValidationSchema.validate(values, { abortEarly: false, convert: true });
		if (!result.error) return {};

		const errors = {};
		for (const detail of result.error.details) {
			const key = detail.path.join(".");
			if (!errors[key]) errors[key] = detail.message.replace(/["]/g, "");
		}
		return errors;
	};

	const formik = useFormik({
		initialValues: {
			fullName: "",
			phone: "", // 10 digits only
			email: "",
			password: "",
			role: "customer",
			// mechanic-only: location is an object
			location: { latitude: "", longitude: "", address: "" },
			experience: "",
			specialization: "",
		},
		validate: joiValidate,
		onSubmit: async (values, { resetForm }) => {
			try {
				// normalize phone to +91... (ensure 10 digits)
				const onlyNums = String(values.phone || "").replace(/\D/g, "").slice(0, 10);
				const args = {
					fullName: values.fullName,
					phone: `+91${onlyNums}`,
					email: values.email,
					password: values.password,
					role: values.role,
				};

				if (values.role === "mechanic") {
					// ensure numeric coords are sent
					args.location = {
						latitude: Number(values.location.latitude),
						longitude: Number(values.location.longitude),
						address: values.location.address || "",
					};
					args.experience = Number(values.experience);
					args.specialization = values.specialization;
				}

				await registerUser(args, resetForm);
			} catch (err) {
				console.error("submit error:", err);
			}
		},
	});

	//reverse geo coding
	const reverseGeocode = async (lat, lon) => {
		try {
			const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
				lat
			)}&lon=${encodeURIComponent(lon)}`;

			const res = await axios.get(url, {
				headers: { Accept: "application/json" },
			});

			const data = res.data;
			const address =
				data.display_name ||
				(data.address && Object.values(data.address).join(", "));
			return address || "";
		} catch (e) {
			console.error("reverseGeocode error:", e);
			return "";
		}
	};

	const getAndFillLocation = () => {
		if (!navigator.geolocation) {
			alert("Geolocation not supported by your browser");
			return;
		}
		setLocLoading(true);

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					const { latitude, longitude } = position.coords;
					const address = await reverseGeocode(latitude, longitude);

					formik.setFieldValue("location", {
						latitude: Number(latitude),
						longitude: Number(longitude),
						address: address || "",
					});
				} catch (e) {
					console.error(e);
					alert("Could not get address from coordinates");
				} finally {
					setLocLoading(false);
				}
			},
			(err) => {
				console.error("geolocation error:", err);
				setLocLoading(false);
				if (err.code === 1) {
					alert("Permission denied. Please allow location access.");
				} else {
					alert("Could not get your location. Try the 'Use my location' button.");
				}
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);
	};

	// when role becomes mechanic and location empty, auto request location (small delay so input renders)
	useEffect(() => {
		if (formik.values.role === "mechanic" && !formik.values.location.address) {
			const t = setTimeout(() => getAndFillLocation(), 300);
			return () => clearTimeout(t);
		}
	}, [formik.values.role]);

	// helper to render location errors (Joi returns nested keys)
	const renderLocationError = () => {
		const err = formik.errors.location;
		if (!err) return null;
		if (typeof err === "string") return err;
		// object with possible keys: address, latitude, longitude
		return err.address || err.latitude || err.longitude || JSON.stringify(err);
	};



	return (
		<section className="flex items-center  justify-center px-6">
			<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
				<h1 className="text-2xl font-bold text-center mb-6">Register</h1>

				{/* Show server-side error (e.g. email already taken) */}
				{serverErrors && (
					<div className="text-red-500 text-sm mt-2 wrap-break-word">{serverErrors.error || String(serverErrors)}</div>
				)}

				<form className="space-y-4" onSubmit={formik.handleSubmit}>
					{/* Full Name */}
					<div>
						<label className="block text-sm font-medium mb-1">Full Name</label>
						<input
							name="fullName"
							type="text"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="John Doe"
							value={formik.values.fullName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.fullName && formik.errors.fullName && (
							<div className="text-red-500 text-xs mt-1">{formik.errors.fullName}</div>
						)}
					</div>

					{/* Phone with +91 prefix UI */}
					<div>
						<label className="block text-sm font-medium mb-1">Phone</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-semibold">+91</span>
							<input
								name="phone"
								type="tel"
								maxLength="10"
								className="w-full pl-14 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
								placeholder="6969696996"
								value={formik.values.phone}
								onChange={(e) => {
									const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
									formik.setFieldValue("phone", onlyNums);
								}}
								onBlur={formik.handleBlur}
							/>
						</div>
						{formik.touched.phone && formik.errors.phone && (
							<div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
						)}
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							name="email"
							type="email"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="admin@example.com"
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.email && formik.errors.email && (
							<div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
						)}
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							name="password"
							type="password"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="••••••••"
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.password && formik.errors.password && (
							<div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
						)}
					</div>

					{/* Role */}
					<label className="block text-sm font-medium mb-1">Register as</label>
					<div className="relative">
						<select
							name="role"
							value={formik.values.role}
							onChange={formik.handleChange}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
						>
							<option value="customer">Customer</option>
							<option value="mechanic">Mechanic</option>
						</select>
					</div>

					{/* Mechanic-only fields */}
					{formik.values.role === "mechanic" && (
						<>
							{/* Location */}
							<div>
								<label className="block text-sm font-medium mb-1">Location</label>
								<div className="flex gap-2">
									<input
										name="location.address"
										type="text"
										className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
										placeholder="City / Area"
										value={formik.values.location.address}
										onChange={(e) =>
											formik.setFieldValue("location", {
												...formik.values.location,
												address: e.target.value,
											})
										}
										onBlur={formik.handleBlur}
									/>
									<button
										type="button"
										onClick={getAndFillLocation}
										className="px-3 py-2 bg-gray-100 border rounded text-sm"
										disabled={locLoading}
									>
										{locLoading ? "Locating..." : "Use my location"}
									</button>
								</div>

								{formik.touched.location && formik.errors.location && (
									<div className="text-red-500 text-xs mt-1">{renderLocationError()}</div>
								)}
							</div>

							{/* hidden coords */}
							<input type="hidden" name="latitude" value={formik.values.location.latitude} />
							<input type="hidden" name="longitude" value={formik.values.location.longitude} />

							{/* Experience */}
							<div>
								<label className="block text-sm font-medium mb-1">Experience (years)</label>
								<input
									name="experience"
									type="number"
									min="0"
									className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
									placeholder="Eg: 3"
									value={formik.values.experience}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.experience && formik.errors.experience && (
									<div className="text-red-500 text-xs mt-1">{formik.errors.experience}</div>
								)}
							</div>

							{/* Specialization */}
							<div>
								<label className="block text-sm font-medium mb-1">Specialization</label>
								<select
									name="specialization"
									className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
									value={formik.values.specialization}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								>
									<option value="">-- Select --</option>
									<option value="two-wheeler">Two Wheeler</option>
									<option value="four-wheeler">Four Wheeler</option>
									<option value="both">Both</option>
								</select>
								{formik.touched.specialization && formik.errors.specialization && (
									<div className="text-red-500 text-xs mt-1">{formik.errors.specialization}</div>
								)}
							</div>
						</>
					)}

					<div className="flex items-center justify-between">
						<label className="flex items-center gap-2 text-sm">
							<input type="checkbox" className="w-4 h-4" />
							Remember me
						</label>

						<a href="#" className="text-sm text-blue-600 hover:underline">
							Forgot password?
						</a>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
						disabled={formik.isSubmitting}
					>
						Sign Up
					</button>

					<div className="text-center">
						<button
							type="button"
							onClick={() => navigate("/login")}
							className="text-sm text-blue-500 underline"
						>
							Already have account? Login
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
