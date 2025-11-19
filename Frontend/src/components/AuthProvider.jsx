import UserContext from '../context/userContext';
import { useReducer,useEffect } from 'react';
import axios from "../config/axios.js";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '../slices/usersSlice.js';


const userReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN": {
			return { ...state, isLoggedIn: true, user: action.payload, serverErrors: "" }
		}
		case "LOGOUT": {
			return { ...state, isLoggedIn: false, user: null, serverErrors: "" }
		}
		case "SERVER_ERRORS": {
			return { ...state, serverErrors: action.payload }
		}
		default: {
			return { ...state, serverErrors: "", loading: false }
		}
	}
}

export default function AuthProvider(props) {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(() => {
		if (localStorage.getItem("token")) {
			const fetchUser = async () => {
				try {
					const userResponse = await axios.get('/user/account', { headers: { Authorization: localStorage.getItem("token") } })
					userDispatch({ type: "LOGIN", payload: userResponse.data })
				} catch (error) {
					console.log(error.message);
				}

			}
			fetchUser()
		}
	}, [])



	const [userState, userDispatch] = useReducer(userReducer, {
		user: null,
		isLoggedIn: false,
		serverErrors: ""
	})

	


	const handleLogin = async (formData, { setEmail, setPassword }) => {
		try {
			const response = await axios.post('/login', formData);
			localStorage.setItem("token", response.data.token);

			const user = await axios.get('/user/account', { headers: { Authorization: localStorage.getItem('token') } })
			console.log(user.data);

			alert('Successfully LoggedIn')

			userDispatch({ type: "LOGIN", payload: user.data});

			setEmail("");
			setPassword("");


			// Role based login navigation
			if (user.data.role === "admin") {
				navigate("/dashboard");
			} else if (user.data.role === "customer") {
				navigate("/");
			} else if (user.data.role === "mechanic") {
				navigate("/mechanic");
			} else {
				navigate("/"); // default fallback
			}

		} catch (error) {
			userDispatch({ type: "SERVER_ERRORS", payload: error?.response?.data?.error});
			console.log(error.response.data.error);
			alert(error.response.data.error)
		}
	};

	const registerUser = async (formData, resetForm) => {
		try {
			const response = await axios.post('/register', formData);
			alert('Registration Successful! Please login.');
			console.log(response.data);
			resetForm();
			navigate('/login');
		} catch (error) {
			// Prefer structured error object when available
			const msg = error?.response?.data?.error;
			alert(msg);
			userDispatch({ type: "SERVER_ERRORS", payload: msg });
			console.log(msg);
		}
	};



	const handleLogout = () => {
		localStorage.removeItem("token");
		userDispatch({ type: "LOGOUT" });
		navigate("/");
	}

	return (
		<UserContext.Provider value={{ ...userState, handleLogin, handleLogout,registerUser,userDispatch}}>
			{props.children}
		</UserContext.Provider>
	)
}