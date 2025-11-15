import { IoMenu, IoClose } from "react-icons/io5";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/userContext";

export default function Navbar() {
	const [hamburger, setHamburger] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { user, isLoggedIn, handleLogout } = useContext(UserContext);

	const navLinks = [
		{ id: 1, name: "Home", url: "/" },
		{ id: 2, name: "About", url: "/about" },
		{ id: 3, name: "Services", url: "/services" },
	];

	const handleNavigate = (to) => {
		setHamburger(false);
		navigate(to);
	};

	const onLogout = () => {
		handleLogout?.();
		setHamburger(false);
		navigate("/");
	};

	return (
		<>
			{/*Fixed Navbar */}
			<nav className="fixed top-0 left-0 w-full z-20 bg-white shadow-md flex justify-between sm:px-5 sm:py-2 px-3 items-center">
				{/* Logo */}
				<Link to="/" onClick={() => setHamburger(false)}>
					<div className="flex justify-center items-center gap-4">
						<img
							className="h-[60px]"
							src="https://static.vecteezy.com/system/resources/previews/011/419/223/non_2x/mechanic-on-duty-logo-template-vector.jpg"
							alt="Logo"
						/>
						<h1 className="font-bold cursor-pointer text-[20px] text-black">OnTheSpotX</h1>
					</div>
				</Link>

				{/*Desktop Menu */}
				<ul className="hidden sm:flex text-[18px] font-semibold gap-6">
					{navLinks.map((nav) => (
						<li key={nav.id} className="relative group">
							<Link
								to={nav.url}
								className={`transition-all duration-300 ${location.pathname === nav.url ? "text-[#273F4F]" : "text-gray-700 hover:text-[#273F4F]"
									}`}
							>
								{nav.name}
							</Link>

							{/* Animated underline */}
							<span
								className={`absolute left-0 -bottom-1 h-[2px] bg-[#273F4F] transition-all duration-300 ${location.pathname === nav.url ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
									}`}
							/>
						</li>
					))}

					{/* Dashboard link shown only to admin */}
					{user?.role === "admin" && (
						<li className="relative group">
							<Link
								to="/dashboard"
								className={`transition-all duration-300 ${location.pathname === "/dashboard" ? "text-[#273F4F]" : "text-gray-700 hover:text-[#273F4F]"}`}
							>
								Dashboard
							</Link>
							<span
								className={`absolute left-0 -bottom-1 h-[2px] bg-[#273F4F] transition-all duration-300 ${location.pathname === "/dashboard" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
									}`}
							/>
						</li>
					)}
				</ul>

				{/* Desktop Button */}
				{isLoggedIn ? (
					<button
						onClick={onLogout}
						className="hidden sm:block font-semibold text-black bg-yellow-500 rounded-lg px-4 py-2 hover:bg-[#1e323f] transition"
					>
						Logout
					</button>
				) : (
					<button
						onClick={() => navigate("/login")}
						className="hidden sm:block font-semibold text-black bg-yellow-500 rounded-lg px-4 py-2 hover:bg-[#1e323f] transition"
					>
						Login
					</button>
				)}

				{/* 📱 Mobile Menu */}
				<div className="sm:hidden relative">
					<button onClick={() => setHamburger((s) => !s)} className="focus:outline-none transition-transform duration-300">
						{hamburger ? <IoClose size={35} /> : <IoMenu size={35} />}
					</button>

					{/* Dropdown */}
					<div
						className={`absolute right-0 mt-4 min-w-64 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3 text-lg font-semibold z-50 transform transition-all duration-300 origin-top ${hamburger ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
							}`}
					>
						{navLinks.map((nav) => (
							<li
								key={nav.id}
								className="cursor-pointer list-none hover:text-[#273F4F] transition-all border-b border-gray-100 pb-2"
								onClick={() => handleNavigate(nav.url)}
							>
								<Link to={nav.url}>{nav.name}</Link>
							</li>
						))}

						{/* Mobile Dashboard if admin */}
						{user?.role === "admin" && (
							<li
								className="cursor-pointer list-none hover:text-[#273F4F] transition-all border-b border-gray-100 pb-2"
								onClick={() => handleNavigate("/dashboard")}
							>
								<Link to="/dashboard">Dashboard</Link>
							</li>
						)}

						{/* Mobile Login / Logout (conditional) */}
						{isLoggedIn ? (
							<button
								className="mt-3 font-semibold text-white bg-yellow-500 rounded-lg px-8 py-2 hover:bg-[#1e323f] transition"
								onClick={onLogout}
							>
								<p className="text-black text-[15px]">Logout</p>
							</button>
						) : (
							<button
								className="mt-3 font-semibold text-white bg-yellow-500 rounded-lg px-8 py-2 hover:bg-[#1e323f] transition"
								onClick={() => {
									handleNavigate("/login");
								}}
							>
								<p className="text-black text-[15px]">Login</p>
							</button>
						)}
					</div>
				</div>
			</nav>
		</>
	);
}
