// src/pages/Signup.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import UserContext from "../context/userContext";
import axios from "axios";
import SignupValidationSchema from "../validations/signup-validation.js";

export default function Signup() {
	const navigate = useNavigate();
	const { registerUser, serverErrors, userDispatch } = useContext(UserContext);
	const [locLoading, setLocLoading] = useState(false);

	useEffect(() => () => userDispatch({ type: "SERVER_ERRORS", payload: "" }), [userDispatch]);

	const joiValidate = (values) => {
		const toValidate = JSON.parse(JSON.stringify(values || {}));
		if (toValidate.role !== "mechanic") {
			delete toValidate.location;
			delete toValidate["location.address"];
			delete toValidate["location.latitude"];
			delete toValidate["location.longitude"];
			delete toValidate.experience;
			delete toValidate.specialization;
		}
		const result = SignupValidationSchema.validate(toValidate, { abortEarly: false, convert: true });
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
			phone: "",
			email: "",
			password: "",
			role: "customer",
			location: { latitude: "", longitude: "", address: "" },
			experience: "",
			specialization: "",
		},
		validate: joiValidate,
		onSubmit: async (values, { resetForm }) => {
			try {
				const onlyNums = String(values.phone || "").replace(/\D/g, "").slice(0, 10);
				const payload = {
					fullName: values.fullName,
					phone: `+91${onlyNums}`,
					email: values.email,
					password: values.password,
					role: values.role,
				};
				if (values.role === "mechanic") {
					payload.location = {
						latitude: Number(values.location.latitude),
						longitude: Number(values.location.longitude),
						address: values.location.address || "",
					};
					payload.experience = Number(values.experience);
					payload.specialization = values.specialization;
				}
				await registerUser(payload, resetForm);
			} catch (err) {
				console.error("submit error:", err);
			}
		},
	});

	useEffect(() => {
		formik.validateForm().then(() => {
			if (formik.values.role !== "mechanic") {
				formik.setTouched((t) => {
					const next = { ...t };
					delete next.location;
					delete next["location.address"];
					delete next["location.latitude"];
					delete next["location.longitude"];
					delete next.experience;
					delete next.specialization;
					return next;
				});
			}
		});
	}, [formik.values.role]);

	const reverseGeocode = async (lat, lon) => {
		try {
			const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
				lat
			)}&lon=${encodeURIComponent(lon)}`;
			const res = await axios.get(url, { headers: { Accept: "application/json" } });
			const data = res.data;
			return data.display_name || (data.address && Object.values(data.address).join(", ")) || "";
		} catch {
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
				if (err.code === 1) alert("Permission denied. Please allow location access.");
				else alert("Could not get your location. Try the 'Use my location' button.");
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);
	};

	const renderLocationError = () => {
		const err = formik.errors.location;
		if (!err) return null;
		if (typeof err === "string") return err;
		return err.address || err.latitude || err.longitude || JSON.stringify(err);
	};

	return (
		<section className="flex items-center justify-center px-6">
			<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
				<h1 className="text-2xl font-bold text-center mb-6">Register</h1>

				{serverErrors && <div className="text-red-500 text-sm mt-2 break-words">{serverErrors.error || String(serverErrors)}</div>}

				<form className="space-y-4" onSubmit={formik.handleSubmit}>
					<div>
						<label className="block text-sm font-medium mb-1">Full Name</label>
						<input name="fullName" type="text" className="w-full p-2 border rounded-lg" placeholder="John Doe" value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						{formik.touched.fullName && formik.errors.fullName && <div className="text-red-500 text-xs mt-1">{formik.errors.fullName}</div>}
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Phone</label>
						<div className="relative">
							<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-semibold">+91</span>
							<input
								name="phone"
								type="tel"
								maxLength="10"
								className="w-full pl-14 p-2 border rounded-lg"
								placeholder="6969696996"
								value={formik.values.phone}
								onChange={(e) => formik.setFieldValue("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
								onBlur={formik.handleBlur}
							/>
						</div>
						{formik.touched.phone && formik.errors.phone && <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>}
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input name="email" type="email" className="w-full p-2 border rounded-lg" placeholder="admin@example.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						{formik.touched.email && formik.errors.email && <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>}
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input name="password" type="password" className="w-full p-2 border rounded-lg" placeholder="••••••••" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
						{formik.touched.password && formik.errors.password && <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>}
					</div>

					<label className="block text-sm font-medium mb-1">Register as</label>
					<div>
						<select name="role" value={formik.values.role} onChange={formik.handleChange} className="w-full p-2 border rounded-lg">
							<option value="customer">Customer</option>
							<option value="mechanic">Mechanic</option>
						</select>
					</div>

					{formik.values.role === "mechanic" && (
						<>
							<div>
								<label className="block text-sm font-medium mb-1">Location</label>
								<div className="flex gap-2">
									<input name="location.address" type="text" className="flex-1 p-2 border rounded-lg" placeholder="City / Area" value={formik.values.location.address} onChange={(e) => formik.setFieldValue("location", { ...formik.values.location, address: e.target.value })} onBlur={formik.handleBlur} />
									<button type="button" onClick={getAndFillLocation} className="px-3 py-2 bg-gray-100 border rounded text-sm" disabled={locLoading}>
										{locLoading ? "Locating..." : "Use my location"}
									</button>
								</div>
								{formik.touched.location && formik.errors.location && <div className="text-red-500 text-xs mt-1">{renderLocationError()}</div>}
							</div>

							<input type="hidden" name="latitude" value={formik.values.location.latitude} />
							<input type="hidden" name="longitude" value={formik.values.location.longitude} />

							<div>
								<label className="block text-sm font-medium mb-1">Experience (years)</label>
								<input name="experience" type="number" min="0" className="w-full p-2 border rounded-lg" placeholder="Eg: 3" value={formik.values.experience} onChange={formik.handleChange} onBlur={formik.handleBlur} />
								{formik.touched.experience && formik.errors.experience && <div className="text-red-500 text-xs mt-1">{formik.errors.experience}</div>}
							</div>

							<div>
								<label className="block text-sm font-medium mb-1">Specialization</label>
								<select name="specialization" className="w-full p-2 border rounded-lg" value={formik.values.specialization} onChange={formik.handleChange} onBlur={formik.handleBlur}>
									<option value="">-- Select --</option>
									<option value="two-wheeler">Two Wheeler</option>
									<option value="four-wheeler">Four Wheeler</option>
									<option value="both">Both</option>
								</select>
								{formik.touched.specialization && formik.errors.specialization && <div className="text-red-500 text-xs mt-1">{formik.errors.specialization}</div>}
							</div>
						</>
					)}

					<div className="flex items-center justify-between">
						<label className="flex items-center gap-2 text-sm">
							<input type="checkbox" className="w-4 h-4" />
							Remember me
						</label>

						<a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
					</div>

					<button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold" disabled={formik.isSubmitting}>
						Sign Up
					</button>

					<div className="text-center">
						<button type="button" onClick={() => navigate("/login")} className="text-sm text-blue-500 underline">
							Already have account? Login
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
