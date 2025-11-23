import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik"; // Import useFormik
import axios from "../config/axios.js"; // Your configured Axios instance
import UserContext from "../context/userContext";

// UI Components (assuming these are defined elsewhere)
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function ServiceRequest() {
	const { user, loading } = useContext(UserContext);
	const { serviceId } = useParams();

	const [serviceDetails, setServiceDetails] = useState(null);
	const [serviceLoading, setServiceLoading] = useState(true);
	const [serviceError, setServiceError] = useState(null);


	const validate = (values) => {
		const errors = {};

		if (!values.issueDescription) {
			errors.issueDescription = "Issue description is required.";
		} else if (values.issueDescription.trim().length < 10) {
			errors.issueDescription = "Issue description must be at least 10 characters.";
		}

		if (!values.userLocation.address) {
			errors["userLocation.address"] = "Location address is required.";
		}

		if (!values.userLocation.latitude || !values.userLocation.longitude) {
			errors.userLocation =
				"Coordinates (via 'Use Current Location' or manually) are required.";
		}

		return errors;
	};


	const formik = useFormik({
		initialValues: {
			userId: null,
			serviceId: serviceId,
			issueDescription: "",
			vehicleType: "two-wheeler",
			userLocation: {
				latitude: "",
				longitude: "",
				address: "",
			},
			distance: 0,
			estimatedTime: 0,
			basePrice: 0,
		},
		validate,
		onSubmit: async (values, { resetForm }) => {
			if (!values.issueDescription) {
				alert("Issue description is required!");
				return;
			}
			console.log("Service Request Submitted:", values);

			try {
				const token = localStorage.getItem('token');
				const res = await axios.post('/service-request', values, { headers: { Authorization: token } });
				alert("Service request successfully submitted!");
				console.log("Submission response:", res.data);
				resetForm()

			} catch (err) {
				const errorMsg = err.response
				alert(`Failed to submit request: ${errorMsg}`);
				console.error("Submission Error:", errorMsg, err);
			}
		},
	});


	// Fetch Service Details and set Base Price
	useEffect(() => {
		if (!serviceId) {
			setServiceError("Service ID is missing.");
			setServiceLoading(false);
			return;
		}

		const fetchServiceData = async () => {
			setServiceLoading(true);
			setServiceError(null);
			try {
				const token = localStorage.getItem('token');
				const res = await axios.get(`/service/${serviceId}`, {
					headers: {
						Authorization: token
					}
				});

				const fetchedDetails = res.data;
				setServiceDetails(fetchedDetails);

				formik.setFieldValue('totalCost', fetchedDetails.basePrice || 0);
				formik.setFieldValue('serviceId', serviceId);

			} catch (err) {
				const errorMsg = err.response.data
				setServiceError(errorMsg);
			} finally {
				setServiceLoading(false);
			}
		};

		fetchServiceData();
	}, [serviceId]);

	useEffect(() => {
		if (user && !loading) {
			formik.setFieldValue('userId', user._id);
		}
	}, [user, loading]);

	// Geolocation
	const fetchGeoAddress = () => {
		if (!navigator.geolocation) {
			alert("Geolocation is not supported by your browser.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const { latitude, longitude } = pos.coords;
				try {
					const res = await fetch(
						`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
					);

					if (!res.ok) {
						throw new Error(`Reverse geocoding failed with status: ${res.status}`);
					}

					const data = await res.json();
					const address = data.display_name;

					// Use Formik setters to update nested state fields
					formik.setFieldValue('userLocation.latitude', String(latitude));
					formik.setFieldValue('userLocation.longitude', String(longitude));
					formik.setFieldValue('userLocation.address', address);

					// Clear address error if successful
					if (formik.errors['userLocation.address']) {
						formik.setFieldError('userLocation.address', undefined);
					}
				} catch (err) {
					console.error("Reverse geocoding failed", err);
					alert("Failed to find address from coordinates.");
				}
			},
			(error) => {
				console.error("Geolocation Error:", error);
				let message = "Could not get your location. Please check settings.";
				if (error.code === error.PERMISSION_DENIED) {
					message = "Permission denied. Allow location access in your browser settings.";
				} else if (error.code === error.TIMEOUT) {
					message = "Location request timed out. Please try again.";
				}
				alert(message);
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);
	};

	if (loading || serviceLoading) {
		return <p className="text-center p-8">Loading user and service details...</p>;
	}

	if (serviceError) {
		return <p className="text-center p-8 text-red-600 font-semibold">Error: {serviceError}</p>;
	}


	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
			<h1 className="text-2xl font-bold mb-4 text-center">
				Service Request
			</h1>

			<form onSubmit={formik.handleSubmit} className="space-y-4">

				{/* Service Base Price Display */}
				{serviceDetails && (
					<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
						<p className="font-semibold text-blue-700">
							Base Service Cost: ₹{serviceDetails.basePrice || 0}
						</p>
						<p className="text-gray-600 italic">This is the minimum initial charge.</p>
					</div>
				)}

				{/* Read-Only Fields
				<div>
					<Label>User ID</Label>
					<Input name="userId" value={formik.values.userId || ''} readOnly />
				</div>
				<div>
					<Label>Service ID</Label>
					<Input name="serviceId" value={formik.values.serviceId} readOnly />
				</div> */}

				{/* Issue Description */}
				<div>
					<Label htmlFor="issueDescription">Issue Description *</Label>
					<Textarea
						id="issueDescription"
						name="issueDescription"
						value={formik.values.issueDescription}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						required
					/>
					{formik.touched.issueDescription && formik.errors.issueDescription ? (
						<div className="text-red-500 text-xs mt-1">{formik.errors.issueDescription}</div>
					) : null}
				</div>

				{/* Vehicle Type */}
				<div>
					<Label htmlFor="vehicleType">Vehicle Type</Label>
					<select
						id="vehicleType"
						name="vehicleType"
						value={formik.values.vehicleType}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className="border rounded p-2 w-full"
					>
						<option value="two-wheeler">Two-Wheeler</option>
						<option value="four-wheeler">Four-Wheeler</option>
					</select>
				</div>

				{/* Location Fields */}
				<div>
					<Label>Location *</Label>
					<Button
						type="button"
						variant="outline"
						className="mb-2 w-full"
						onClick={fetchGeoAddress}
					>
						Use Current Location
					</Button>
					<Textarea
						name="userLocation.address" // Use dot notation for nested fields
						value={formik.values.userLocation.address}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						placeholder="Address (Manually enter or use location button)"
						required
					/>
					{/* Error check for nested fields */}
					{(formik.touched['userLocation.address'] && formik.errors['userLocation.address']) ||
						(formik.touched.userLocation && formik.errors.userLocation) ? (
						<div className="text-red-500 text-xs mt-1">
							{formik.errors['userLocation.address'] || formik.errors.userLocation}
						</div>
					) : null}

					{/* Hidden Inputs for Latitude/Longitude */}
					<Input type="hidden" name="userLocation.latitude" value={formik.values.userLocation.latitude} />
					<Input type="hidden" name="userLocation.longitude" value={formik.values.userLocation.longitude} />
				</div>

				{/* Distance */}
				<div className="hidden">
					<Label htmlFor="distance">Distance (km)</Label>
					<Input
						id="distance"
						type="number"
						name="distance"
						value={formik.values.distance}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>

				{/* Estimated Time */}
				<div className="hidden">
					<Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
					<Input
						id="estimatedTime"
						type="number"
						name="estimatedTime"
						value={formik.values.estimatedTime}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>

				{/* Base Price Initial Price */}
				<div className="hidden">
					<Label htmlFor="totalCost">Base Price (₹)</Label>
					<Input
						id="totalCost"
						type="number"
						name="totalCost"
						value={formik.values.totalCost}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						readOnly
						className="bg-gray-100 cursor-not-allowed"
					/>
				</div>

				<Button
					type="submit"
					className="w-full bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50"
					disabled={formik.isSubmitting || !formik.isValid}
				>
					{formik.isSubmitting ? "Submitting..." : "Submit Request"}
				</Button>
			</form>
		</div>
	);
}