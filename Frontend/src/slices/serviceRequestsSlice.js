import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";


export const fectServiceRequests = createAsyncThunk(
	"serviceRequests/fectServiceRequests",
	async (undefined, { rejectWithValue }) => {
		try {
			const res = await axios.get("/service-requests", { headers: { Authorization: localStorage.getItem('token') } });
			console.log(res.data);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data);
		}
	}
);

const serviceRequestsSlice = createSlice({
	name: "service-request",
	initialState: {
		data: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fectServiceRequests.pending, (state) => {
				state.loading = true;
				state.data = null;
				state.error = null;
			})
			.addCase(fectServiceRequests.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fectServiceRequests.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})


	},
});

export default serviceRequestsSlice.reducer;
