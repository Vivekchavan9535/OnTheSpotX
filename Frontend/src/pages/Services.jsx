import HeroImg from "../assets/HeroImg.png";
import ServiceCard from "../components/ServiceCardUi";
import UserContext from '../context/userContext';
import { useContext, useState,useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { addService } from '../slices/servicesSlice'
import {useDispatch,useSelector} from 'react-redux'
import servicesSlice from "../slices/servicesSlice.js"
import {fetchServices} from '../slices/servicesSlice.js'


export default function Service() {
	const { user } = useContext(UserContext);
	const dispatch = useDispatch()
	const {data,serverError} = useSelector((state)=>{
		return state.services
	})


	const formik = useFormik({
		initialValues: {
			title: "",
			description: "",
			basePrice: "",
		},
		// validate: {},
		onSubmit: async (values, { resetForm }) => {
			dispatch(addService({formData:values,resetForm}))
		}
	})



	return (
		<section className="py-6 px-5">
			{/* Admin only form */}
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
										placeholder="Car Inspection"
										required
									/>
								</div>

								<div>
									<Label>Description</Label>
									<Textarea
										name="description"
										value={formik.values.description}
										onChange={formik.handleChange}
										placeholder="Short description"
										required
									/>
								</div>

								<div>
									<Label>Base Price</Label>
									<Input
										name="basePrice"
										value={formik.values.basePrice}
										onChange={formik.handleChange}
										placeholder="$500"
										required
									/>
								</div>

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
						<ServiceCard key={service._id} {...service} />
					))}
				</div>
			</div>
		</section>
	);
}


