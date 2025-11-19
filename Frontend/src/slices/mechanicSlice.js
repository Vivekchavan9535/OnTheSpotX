import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../config/axios.js"


export const fetchMechanics = createAsyncThunk("mechanics/fetchMechanics", async (undefined, { rejectWithValue }) => {
	try {
		const res = await axios.get("/mechanics", { headers: { Authorization: localStorage.getItem('token') } })
		return res.data
	} catch (error) {
		rejectWithValue(error.response.data.error)
		console.log(error.response.data.error);
	}
})

export const fetchSingleMechanic = createAsyncThunk('mechanic/fetchSingleMechanic', async (userId, { rejectWithValue }) => {
	try {
		const res = await axios.get(`/mechanic/${userId}`, { headers: { Authorization: localStorage.getItem('token') } });
		console.log(res.data);
		return res.data;
	} catch (error) {
		return rejectWithValue(error)
	}
});

const mechanicSlice = createSlice({
	name: "mechanics",
	initialState: {
		data: [],
		currentMech: null,
		loading: false,
		serverErrors: ""

	},
	reducers: {},
	extraReducers: (builder) => {
		builder.
			addCase(fetchMechanics.fulfilled, (state, action) => {
				state.data = action.payload
			})
			.addCase(fetchSingleMechanic.fulfilled, (state, action) => {
				state.currentMech = action.payload;
			})
	}
})




export const { } = mechanicSlice.actions;
export default mechanicSlice.reducer;

