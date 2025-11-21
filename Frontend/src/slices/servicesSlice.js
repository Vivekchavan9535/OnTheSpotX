import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";
import { ToastContainer, toast, Bounce } from 'react-toastify';


const toastErr = (msg) =>
	toast.error(msg, {
		position: "top-center",
		autoClose: 3000,
		theme: "dark",
	});

const toastSuccess = (msg) =>
	toast.success(msg, {
		position: "top-center",
		autoClose: 1000,
		theme: "dark",
	});


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
	async ({ formData, resetForm }, { rejectWithValue }) => {
		try {
			const res = await axios.post("/service", formData, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			toastSuccess("Service is created successfully")
			resetForm()
			return res.data;
		} catch (err) {
			console.log(err.response.data.error);
			toastErr(err.response.data.error)
			return rejectWithValue(err.response?.data.error);
		}
	}
);

export const updateService = createAsyncThunk('service/updateService', async ({ editId, formData, resetForm }, { rejectWithValue }) => {
	try {
		const res = await axios.put(`/service/${editId}`, formData, {
			headers: {
				Authorization: localStorage.getItem('token')
			}
		});
		toastSuccess("Service updated successfully!")
		return res.data
	} catch (error) {
		console.log(error.response.data.error);
		toastErr(error.response.data.error)
		return rejectWithValue(error.response?.data.error)
	}
})


export const deleteService = createAsyncThunk(
	"service/deleteService",
	async (serviceId, { rejectWithValue }) => {
		try {
			const res = await axios.delete(`/service/${serviceId}`, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			toastSuccess("Successfully Deleted")
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data || "Error deleting user");
		}
	}
);



const servicesSlice = createSlice({
	name: "services",
	initialState: {
		data: [],
		currentUser: null,
		editId: null,
		loading: false,
		serverError: null
	},
	reducers: {
		setEditId: (state, action) => {
			state.editId = action.payload;
		},
		clearEditId: (state) => {
			state.editId = null;
			state.serverError = null;
		},
	},
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
			.addCase(addService.pending, (state) => {
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

			//update service
			.addCase(updateService.pending, (state) => {
				state.loading = true;
				state.serverError = null;
			})
			.addCase(updateService.fulfilled, (state, action) => {
				state.loading = false;
				const idx = state.data.findIndex((ele) => ele._id === action.payload._id)
				state.data[idx] = action.payload
				state.editId = null;
			})
			.addCase(updateService.rejected, (state, action) => {
				state.loading = false;
				state.serverError = action.payload;
			})

			.addCase(deleteService.fulfilled, (state, action) => {
				const idx = state.data.findIndex((s) => s._id == action.payload._id);
				state.data.splice(idx, 1)
			})
			.addCase(deleteService.rejected, (state, action) => {
				state.loading = false;
				state.serverError = action.payload;
			})
	},
});

export const { setEditId, clearEditId } = servicesSlice.actions;

export default servicesSlice.reducer;