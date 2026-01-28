
import { configureStore } from '@reduxjs/toolkit';
import usersSlice from '../slices/usersSlice';
import mechanicsSlice from '../slices/mechanicSlice'
import servicesSlice from '../slices/servicesSlice'
import serviceRequestsSlice from '../slices/serviceRequestsSlice'
import serviceRequestsStatsSlice from '../slices/serviceRequestsStats.js'


const store=()=>{
	return configureStore({
		reducer: {
			users: usersSlice,
			mechanics:mechanicsSlice,
			services:servicesSlice,
			serviceRequests:serviceRequestsSlice,
			serviceRequestsStats:serviceRequestsStatsSlice,
		},
	});
}

export default store;