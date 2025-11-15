export default function HeroCard({ service }) {
	return (
		<div className="h-48 w-92 sm:w-70 rounded-xl bg-blue-50 p-5 shadow-md 
                        transition-all duration-300 hover:shadow-xl hover:scale-105
                        flex flex-col justify-between">

			<div>
				<h2 className="text-2xl font-bold text-gray-800">{service.name}</h2>

				<p className="text-gray-600 text-sm mt-1 line-clamp-3">
					{service.description || "Explore the service in detail."}
				</p>
			</div>

			<div className="flex justify-center pt-3">
				<button className="bg-black rounded-lg text-white px-3 py-1 text-sm 
                                   transition-all duration-200 hover:bg-gray-800">
					Inspect Now
				</button>
			</div>
		</div>
	);
}
