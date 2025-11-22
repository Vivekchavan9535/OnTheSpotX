import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/userContext";

export default function LoginUi() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { handleLogin, serverErrors, userDispatch } = useContext(UserContext);

	

	useEffect(() => {
		return () => {
			userDispatch({ type: "SERVER_ERRORS", payload: "" });
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		handleLogin({ email, password },{setEmail, setPassword});
	};

	// demo logins set credentials and call handleLogin immediately
	const demo = (role) => {
		const creds = {
			admin: { email: "admin@test.com", password: "admin123" },
			mechanic: { email: "mech@test.com", password: "mech123" },
			customer: { email: "user@test.com", password: "user123" },
		}[role];

		if (!creds) return;
		setEmail(creds.email);
		setPassword(creds.password);
		handleLogin({ email: creds.email, password: creds.password }, { setEmail, setPassword });
	};

	return (
		<section className="flex items-center justify-center px-6">
			<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
				<h1 className="text-2xl font-bold text-center mb-4">Login</h1>

				{/* Demo buttons */}
				<div className="flex gap-2 mb-4">
					<button type="button" onClick={() => demo("admin")} className="flex-1 py-2 bg-gray-100 rounded-lg">Demo Admin</button>
					<button type="button" onClick={() => demo("mechanic")} className="flex-1 py-2 bg-gray-100 rounded-lg">Demo Mechanic</button>
					<button type="button" onClick={() => demo("customer")} className="flex-1 py-2 bg-gray-100 rounded-lg">Demo User</button>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm mb-1">Email</label>
						<input
							type="email"
							className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="admin@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-sm mb-1">Password</label>
						<input
							type="password"
							className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					{serverErrors && <p className="text-red-500 text-sm">{String(serverErrors)}</p>}

					<div className="flex items-center justify-between">
						<label className="flex items-center gap-2 text-sm">
							<input type="checkbox" className="w-4 h-4" /> Remember me
						</label>

						<button type="button" onClick={() => navigate("/forgot-password")} className="text-sm text-blue-600">
							Forgot password?
						</button>
					</div>

					<button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
						Sign In
					</button>

					<div className="text-center mt-2">
						<button type="button" onClick={() => navigate("/register")} className="text-sm text-blue-500 underline">
							Don't have account? Signup
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}
