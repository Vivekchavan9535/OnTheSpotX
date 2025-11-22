import {useNavigate} from 'react-router-dom'

export default function HeroCard({ service }) {
	const navigate = useNavigate()
	return (
		<div className="m-h-48 m-w-92 sm:w-70 rounded-xl bg-gray-50 p-5 shadow 
                        transition-all duration-300 hover:shadow-xl hover:scale-105
                        flex flex-col justify-between">

			<div>
				<h2 className="text-2xl font-bold text-gray-800">{service.name}</h2>

				<p className="text-gray-600 text-sm mt-1 line-clamp-3">
					{service.description || "Explore the service in detail."}
				</p>
			</div>

			<div className="flex justify-center pt-3">
				<button onClick={()=>navigate('/services')} className="bg-black rounded-lg text-white px-3 py-1 text-sm 
                                   transition-all duration-200 hover:bg-gray-800">
					Inspect Now
				</button>
			</div>
		</div>
	);
}
