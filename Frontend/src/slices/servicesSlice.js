import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";

export const fetchServices = createAsyncThunk(
	"services/fetchServices",
	async (undefined, { rejectWithValue }) => {
		try {
			const res = await axios.get("/services", { headers: { Authorization: localStorage.getItem('token') } });
			console.log(res.data);
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data);
		}
	}
);




export const addService = createAsyncThunk(
	"services/addService",
	async ({formData,resetForm}, { rejectWithValue }) => {
		try {
			const res = await axios.post("/service", formData, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			console.log(res);
			resetForm()
			return res.data;
		} catch (err) {
			console.log(err.response.data);
			alert(err.response.data.error)
			return rejectWithValue(err.response?.data.error);
		}
	}
);




// export const deleteUser = createAsyncThunk(
//   "users/deleteUser",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const res = await axios.delete(`/users/${userId}`, {
//         headers: { Authorization: localStorage.getItem("token") },
//       });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Error deleting user");
//     }
//   }
// );



const servicesSlice = createSlice({
	name: "services",
	initialState: {
		data: [],
		currentUser: null,
		loading: false,
		serverError: null
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchServices.pending, (state) => {
				state.loading = true;
				state.serverError = null;
				state.data = [];
			})
			.addCase(fetchServices.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchServices.rejected, (state, action) => {
				state.loading = false;
				state.serverError = action.payload;
			})

			//Add service
			.addCase(addService.pending, (state, action) => {
				state.loading = true;
				state.serverError = null;
			})
			.addCase(addService.fulfilled, (state, action) => {
				state.loading = false;
				state.data.push(action.payload);
			})
			.addCase(addService.rejected, (state, action) => {
				state.loading = false;
				state.serverError = action.payload;
			})


		//   .addCase(fetchSingleUser.pending, (state) => {
		//     state.loading = true;
		//     state.error = null;
		//     state.currentUser = null;
		//   })
		//   .addCase(fetchSingleUser.fulfilled, (state, action) => {
		//     state.loading = false;
		//     state.currentUser = action.payload;
		//   })
		//   .addCase(fetchSingleUser.rejected, (state, action) => {
		//     state.loading = false;
		//     state.error = action.payload;
		//   })

		//   .addCase(deleteUser.fulfilled, (state, action) => {
		//     state.data = state.data.filter((u) => u._id !== action.payload._id);
		//   });
	},
});

export default servicesSlice.reducer;
