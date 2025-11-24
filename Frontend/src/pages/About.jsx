import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Zap, MapPin, Clock, CheckCircle2, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
	const navigate = useNavigate();

	const features = [
		{
			icon: Clock,
			title: "Lightning Fast",
			description: "Mechanic arrives within 10 minutes of booking. No waiting, no delays."
		},
		{
			icon: MapPin,
			title: "On-Spot Service",
			description: "We come to you. Your location, your convenience, anytime."
		},
		{
			icon: Zap,
			title: "Expert Technicians",
			description: "Highly trained and certified professionals for all vehicle types."
		},
		{
			icon: Award,
			title: "Transparent Pricing",
			description: "100% upfront quotes with no hidden charges. You approve before we proceed."
		},
	];

	const stats = [
		{ number: "500+", label: "Expert Mechanics" },
		{ number: "50K+", label: "Happy Customers" },
		{ number: "24/7", label: "Service Available" },
		{ number: "100%", label: "Satisfaction Rate" },
	];

	const values = [
		{
			title: "Reliability",
			description: "We're here when you need us. Rain or shine, day or night."
		},
		{
			title: "Quality",
			description: "Only genuine parts and professional expertise for your vehicle."
		},
		{
			title: "Transparency",
			description: "Clear communication and honest pricing, always."
		},
		{
			title: "Convenience",
			description: "Service on your terms. No workshops, no hassle."
		},
	];

	const team = [
		{
			name: "Expert Technicians",
			role: "Mobile Mechanics",
			description: "Certified professionals ready to fix any automotive issue on the spot."
		},
		{
			name: "Support Team",
			role: "Customer Care",
			description: "24/7 support to ensure your experience is smooth and worry-free."
		},
		{
			name: "Management",
			role: "Operations",
			description: "Dedicated to delivering the best service quality and innovation."
		},
	];

	return (
		<>
			{/* Hero Section */}
			<section className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<Badge className="mb-4 bg-yellow-500 text-black hover:bg-yellow-600">About OnTheSpotX</Badge>
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
							We Keep India Moving
						</h1>
						<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
							OnTheSpotX is revolutionizing automotive service by bringing expert mechanics directly to your location. No workshops, no waiting—just professional care, on the spot.
						</p>
					</div>

					{/* Stats Section */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
						{stats.map((stat, idx) => (
							<Card key={idx} className="text-center border-2">
								<CardContent className="pt-6">
									<h3 className="text-3xl sm:text-4xl font-bold text-yellow-500">{stat.number}</h3>
									<p className="text-gray-600 text-sm sm:text-base mt-2">{stat.label}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<Separator className="my-8" />

			{/* Mission & Vision */}
			<section className="py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-2 gap-8">
						<Card className="border-2 border-yellow-200">
							<CardHeader>
								<CardTitle className="text-2xl text-yellow-600">Our Mission</CardTitle>
							</CardHeader>
							<CardContent className="text-gray-700">
								To provide accessible, affordable, and professional automotive repair services at your doorstep, eliminating the inconvenience of visiting traditional repair shops while ensuring complete transparency and quality workmanship.
							</CardContent>
						</Card>

						<Card className="border-2 border-blue-200">
							<CardHeader>
								<CardTitle className="text-2xl text-blue-600">Our Vision</CardTitle>
							</CardHeader>
							<CardContent className="text-gray-700">
								To become India's most trusted on-demand automotive service platform, transforming how people maintain and repair their vehicles by making expert mechanics accessible to everyone, everywhere, 24/7.
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<Separator className="my-8" />

			{/* Key Features */}
			<section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Choose OnTheSpotX?</h2>
					<div className="grid md:grid-cols-2 gap-6">
						{features.map((feature, idx) => {
							const Icon = feature.icon;
							return (
								<Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
									<CardContent className="pt-6">
										<div className="flex gap-4">
											<div className="shrink-0">
												<Icon className="w-8 h-8 text-yellow-500" />
											</div>
											<div>
												<h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
												<p className="text-gray-600">{feature.description}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<Separator className="my-8" />

			{/* Core Values */}
			<section className="py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Our Core Values</h2>
					<div className="grid md:grid-cols-2 gap-6">
						{values.map((value, idx) => (
							<Card key={idx} className="border-2">
								<CardHeader>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="w-5 h-5 text-green-500" />
										<CardTitle className="text-lg">{value.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="text-gray-600">
									{value.description}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<Separator className="my-8" />

			{/* Team Section */}
			<section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Our Team</h2>
					<div className="grid md:grid-cols-3 gap-6">
						{team.map((member, idx) => (
							<Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
								<CardHeader>
									<CardTitle className="text-xl">{member.name}</CardTitle>
									<CardDescription className="text-yellow-600 font-semibold">{member.role}</CardDescription>
								</CardHeader>
								<CardContent className="text-gray-600">
									{member.description}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<Separator className="my-8" />

			{/* How It Works */}
			<section className="py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">How OnTheSpotX Works</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<Card className="border-2 border-blue-200">
							<CardHeader>
								<Badge className="w-fit bg-blue-100 text-blue-800 mb-2">Step 1</Badge>
								<CardTitle>Book Service</CardTitle>
							</CardHeader>
							<CardContent className="text-gray-600">
								Tell us about your issue. Our app finds the nearest mechanic to your location instantly.
							</CardContent>
						</Card>

						<Card className="border-2 border-yellow-200">
							<CardHeader>
								<Badge className="w-fit bg-yellow-100 text-yellow-800 mb-2">Step 2</Badge>
								<CardTitle>Mechanic Arrives</CardTitle>
							</CardHeader>
							<CardContent className="text-gray-600">
								A certified technician reaches you within 10 minutes with all necessary diagnostic tools.
							</CardContent>
						</Card>

						<Card className="border-2 border-green-200">
							<CardHeader>
								<Badge className="w-fit bg-green-100 text-green-800 mb-2">Step 3</Badge>
								<CardTitle>Get Fixed & Pay</CardTitle>
							</CardHeader>
							<CardContent className="text-gray-600">
								After diagnosis and your approval, we fix it with genuine parts. Pay only when satisfied.
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<Separator className="my-8" />

			{/* CTA Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-yellow-50 to-blue-50">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
					<p className="text-lg text-gray-600 mb-8">Join thousands of satisfied customers who trust OnTheSpotX for their automotive needs.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							onClick={() => navigate('/services')}
							className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-lg"
						>
							Book Service Now
						</Button>
						<Button
							onClick={() => navigate('/')}
							variant="outline"
							className="border-2 border-gray-300 font-semibold px-8 py-6 text-lg"
						>
							Back to Home
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}