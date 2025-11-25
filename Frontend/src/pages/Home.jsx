import HeroImg from "../assets/HeroImg.png";
import HeroCard from "../components/HeroCard";
import logoImg from '../assets/logo.png'
import IndiaText from '../components/IndiaText'
import ReviewCards from "../components/ReviewCards";
import { useNavigate } from "react-router-dom";

const ourServices = [
	{
		id: 1,
		name: "Car Inspection",
		description:
			"Complete check-up to identify issues before they become costly repairs.",
		url: "/",
	},
	{
		id: 2,
		name: "Engine Issue",
		description:
			"Quick diagnosis and repair for overheating, noise, or performance problems.",
		url: "/",
	},
	{
		id: 3,
		name: "Battery & Electrical",
		description:
			"Jumpstart, battery replacement, and all electrical troubleshooting on spot.",
		url: "/",
	},
	{
		id: 4,
		name: "Towing",
		description: "Fast and safe towing anytime, anywhere in your city.",
		url: "/",
	},
];



const steps = [
	{
		id: 1,
		title: "Technician Assigned",
		desc: `OnTheSpotX assigns the nearest Expert Technician to your location. Within 10 minutes, a professional mechanic arrives — No waiting, No Towing, No Workshop visits!`,
		image:
			"https://ik.imagekit.io/driveu/Website_New/Get-Price-in-an-Instant__1__ilK1pVFM1.png",
		cta: "Inspect",
	},
	{
		id: 2,
		title: "Diagnosis & Quote",
		desc: `Using Advanced Diagnostic Tools, we provide a detailed report and an Instant Upfront Quote — 100% Transparent, No Hidden Charges. You approve only if you're satisfied.`,
		image:
			"https://www.datocms-assets.com/49357/1634679845-roadside-help.jpg?auto=format&fit=max&w=1200",
		cta: "Diagnose",
	},
	{
		id: 3,
		title: "Lets Go",
		desc: `Once approved, repairs begin Immediately with Genuine Parts. No Delays, Just Drive!`,
		image:
			"https://i0.wp.com/practicalmotoring.com.au/wp-content/uploads/2014/05/running-in-a-car-driving.jpg",
		cta: "Go",
	},

];


export default function Home() {
	const navigate = useNavigate()

	const onBook = () => {
		if (localStorage.getItem('token')) {
			navigate('/services')
		}
	}


	return (
		<>
			{/* Hero Section */}
			<section className="p-5">
				<div className="max-w-7xl mx-auto sm:grid sm:grid-cols-2 gap-8 items-center">
					<div className="flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
						<h1 className="text-[25px] sm:text-[50px] font-semibold leading-tight">
							We Don't Just Fix.
							<br />
							We Keep <IndiaText /> Moving.
						</h1>

						<div className="mt-6 hidden sm:block">
							<button
								aria-label="Book Service"
								className="font-semibold bg-yellow-500 hover:bg-[#1e323f] text-black rounded-lg px-8 py-3 transition-colors"
								onClick={onBook}
							>
								Book Service
							</button>
						</div>
					</div>

					{/* Right hero image */}
					<div className="flex justify-center items-center p-4">
						<img
							src={HeroImg}
							alt="Mechanic inspecting a vehicle"
							className="max-w-full h-auto rounded-lg"
						/>
					</div>

					{/* Service info box for mobile */}
					<div className="sm:hidden mt-6">
						<div className="bg-zinc-200 rounded-xl p-5 shadow">
							<h2 className="font-bold text-yellow-500 text-[20px]">
								24/7 <span className="font-normal">On the Spot</span>
							</h2>
							<p className="font-semibold mt-2">Car, Auto & Bike Repair</p>
							<div className="mt-4">
								<button
									aria-label="Book Service"
									className="w-full font-semibold shadow p-2 text-[16px] bg-yellow-500 rounded-xl hover:bg-yellow-400 transition"
									onClick={onBook}
								>
									Book Service
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>


			{/* Our Services Section */}
			<section className="py-6 px-5">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-[20px] sm:text-[40px] font-bold text-center">
						Our Services
					</h1>

					<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 pt-8">
						{ourServices.map((service) => (
							<HeroCard key={service.id} service={service} />
						))}
					</div>
				</div>
			</section>

			{/* How OnTheSpotX Works */}
			<section className="py-8 px-5">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-[20px] sm:text-[40px] font-bold text-center capitalize">
						How OnTheSpotX works ?
					</h1>

					<div className="space-y-8 mt-8">
						{steps.map((step, idx) => {
							const reverseOnDesktop = idx % 2 === 1; // alternate order
							return (
								<div
									key={step.id}
									className={`bg-gray-50 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border-2
                  ${reverseOnDesktop ? "sm:flex-row-reverse" : ""}`}
								>
									<div
										className={`flex flex-col sm:flex-row items-center gap-6 ${reverseOnDesktop ? "sm:flex-row-reverse" : ""
											}`}
									>
										{/* Image */}
										<div className="w-full sm:w-1/3">
											<img
												src={step.image}
												alt={step.title}
												className="w-full h-auto rounded-lg object-cover"
											/>
										</div>

										{/* Number + Content */}
										<div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6">
											{/* BIG NUMBER */}
											<div className="shrink-0 flex items-center justify-center">
												<span
													className="font-semibold text-7xl sm:text-8xl md:text-[120px] text-gray-800 leading-none"
													aria-hidden="true"
												>
													{step.id}
												</span>
											</div>

											{/* Text block */}
											<div className="flex-1">
												<h3 className="text-lg font-semibold mb-2">
													{step.title}
												</h3>
												<p className="text-gray-700">{step.desc}</p>

												{/* Buttons - desktop / mobile */}
												<div className="mt-4">
													<button className="hidden sm:inline-block bg-black text-white rounded-lg px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-800">
														{step.cta}
													</button>

													<button className="sm:hidden w-full bg-black text-white rounded-lg px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-800">
														{step.cta}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>



			<ReviewCards />



		</>
	);
}
