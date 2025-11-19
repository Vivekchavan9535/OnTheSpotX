import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './components/AuthProvider'
import createStore from './store/store.js'
import { Provider } from 'react-redux'

const store = createStore()
console.log('store updated', store.getState());

store.subscribe(()=>{
	console.log(store.getState());
})

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Provider store={store}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</Provider>
	</BrowserRouter>
)
