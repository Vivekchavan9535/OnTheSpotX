import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";


export const fetchServiceRequests = createAsyncThunk(
	"serviceRequests/fetchServiceRequests",

	async ({ page }, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/service-requests?page=${page}`, { headers: { Authorization: localStorage.getItem('token') } });
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
		totalPages: 1,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchServiceRequests.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchServiceRequests.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload.serviceRequests;
				state.totalPages = action.payload.totalPages;
			})
			.addCase(fetchServiceRequests.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

	},
});

export default serviceRequestsSlice.reducer;
