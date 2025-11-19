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
import {fetchMechanics} from "./slices/mechanicSlice.js"
import { useDispatch } from 'react-redux';
import ShowUser from './pages/ShowUser';
import { useContext } from 'react';
import UserContext from './context/userContext';


function App() {

	const dispatch = useDispatch();
	const { user, loading } = useContext(UserContext);


	useEffect(() => {
		if (localStorage.getItem('token') && user?.role === 'admin') {
			dispatch(fetchUsers());
			dispatch(fetchMechanics())
		}
	}, [dispatch, user]);

	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
				<Route path="/services" element={<Services />} />
				<Route path="/about" element={<About />} />
				<Route path="/book-service" element={<BookService />} />
				<Route path="/register" element={<Signup />} />
				<Route path="/login" element={<LoginUi />} />
				<Route path='/user/:id' element={<ShowUser />} />
			</Routes >
		</>
	)
}

export default App
