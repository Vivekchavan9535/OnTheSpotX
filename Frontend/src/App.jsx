import Navbar from './components/Navbar'
import './App.css'
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'
import BookService from './pages/BookService';
import Signup from './pages/SingUp'
import { Route, Routes } from 'react-router-dom';
import LoginUi from './pages/LoginUi'
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from 'react';
import { fetchUsers } from './slices/usersSlice';
import { fetchMechanics } from "./slices/mechanicSlice.js"
import { useDispatch } from 'react-redux';
import ShowUser from './pages/ShowUser';
import { useContext, useState } from 'react';
import UserContext from './context/userContext';
import SearchContext from './context/searchContext'
import { useSelector } from "react-redux";
import UserSlice from "./slices/usersSlice.js"
import { fetchServices } from './slices/servicesSlice.js'
import { ToastContainer, Bounce } from 'react-toastify';
import Footer from './components/Footer'
import logoImg from './assets/logo.png'
import MechanicProfile from "./pages/MechanicProfile"
import { fetchMechProfile } from './slices/mechanicSlice.js'
import ServiceRequest from './pages/ServiceRequest'
import FindingMechanics from './pages/FindingMechanics'







function App() {

	const dispatch = useDispatch();
	const { user, loading } = useContext(UserContext);
	const [search, setSearch] = useState("");
	const { data } = useSelector((state) => {
		return state.users
	})

	const token = localStorage.getItem("token")


	useEffect(() => {
		if (token && user?.role === 'admin') {
			dispatch(fetchUsers());
			dispatch(fetchMechanics());
		} else if (token && user?.role == "mechanic" && user?._id) {
			dispatch(fetchMechProfile(user._id))
		}
		dispatch(fetchServices())
	}, [dispatch, user, token]);



	// central debounced search effect
	useEffect(() => {
		const clean = String(search || "").trim();

		// debounce 350ms
		const t = setTimeout(() => {
			// dispatch search backend returns filtered list
			dispatch(fetchUsers(clean));
		}, 350);

		return () => clearTimeout(t);
	}, [search, dispatch]);



	return (
		<>
			<ToastContainer className="mt-20" position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />

			<SearchContext.Provider value={{ search, setSearch }}>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
					<Route path="/services" element={<Services />} />
					<Route path="/about" element={<About />} />
					<Route path="/book-service" element={<BookService />} />
					<Route path="/register" element={<Signup />} />
					<Route path="/login" element={<LoginUi />} />
					<Route path="/user/:id" element={<ShowUser />} />
					<Route path="/mechanic-profile" element={<MechanicProfile />} />
					<Route path="/service-request/:serviceId" element={<ServiceRequest />} />
					<Route path="/finding-mechanics" element={<FindingMechanics/>} />

				</Routes>
			</SearchContext.Provider>
			<Footer logoImg={logoImg} />
		</>
	)
}

export default App
