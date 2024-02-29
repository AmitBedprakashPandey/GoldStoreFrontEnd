import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllState = createAsyncThunk(
  "State/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/state`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  State: [],
  error: null,
  loading: false,
};

const StatesSlice = createSlice({
  name: "State",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllState.fulfilled, (state, action) => {
        state.loading = false;
        state.State = action.payload;
        state.error = null;
      })
      .addCase(fetchAllState.rejected, (state, action) => {
        state.loading = false;
        state.State = [];
        state.error = action.payload;
      })
   
  },
});

export default StatesSlice.reducer;
