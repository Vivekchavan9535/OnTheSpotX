import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (undefined, { rejectWithValue }) => {
	try {
		const response = await axios.get('/users', { headers: { Authorization: localStorage.getItem('token') } });
		return response.data;
	} catch (error) {
		return rejectWithValue(error)
	}
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, { rejectWithValue }) => {
	try {
		const res = await axios.delete(`/users/${userId}`, { headers: { Authorization: localStorage.getItem('token') } });
		console.log(res.data);
		return res.data;
	} catch (error) {
		return rejectWithValue(error)
	}
});



export const fetchSingleUser = createAsyncThunk('users/fetchSingleUser', async (userId, { rejectWithValue }) => {
	try {
		const response = await axios.get(`/user/${userId}`, { headers: { Authorization: localStorage.getItem('token') } });
		return response.data;
	} catch (error) {
		return rejectWithValue(error)
	}
});



const usersSlice = createSlice({
	name: "users",
	initialState: {
		data: [],
		currentUser: null,
		loading: false,
		error: null,
	},
	reducers: {

	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			//delete user cases
			.addCase(deleteUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				state.loading = false;
				// const deleteId = action.meta.arg
				// state.data = state.data.filter(user => user._id !== deleteId)
				const idx = state.data.findIndex(user => user._id === action.payload._id);
				state.data.splice(idx, 1);
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			//show user cases
			.addCase(fetchSingleUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSingleUser.fulfilled, (state, action) => {
				state.loading = false;
				state.currentUser = action.payload;
			})
			.addCase(fetchSingleUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	}
});

export const { } = usersSlice.actions;
export default usersSlice.reducer;
