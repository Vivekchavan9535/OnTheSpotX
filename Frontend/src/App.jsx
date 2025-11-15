import Navbar from './components/Navbar'
import './App.css'
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About'
import Dashboard from './pages/AdminDashboard'
import AdminLogin from "./pages/AdminLogin";
import BookService from './pages/BookService';
import Signup from './pages/SingUp'
import { Route, Routes } from 'react-router-dom';
import LoginUi from './pages/LoginUi'
import ProtectedRoute from "./components/ProtectedRoute";


function App() {

	return (
		<>
			<Navbar />
			<div className='pt-[80px]'>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/services" element={<Services />} />
					<Route path="/about" element={<About />} />
					<Route path="/admin-login" element={<AdminLogin />} />
					<Route path="/book-service" element={<BookService />} />
					<Route path="/register" element={<Signup />} />
					<Route path="/login" element={<LoginUi />} />
				</Routes >
			</div>


		</>
	)
}

export default App
