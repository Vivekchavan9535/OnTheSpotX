// // src/components/EditMechanicModal.jsx
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogDescription,
// 	DialogFooter,
// } from "../components/ui/dialog";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Formik, Form, Field } from "formik";
// import { useDispatch } from "react-redux";
// import { updateMechanic } from "../slices/mechanicSlice.js";
// import { mechanicValidtionSchema } from "../validations/mechanic-validation.js";
// import Joi from "joi";

// export default function EditMechanicModal({ mechanic, open, onClose }) {
// 	const dispatch = useDispatch();

// 	// Convert Joi schema to Formik validation
// 	const validateWithJoi = (values) => {
// 		const { error } = mechanicValidationSchema.validate(values, {
// 			abortEarly: false
// 		});
// 		if (!error) return {};
// 		const errors = {};
// 		error.details.forEach((d) => {
// 			errors[d.path[0]] = d.message;
// 		});
// 		return errors;
// 	};

// 	return (
// 		<Dialog open={open} onOpenChange={onClose}>
// 			<DialogContent className="sm:max-w-md">
// 				<DialogHeader>
// 					<DialogTitle>Edit Mechanic Profile</DialogTitle>
// 					<DialogDescription>
// 						Update your profile details below.
// 					</DialogDescription>
// 				</DialogHeader>

// 				<Formik
// 					initialValues={{
// 						fullName: "",
// 						phone: "", // 10 digits only
// 						email: "",
// 						password: "",
// 						role: "customer",
// 						location: { latitude: "", longitude: "", address: "" },
// 						experience: "",
// 						specialization: "",
// 					}}
// 					validate={validateWithJoi}
// 					onSubmit={(values) => {
// 						dispatch(updateMechanic({ id: mechanic._id, data: values }));
// 						onClose();
// 					}}
// 				>
// 					{({ errors, touched }) => (
// 						<Form className="space-y-4">
// 							<div>
// 								<Label htmlFor="fullName">Full Name</Label>
// 								<Field
// 									as={Input}
// 									id="fullName"
// 									name="fullName"
// 									className="mt-1"
// 								/>
// 								{errors.fullName && touched.fullName && (
// 									<p className="text-red-500 text-sm">{errors.fullName}</p>
// 								)}
// 							</div>

// 							<div>
// 								<Label htmlFor="phone">Phone</Label>
// 								<Field as={Input} id="phone" name="phone" className="mt-1" />
// 								{errors.phone && touched.phone && (
// 									<p className="text-red-500 text-sm">{errors.phone}</p>
// 								)}
// 							</div>

// 							<div>
// 								<Label htmlFor="experience">Experience (years)</Label>
// 								<Field
// 									as={Input}
// 									id="experience"
// 									name="experience"
// 									type="number"
// 									className="mt-1"
// 								/>
// 								{errors.experience && touched.experience && (
// 									<p className="text-red-500 text-sm">{errors.experience}</p>
// 								)}
// 							</div>

// 							<div>
// 								<Label htmlFor="specialization">Specialization</Label>
// 								<Field
// 									as={Input}
// 									id="specialization"
// 									name="specialization"
// 									className="mt-1"
// 								/>
// 								{errors.specialization && touched.specialization && (
// 									<p className="text-red-500 text-sm">{errors.specialization}</p>
// 								)}
// 							</div>

// 							<DialogFooter>
// 								<Button type="button" variant="outline" onClick={onClose}>
// 									Cancel
// 								</Button>
// 								<Button type="submit">Save Changes</Button>
// 							</DialogFooter>
// 						</Form>
// 					)}
// 				</Formik>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
