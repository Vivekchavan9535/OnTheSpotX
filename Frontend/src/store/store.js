
import { configureStore } from '@reduxjs/toolkit';
import usersSlice from '../slices/usersSlice';
import mechanicsSlice from '../slices/mechanicSlice'


const store=()=>{
	return configureStore({
		reducer: {
			users: usersSlice,
			mechanics:mechanicsSlice
		},
	});
}

export default store;