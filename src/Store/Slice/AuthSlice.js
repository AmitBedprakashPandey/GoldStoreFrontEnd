import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "axios";

const url = process.env.React_APP_API_URL + "/auth";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, credentials);      
      if (response.status === 404) {
        return rejectWithValue(response);
      }
      localStorage.setItem("user", response.data.email);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (credentials, { rejectWithValue }) => {
    try {      
      const response = await axios.post(`${url}/forget`, credentials);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const loginSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    message : null
  },
  reducers: {
    logout: (state) => {
      state.error = null;
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("printData");
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
        state.error = action.payload.response?.data?.error
      })
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
        state.message = action.payload.message;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload
        
      });
  },
});

export const { logout, setUser } = loginSlice.actions;

export default loginSlice.reducer;
