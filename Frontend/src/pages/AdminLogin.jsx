export default function AdminLogin() {
	return (
		<>
			<section class="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-8">
				<div class="w-full max-w-md bg-white rounded-xl shadow p-6">

			
					<h1 class="text-2xl font-bold text-center mb-6">
						Admin Login
					</h1>

					<form class="space-y-4">

						<div>
							<label class="block text-sm font-medium mb-1">Email</label>
							<input
								type="email"
								class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
								placeholder="admin@example.com"
								required
							/>
						</div>

						<div>
							<label class="block text-sm font-medium mb-1">Password</label>
							<input
								type="password"
								class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
								placeholder="••••••••"
								required
							/>
						</div>

						<div class="flex items-center justify-between">
							<label class="flex items-center gap-2 text-sm">
								<input type="checkbox" class="w-4 h-4" />
								Remember me
							</label>

							<a href="#" class="text-sm text-blue-600 hover:underline">
								Forgot password?
							</a>
						</div>

						<button
							type="submit"
							class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
						>
							Sign In
						</button>

					</form>
				</div>
			</section>

		</>
	)
}