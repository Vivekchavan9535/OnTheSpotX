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

	const handleLogin = async (formData, { setEmail, setPassword }) => {
		try {
			const res = await axios.post("/login", formData);
			localStorage.setItem("token", res.data.token);

			console.log(res);


			const userRes = await axios.get("/user/account", {
				headers: { Authorization: localStorage.getItem("token") },
			});

			console.log(userRes);


			userDispatch({ type: "LOGIN", payload: userRes.data });
			toastSuccess("Successfully logged in");
			// Role-based navigation
			const role = userRes.data.role;
			if (role === "admin") navigate("/admin-dashboard");
			else if (role === "customer") navigate("/");
			else if (role === "mechanic") navigate("/mechanic-profile");
			else navigate("/");
			setEmail = "";
			setPassword = "";

		} catch (err) {
			console.log(err);

			const msg = err?.response?.data?.error || "Login failed";
			userDispatch({ type: "SERVER_ERRORS", payload: msg });
			toastErr(msg);
		}
	};

	const registerUser = async (formData, resetForm) => {
		try {
			await axios.post("/register", formData);
			toastSuccess("Registration successful! Please login.");
			navigate("/login");
			resetForm();
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
