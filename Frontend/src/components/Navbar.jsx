// src/components/Navbar.jsx
import { IoMenu, IoClose } from "react-icons/io5";
import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";
import { ConfirmDialog } from "../components/ui/components/ui/ConfirmDialog";

export default function Navbar() {
	const [hamburger, setHamburger] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { user, isLoggedIn, handleLogout } = useContext(UserContext);

	const navLinks = [
		{ id: 1, name: "Home", url: "/" },
		{ id: 2, name: "Services", url: "/services" },
		{ id: 3, name: "About", url: "/about" },
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
			{/* Fixed Navbar */}
			<nav className="fixed top-3 left-8 backdrop-blur-2xl bg-white/50 rounded-4xl w-[97%] z-20 bg-gray-50 shadow-md flex justify-between sm:px-5 sm:py-2 px-3 items-center">
				{/* Logo */}
				<Link to="/" onClick={() => setHamburger(false)}>
					<div className="flex justify-center items-center gap-4">
						<img
							className="h-[50px]"
							src="https://static.vecteezy.com/system/resources/previews/011/419/223/non_2x/mechanic-on-duty-logo-template-vector.jpg"
							alt="Logo"
						/>
						<h1 className="font-bold cursor-pointer text-[20px] text-black">
							OnTheSpotX
						</h1>
					</div>
				</Link>

				{/* Desktop Menu */}
				<ul className="hidden sm:flex text-[18px] font-semibold gap-6">
					{navLinks.map((nav) => (
						<li key={nav.id} className="relative group">
							<Link
								to={nav.url}
								className={`transition-all duration-300 ${location.pathname === nav.url
										? "text-[#273F4F]"
										: "text-gray-700 hover:text-[#273F4F]"
									}`}
							>
								{nav.name}
							</Link>

							{/* Animated underline */}
							<span
								className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-500 transition-all duration-300 ${location.pathname === nav.url
										? "w-full opacity-100"
										: "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
									}`}
							/>
						</li>
					))}

					{/* Dashboard link shown only to admin */}
					{user?.role === "admin" && (
						<li className="relative group">
							<Link
								to="/admin-dashboard"
								className={`transition-all duration-300 ${location.pathname === "/admin-dashboard"
										? "text-[#273F4F]"
										: "text-gray-700 hover:text-[#273F4F]"
									}`}
							>
								Dashboard
							</Link>
							<span
								className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-500 transition-all duration-300 ${location.pathname === "/admin-dashboard"
										? "w-full opacity-100"
										: "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
									}`}
							/>
						</li>
					)}
				</ul>

				{/* Desktop Buttons (Profile + Logout/Login) */}
				<div className="hidden sm:flex items-center gap-4">
					{user?.role === "mechanic" && (
						<button
							type="button"
							onClick={() => navigate("/mechanic-profile")}
							className="flex items-center justify-center font-bold text-black bg-gray-200 w-12 h-12 rounded-full hover:bg-[#1e323f] hover:text-white transition"
						>
							{user?.fullName[0]?.toUpperCase() || "M"}

						</button>
					)}

					{(isLoggedIn || localStorage.getItem("token")) ? (
						<ConfirmDialog
							title="Are you sure you want to logout?"
							desc="You will be signed out from your account."
							actionLabel="Logout"
							onConfirm={() => onLogout()}
							trigger={
								<button
									type="button"
									onClick={(e) => e.stopPropagation()}
									className="font-semibold text-black bg-yellow-500 rounded-lg px-4 py-2 hover:bg-[#1e323f] transition"
								>
									Logout
								</button>
							}
						/>
					) : (
						<button
							onClick={() => navigate("/login")}
							className="font-semibold text-black bg-yellow-500 rounded-lg px-4 py-2 hover:bg-[#1e323f] transition"
							type="button"
						>
							Login
						</button>
					)}
				</div>

				{/* Mobile Menu */}
				<div className="sm:hidden relative">
					<button
						onClick={() => setHamburger((s) => !s)}
						className="focus:outline-none transition-transform duration-300"
						type="button"
					>
						{hamburger ? <IoClose size={35} /> : <IoMenu size={35} />}
					</button>

					{/* Dropdown */}
					<div
						className={`absolute right-0 mt-4 min-w-64 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-3 text-lg font-semibold z-50 transform transition-all duration-300 origin-top ${hamburger
								? "scale-y-100 opacity-100"
								: "scale-y-0 opacity-0 pointer-events-none"
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
								onClick={() => handleNavigate("/admin-dashboard")}
							>
								<Link to="/admin-dashboard">Dashboard</Link>
							</li>
						)}

						{/* Mobile Mechanic Profile */}
						{user?.role === "mechanic" && (
							<button
								type="button"
								onClick={() => handleNavigate("/mechanic-profile")}
								className="flex items-center justify-center font-bold text-black bg-gray-200 w-12 h-12 rounded-full hover:bg-[#1e323f] hover:text-white transition mx-auto mt-2"
							>
								{user?.fullName[0]?.toUpperCase() || "M"}
							</button>
						)}

						{/* Mobile Login / Logout */}
						{(isLoggedIn || localStorage.getItem("token")) ? (
							<ConfirmDialog
								title="Are you sure you want to logout?"
								desc="You will be signed out from your account."
								actionLabel="Logout"
								onConfirm={() => onLogout()}
								trigger={
									<button
										type="button"
										onClick={(e) => e.stopPropagation()}
										className="mt-3 font-semibold text-white bg-yellow-500 rounded-lg px-8 py-2 hover:bg-[#1e323f] transition"
									>
										<p className="text-black text-[15px]">Logout</p>
									</button>
								}
							/>
						) : (
							<button
								className="mt-3 font-semibold text-white bg-yellow-500 rounded-lg px-8 py-2 hover:bg-[#1e323f] transition"
								onClick={() => {
									handleNavigate("/login");
								}}
								type="button"
							>
								<p className="text-black text-[15px]">Login</p>
							</button>
						)}
					</div>
				</div>
			</nav>

			{/* spacer so content isn't hidden under fixed navbar */}
			<div className="h-[60px] sm:h-30" />
		</>
	);
}
