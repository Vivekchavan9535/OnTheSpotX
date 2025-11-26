import { useEffect, useContext, useState } from "react";
import HeroImg from "../assets/HeroImg.png";
import ServiceCard from "../components/ServiceCardUi";
import UserContext from "../context/userContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
// Import the action to set the ID for editing
import { addService, fetchServices, deleteService, setEditId } from "../slices/servicesSlice.js";
import { useDispatch, useSelector } from "react-redux";
import serviceValidationSchema from "../validations/service-validation.js"; // Joi schema
import EditServiceModal from "../components/EditServiceModal"; // New Import
import {useNavigate} from 'react-router-dom'

import { toast } from "react-toastify";



const toastErr = (msg) =>
	toast.error(msg, {
		position: "top-center",
		autoClose: 1000,
		theme: "dark",
	});

const toastSuccess = (msg) =>
	toast.success(msg, {
		position: "top-center",
		autoClose: 1000,
		theme: "dark",
	});


export default function Service() {
	const { user } = useContext(UserContext);
	const dispatch = useDispatch();
	const { data, serverError, editId } = useSelector((state) => state.services);

	const navigate = useNavigate()

	// State to manage the Edit Modal visibility
	const [isModalOpen, setIsModalOpen] = useState(false);

	// // Fetch services on mount
	// useEffect(() => {
	// 	dispatch(fetchServices());
	// }, [dispatch]);

	// When editId changes in Redux, open/close the modal
	useEffect(() => {
		if (editId) {
			setIsModalOpen(true);
		} else {
			setIsModalOpen(false);
		}
	}, [editId]);

	const formik = useFormik({
		initialValues: {
			title: "",
			description: "",
			basePrice: "",
		},
		validate: (values) => {
			const { error } = serviceValidationSchema.validate(values, { abortEarly: false });
			if (!error) return {};

			const errors = {};
			error.details.forEach((detail) => {
				errors[detail.path[0]] = detail.message;
			});
			return errors;
		},
		onSubmit: async (values, { resetForm }) => {
			await dispatch(addService({ formData: values, resetForm }));
		},
	});

	const handleEdit = (serviceId) => {
		dispatch(setEditId(serviceId));
	};

	const BookService = (serviceId) => {
		if(localStorage.getItem('token')){
			navigate(`/service-request/${serviceId}`)
		}else{
			toastErr("Login to Book Service")
			navigate('/login')
		}

	}


	return (
		<section className="py-6 px-5">
			<EditServiceModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

			{/* Admin only form (for adding new services) */}
			{user?.role === "admin" && (
				<div className="max-w-md mx-auto mb-10">
					<Card>
						<CardHeader>
							<CardTitle>Add New Service</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={formik.handleSubmit} className="space-y-4">
								<div>
									<Label>Service Name</Label>
									<Input
										name="title"
										value={formik.values.title}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="Car Inspection"
									/>
									{formik.touched.title && formik.errors.title && (
										<p className="text-red-500 text-sm">{formik.errors.title}</p>
									)}
								</div>

								<div>
									<Label>Description</Label>
									<Textarea
										name="description"
										value={formik.values.description}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="Short description"
									/>
									{formik.touched.description && formik.errors.description && (
										<p className="text-red-500 text-sm">{formik.errors.description}</p>
									)}
								</div>

								<div>
									<Label>Base Price</Label>
									<Input
										name="basePrice"
										type="number"
										value={formik.values.basePrice}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="₹500"
									/>
									{formik.touched.basePrice && formik.errors.basePrice && (
										<p className="text-red-500 text-sm">{formik.errors.basePrice}</p>
									)}
								</div>

								{serverError && (
									<p className="text-red-600 text-sm">{serverError}</p>
								)}

								<Button type="submit" className="w-full">
									Add Service
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Services Grid */}
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-8">
					{data?.map((service) => (
						<ServiceCard
							key={service._id}
							{...service}
							role={user?.role}
							onDelete={() => dispatch(deleteService(service._id))}
							onEdit={() => handleEdit(service._id)} // Pass the new handler
							onBook={() => BookService(service._id)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}