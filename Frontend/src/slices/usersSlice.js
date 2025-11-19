import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (q = "", { rejectWithValue }) => {
    try {
      const res = await axios.get(`/users?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/users/${userId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchSingleUser = createAsyncThunk(
  "users/fetchSingleUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/user/${userId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        const id = action.payload._id;
        state.data = state.data.filter((u) => u._id !== id);
      })

      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export default usersSlice.reducer;
