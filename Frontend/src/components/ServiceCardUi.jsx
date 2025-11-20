export default function ServiceCardUi({ name,title, description, basePrice }) {
	return (
		<div className="m-h-48 m-w-92 sm:m-w-70 rounded-xl bg-black-50 p-5 shadow-md 
                        transition-all duration-300 hover:shadow-xl hover:scale-105">

			<div>
				<h2 className="text-2xl font-bold text-gray-800">{title}</h2>

				<p className="text-gray-600 text-sm mt-1 line-clamp-3">
					{description || "Explore the service in detail."}
				</p>

			</div>

			<div className="flex flex-col justify-center pt-3">
				<p className="text-gray-600 text-m font-semibold p-2 mt-1 line-clamp-3 ">
					{basePrice || "₹500"}
				</p>
				<button className="bg-black rounded-lg text-white px-3 py-1 text-sm 
                                   transition-all duration-200 hover:bg-gray-800">
					Book Now
				</button>
			</div>
		</div>
	);
}
