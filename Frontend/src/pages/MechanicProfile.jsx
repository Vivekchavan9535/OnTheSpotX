// MechanicProfile.jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleMechanic, updateMechanic } from "../slices/mechanicSlice.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { mechanicValidationSchema } from "../validations/mechanic-validation.js";
import Joi from "joi";

export default function MechanicProfile() {
	const dispatch = useDispatch();
	const { currentMech, loading } = useSelector((state) => state.mechanics);
	const [editOpen, setEditOpen] = useState(false);


	if (loading || !currentMech) {
		return <p className="text-center">Loading mechanic profile...</p>;
	}

	const validateWithJoi = (values) => {
		const { error } = mechanicValidationSchema.validate(values, {
			abortEarly: false,
		});
		if (!error) return {};
		const errors = {};
		error.details.forEach((d) => {
			errors[d.path[0]] = d.message;
		});
		return errors;
	};

	// fetchs geolocation + reverse geocode
	const fetchGeoAddress = async (setFieldValue) => {
		navigator.geolocation.getCurrentPosition(async (pos) => {
			const { latitude, longitude } = pos.coords;
			try {
				const res = await fetch(
					`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
				);
				const data = await res.json();
				setFieldValue("location.address", data.display_name);
				setFieldValue("location.latitude", latitude);
				setFieldValue("location.longitude", longitude);
			} catch (err) {
				console.error("Reverse geocoding failed", err);
			}
		});
	};

	return (
		<div className="flex p-5 sm:p-0 justify-center items-center">
			<Card className="w-full max-w-sm shadow-lg rounded-xl">
				<CardHeader className="flex flex-col items-center capitalize">
					<Avatar className="min-h-40 min-w-40 mb-3">
						<AvatarImage
							src={
								"https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
							}
							alt="Mechanic"
						/>
						<AvatarFallback>{currentMech.fullName[0]}</AvatarFallback>
					</Avatar>
					<CardTitle className="text-2xl font-bold">
						{currentMech.fullName}
					</CardTitle>
					<div className="flex gap-2">
						<Badge className="mt-2 bg-green-100 text-green-700">Mechanic</Badge>
						<Badge
							className={`mt-2 ${currentMech?.isVerified
								? "bg-green-100 text-green-700"
								: "bg-red-100 text-red-700"
								}`}
						>
							{currentMech?.isVerified ? "Verified" : "Un-Verified"}
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="space-y-2 text-center capitalize">
					<p className="text-sm text-muted-foreground">{currentMech.phone}</p>
					<p className="text-sm font-medium">
						Experience: {currentMech.experience}+ years
					</p>
					<p className="text-sm font-medium ">
						Specialization: {currentMech.specialization}
					</p>
					<p className="text-sm font-medium">
						📍 {currentMech.location?.address}
					</p>
				</CardContent>

				<CardFooter className="flex flex-wrap justify-center gap-3">
					<Button variant="outline">Contact</Button>
					<Button>Book Service</Button>
					<Button variant="secondary" onClick={() => setEditOpen(true)}>
						Edit Account
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							alert("Delete account clicked!");
						}}
					>
						Delete Account
					</Button>
				</CardFooter>
			</Card>

			{/* Edit Mechanic Modal */}
			<Dialog className="" open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent className="w-[90%] rounded-xl sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Mechanic Profile</DialogTitle>
						<DialogDescription>
							Update your profile details below.
						</DialogDescription>
					</DialogHeader>

					<Formik
						initialValues={{
							fullName: currentMech.fullName || "",
							phone: currentMech.phone.slice(3) || "",
							experience: currentMech.experience || "",
							specialization: currentMech.specialization || "",
							location: {
								address: currentMech.location?.address || "",
								longitude: currentMech.location?.longitude, 
								latitude: currentMech.location?.latitude,
							},
						}}
						validate={validateWithJoi}
						onSubmit={(values) => {
							const payload = {
								...values,
								phone: `+91${values.phone}`
							};
							dispatch(updateMechanic({ id: currentMech._id, formData: payload }));
							setEditOpen(false);
						}}
					>
						{({ errors, touched, setFieldValue }) => (
							<Form className="space-y-4">
								<div>
									<Label htmlFor="fullName">Full Name</Label>
									<Field as={Input} id="fullName" name="fullName" />
									{errors.fullName && touched.fullName && (
										<p className="text-red-500 text-sm">{errors.fullName}</p>
									)}
								</div>

								<div>
									<Label htmlFor="phone">Phone</Label>
									<Field as={Input} id="phone" name="phone" />
									{errors.phone && touched.phone && (
										<p className="text-red-500 text-sm">{errors.phone}</p>
									)}
								</div>

								<div>
									<Label htmlFor="experience">Experience (years)</Label>
									<Field as={Input} id="experience" name="experience" type="number" />
									{errors.experience && touched.experience && (
										<p className="text-red-500 text-sm">{errors.experience}</p>
									)}
								</div>

								{/* Specialization select */}
								<div>
									<Label htmlFor="specialization">Specialization</Label>
									<Field
										as="select"
										id="specialization"
										name="specialization"
										className="border rounded p-2 w-full"
									>
										<option value="">Select specialization</option>
										<option value="Two-Wheeler">Two-Wheeler</option>
										<option value="Four-Wheeler">Four-Wheeler</option>
										<option value="Both">Both</option>

									</Field>
									{errors.specialization && touched.specialization && (
										<p className="text-red-500 text-sm">{errors.specialization}</p>
									)}
								</div>

								{/* Location with geolocation button */}
								<div>
									<Label htmlFor="address">Address</Label>
									<Button
										type="button"
										variant="outline"
										className="mb-2"
										onClick={() => fetchGeoAddress(setFieldValue)}
									>
										New Current Location
									</Button>
									<Field as={Input} id="address" name="location.address" />
									{errors.address && touched.address && (
										<p className="text-red-500 text-sm">{errors.address}</p>
									)}
								</div>

								<DialogFooter>
									<Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</DialogFooter>
							</Form>
						)}
					</Formik>
				</DialogContent>
			</Dialog>
		</div>
	);
}
