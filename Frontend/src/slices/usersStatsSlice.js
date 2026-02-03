import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";
export const fetchUsersStats = createAsyncThunk(
	"usersStats/fetchUsersStats",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/users/stats", { headers: { Authorization: localStorage.getItem('token') } });
			return res.data;
		}
		catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
const usersStatsSlice = createSlice({
	name: "usersStats",
	initialState: {
		data: {},
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsersStats.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsersStats.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchUsersStats.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});
export default usersStatsSlice.reducer;