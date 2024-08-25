import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Ensure the correct environment variable
const url = `${process.env.REACT_APP_API_URL}/auth`;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, credentials);
      
      // No need to check for status 404 here as Axios throws an error for bad responses
      // and it should be caught in the catch block.

      localStorage.setItem("user", response.data.email);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      // Improved error handling
      return rejectWithValue(
        error.response?.data?.error || "An error occurred during login"
      );
    }
  }
);

const loginSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.error = null;
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
        // Optionally remove logging or use a logging library
        console.error("Login error:", action.payload);
      });
  },
});

export const { logout, setUser } = loginSlice.actions;

export default loginSlice.reducer;
