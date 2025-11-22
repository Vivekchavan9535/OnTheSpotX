import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";

// FETCH ALL MECHANICS
export const fetchMechanics = createAsyncThunk(
	"mechanics/fetchMechanics",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get("/mechanics", {
				headers: { Authorization: localStorage.getItem("token") },
			});
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data || "Error fetching mechanics");
		}
	}
);

// FETCH SINGLE MECHANIC for admin
export const fetchSingleMechanic = createAsyncThunk(
	"mechanics/fetchSingleMechanic",
	async (id, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/mechanic/${id}`, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data || "Error fetching mechanic");
		}
	}
);


// Fetch Mech profile
export const fetchMechProfile = createAsyncThunk(
	"mechanics/fetchMechProfile",
	async (id, { rejectWithValue }) => {
		try {
			const res = await axios.get(`/mechanic-profile/${id}`, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data || "Error fetching mechanic");
		}
	}
);




// DELETE MECHANIC
export const deleteMechanic = createAsyncThunk(
	"mechanics/deleteMechanic",
	async (id, { rejectWithValue }) => {
		try {
			const res = await axios.delete(`/mechanic/${id}`, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			return res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data || "Error deleting mechanic");
		}
	}
);


export const updateMechanic = createAsyncThunk(
	"mechanics/updateMechanic",
	async ({ id, formData }, { rejectWithValue }) => {
		try {
			const res = await axios.put(`/mechanic/update/${id}`, formData, { headers: { Authorization: localStorage.getItem('token') } });
			return res.data;
		} catch (err) {
			console.log(err.response.data.error);
			return rejectWithValue(err.response.data.error);
		}
	}
);

const mechanicSlice = createSlice({
	name: "mechanics",
	initialState: {
		data: [],
		currentMech: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch all mechanics
			.addCase(fetchMechanics.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMechanics.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload || [];
			})
			.addCase(fetchMechanics.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch single
			.addCase(fetchSingleMechanic.pending, (state) => {
				state.loading = true;
				state.currentMech = null;
				state.error = null;
			})
			.addCase(fetchSingleMechanic.fulfilled, (state, action) => {
				state.loading = false;
				state.currentMech = action.payload;
			})
			.addCase(fetchSingleMechanic.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Fetch Mech Profile
			.addCase(fetchMechProfile.pending, (state) => {
				state.loading = true;
				state.currentMech = null;
				state.error = null;
			})
			.addCase(fetchMechProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.currentMech = action.payload;
			})
			.addCase(fetchMechProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			//updatemech
			.addCase(updateMechanic.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateMechanic.fulfilled, (state, action) => {
				state.loading = false;
				state.currentMech = action.payload;
			})
			.addCase(updateMechanic.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Delete
			.addCase(deleteMechanic.fulfilled, (state, action) => {
				const deletedId = action.payload._id;
				state.data = state.data.filter((m) => m._id !== deletedId);
			});
},
});

export default mechanicSlice.reducer;
