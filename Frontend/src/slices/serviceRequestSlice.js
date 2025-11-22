import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";




const serviceRequestSlice = createSlice({
	name: "service-request",
	initialState: {
		data: [],
		service: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// send service
			.addCase(sendServiceReq.pending, (state) => {
				state.loading = true;
				state.currentMech = null;
				state.error = null;
			})
			.addCase(sendServiceReq.fulfilled, (state, action) => {
				state.loading = false;
				state.currentMech = action.payload;
			})
			.addCase(sendServiceReq.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			
},
});

export default mechanicSlice.reducer;
