import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios.js";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (search = "", { rejectWithValue }) => {
    try {
      const res = await axios.get(`/users?q=${encodeURIComponent(search)}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return res.data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching users");
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
      return rejectWithValue(err.response?.data || "Error deleting user");
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
      return rejectWithValue(err.response?.data || "Error fetching user");
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
        state.error = null;
        state.data = [];
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUser = null;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((u) => u._id !== action.payload._id);
      });
  },
});

export default usersSlice.reducer;
