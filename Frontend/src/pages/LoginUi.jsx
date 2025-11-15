import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserContext from "../context/userContext";
import { useContext } from "react";

export default function LoginUi() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleLogin, serverErrors } = useContext(UserContext);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password }, { setEmail, setPassword });
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 pt-20">
      {/* Container is scrollable so keyboard won't hide inputs */}
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form className="space-y-4" onSubmit={(e)=>handleLoginSubmit(e)}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* show server error */}
          {serverErrors && (
            <p className="text-red-500 text-sm break-words">{String(serverErrors)}</p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>

            {/* make this a proper button for better mobile behavior */}
            <button
              type="button"
              onClick={() => {
                // navigate to forgot password page or show modal
                navigate("/forgot-password");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition text-base"
          >
            Sign In
          </button>

          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-sm text-blue-500 underline"
            >
              Don't have account? Signup
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
