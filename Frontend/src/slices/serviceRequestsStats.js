import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";


export const fetchServiceRequestsStats = createAsyncThunk(
	"serviceRequestsStats/fetchServiceRequestsStats",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get("/service-requests/listStats",{headers:{Authorization:localStorage.getItem('token')}});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
const serviceRequestsStatsSlice = createSlice({
	name: "serviceRequestsStats",
	initialState: {
		data: {},
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchServiceRequestsStats.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchServiceRequestsStats.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchServiceRequestsStats.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
export default serviceRequestsStatsSlice.reducer;