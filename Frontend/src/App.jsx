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
import { useContext,useState } from 'react';
import UserContext from './context/userContext';
import SearchContext from './context/searchContext'



function App() {

	const dispatch = useDispatch();
	const { user, loading } = useContext(UserContext);
    const [search, setSearch] = useState("");


	useEffect(() => {
		if (localStorage.getItem('token') && user?.role === 'admin') {
			dispatch(fetchUsers());
			dispatch(fetchMechanics());
		}
	}, [dispatch, user]);

	// central debounced search effect
	useEffect(() => {
		const clean = String(search || "").trim();

		// debounce 350ms
		const t = setTimeout(() => {
			// dispatch search — backend returns filtered list
			dispatch(fetchUsers(clean));
		}, 350);

		return () => clearTimeout(t);
	}, [search, dispatch]);

	return (
		<>
			<SearchContext.Provider value={{ search, setSearch }}>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
					<Route path="/services" element={<Services />} />
					<Route path="/about" element={<About />} />
					<Route path="/book-service" element={<BookService />} />
					<Route path="/register" element={<Signup />} />
					<Route path="/login" element={<LoginUi />} />
					<Route path="/user/:id" element={<ShowUser />} />
				</Routes>
			</SearchContext.Provider>
		</>
	)
}

export default App
