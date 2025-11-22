import { FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';

export default function EnhancedFooter({ logoImg }) {
	return (
		<footer className="w-full bg-gray-700 text-gray-300 py-12 shadow-2xl mt-36">
			<div className="max-w-7xl mx-auto px-6">

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-12 ">

					<div>
						<img className="h-45 w-auto filter invert" src={logoImg} alt="OnTheSpotX Logo" />
					</div>

					<div>
						<h2 className="text-xl font-extrabold text-white mb-4 border-b-2 border-yellow-500 pb-2 inline-block">Connect with us</h2>
						<ul className="space-y-3 text-sm">
							<li className="flex items-center gap-3">
								<FaEnvelope className="text-yellow-500 min-w-4" />
								<a href="mailto:onthespotx@gmail.com" className="hover:text-white transition duration-200">onthespotx@gmail.com</a>
							</li>
							<li className="flex items-center gap-3">
								<FaPhone className="text-yellow-500 min-w-4" />
								<a href="tel:+919535840603" className="hover:text-white transition duration-200">+91 9535840603</a>
							</li>
							<li className="flex items-center gap-3">
								<FaClock className="text-yellow-500 min-w-4" />
								<span className="text-gray-400">Monday to Sunday (24/7 Support)</span>
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-xl font-extrabold text-white mb-4 border-b-2 border-yellow-500 pb-2 inline-block">Quick Links</h2>
						<ul className="space-y-3 text-sm">
							<li>
								<a href="/services" className="hover:text-yellow-400 transition duration-200">Services</a>
							</li>
							<li>
								<a href="/about" className="hover:text-yellow-400 transition duration-200">About Us</a>
							</li>
							<li>
								<a href="/contact" className="hover:text-yellow-400 transition duration-200">Contact</a>
							</li>
							{/* Adding a placeholder for legal/privacy links for completeness */}
							<li>
								<a href="/privacy" className="hover:text-yellow-400 transition duration-200">Privacy Policy</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-10 border-t border-gray-700  text-center text-xs text-gray-500">
					<p className="tracking-wide">
						&copy; {new Date().getFullYear()} **OnTheSpotX**. All rights reserved.
					</p>
				</div>
			</div>

			<div className="w-full flex justify-center py-8">
				<p className="lg:text-[60px] text-2xl font-semibold  text-yellow-500">#𝐴𝑙𝑤𝑎𝑦𝑠𝐾𝑒𝑒𝑝𝑀𝑜𝑣𝑖𝑛𝑔</p>
			</div>

		</footer>
	);
}