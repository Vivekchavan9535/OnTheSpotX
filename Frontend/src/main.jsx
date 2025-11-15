import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './components/AuthProvider'

createRoot(document.getElementById('root')).render(
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
)
