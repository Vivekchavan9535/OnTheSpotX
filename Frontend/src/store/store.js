
import { configureStore } from '@reduxjs/toolkit';
import usersSlice from '../slices/usersSlice';
import mechanicsSlice from '../slices/mechanicSlice'
import servicesSlice from '../slices/servicesSlice'


const store=()=>{
	return configureStore({
		reducer: {
			users: usersSlice,
			mechanics:mechanicsSlice,
			services:servicesSlice
		},
	});
}

export default store;