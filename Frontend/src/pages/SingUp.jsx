import SignIn from './LoginUi'
import { useNavigate } from 'react-router-dom'
import UserContext from '../context/userContext'
import { useState, useContext } from 'react'

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [role, setRole] = useState("customer");

	const { registerUser } = useContext(UserContext)

	const navigate = useNavigate()

	const handleSignUpSubmit = (e) => {
		e.preventDefault()
		registerUser({ name,phone,email, password, role }, { setEmail, setPassword })
	}

	return (
		<section className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-8">
			<div className="w-full max-w-md bg-white rounded-xl shadow p-6">


				<h1 className="text-2xl font-bold text-center mb-6">
					Register
				</h1>

				<form className="space-y-4" onSubmit={handleSignUpSubmit}>

					<div>
						<label className="block text-sm font-medium mb-1">Full Name</label>
						<input
							type="text"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="admin@example.com"
							required
							value={name}
							onChange={(e) => {
								setName(e.target.value)
							}}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Phone</label>
						<input
							type="number"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="admin@example.com"
							required
							value={phone}
							onChange={(e) => {
								setPhone(e.target.value)
							}}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							type="email"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="admin@example.com"
							required
							value={email}
							onChange={(e) => {
								setEmail(e.target.value)
							}}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							type="password"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="••••••••"
							required
							value={password}
							onChange={(e) => {
								setPassword(e.target.value)
							}}
						/>
					</div>

					{/* Select option */}

					<label className="block text-sm font-medium mb-1">Register as</label>

					<div className="relative">
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none" required
						>
							<option value="customer">Customer</option>
							<option value="mechanic">Mechanic</option>
							<option value="admin">Admin</option>
						</select>

						<span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
							<svg
								className="h-4 w-4 text-gray-500"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</span>
					</div>


					<div className="flex items-center justify-between">
						<label className="flex items-center gap-2 text-sm">
							<input type="checkbox" className="w-4 h-4" />
							Remember me
						</label>

						<a href="#" className="text-sm text-blue-600 hover:underline">
							Forgot password?
						</a>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
					>
						Sign In
					</button>

					<a onClick={() => navigate("/login")}>Already have account? <span className="text-blue-500 cursor-pointer">Login</span></a>

				</form>
			</div>
		</section>
	)
}