import UserContext from '../context/userContext';
import { useReducer, useEffect } from 'react';
import axios from "../config/axios.js";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const toastErr = (msg) =>
	toast.error(msg, { position: "top-center", autoClose: 1000, theme: "dark" });

const toastSuccess = (msg) =>
	toast.success(msg, { position: "top-center", autoClose: 1000, theme: "dark" });

const userReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return { ...state, isLoggedIn: true, user: action.payload, serverErrors: "" };
		case "LOGOUT":
			return { ...state, isLoggedIn: false, user: null, serverErrors: "" };
		case "SERVER_ERRORS":
			return { ...state, serverErrors: action.payload };
		default:
			return state;
	}
};

export default function AuthProvider({ children }) {
	const navigate = useNavigate();

	const [userState, userDispatch] = useReducer(userReducer, {
		user: null,
		isLoggedIn: false,
		serverErrors: "",
		loading: false,
	});

	useEffect(() => {
		if (localStorage.getItem("token")) {
			const fetchUser = async () => {
				try {
					const res = await axios.get("/user/account", {
						headers: { Authorization: localStorage.getItem("token") },
					});
					userDispatch({ type: "LOGIN", payload: res.data });
				} catch (err) {
					console.error("Failed to fetch user:", err.message);
					localStorage.removeItem("token");
				}
			};
			fetchUser();
		}
	}, []);

	const handleLogin = async (formData, { resetForm }) => {
		try {
			const res = await axios.post("/login", formData);
			localStorage.setItem("token", res.data.token);

			const userRes = await axios.get("/user/account", {
				headers: { Authorization: localStorage.getItem("token") },
			});

			toastSuccess("Successfully logged in");
			userDispatch({ type: "LOGIN", payload: userRes.data });

			resetForm();

			// Role-based navigation
			const role = userRes.data.role;
			if (role === "admin") navigate("/admin-dashboard", { replace: true });
			else if (role === "customer") navigate("/", { replace: true });
			else if (role === "mechanic") navigate("/mechanic-profile", { replace: true });
			else navigate("/", { replace: true });
		} catch (err) {
			const msg = err?.response?.data?.error || "Login failed";
			userDispatch({ type: "SERVER_ERRORS", payload: msg });
			toastErr(msg);
		}
	};

	const registerUser = async (formData, resetForm) => {
		try {
			await axios.post("/register", formData);
			toastSuccess("Registration successful! Please login.");
			resetForm();
			navigate("/login");
		} catch (err) {
			const msg = err?.response?.data?.error || "Registration failed";
			userDispatch({ type: "SERVER_ERRORS", payload: msg });
			toastErr(msg);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		userDispatch({ type: "LOGOUT" });
		navigate("/");
	};

	return (
		<UserContext.Provider
			value={{ ...userState, handleLogin, handleLogout, registerUser, userDispatch }}
		>
			{children}
		</UserContext.Provider>
	);
}
