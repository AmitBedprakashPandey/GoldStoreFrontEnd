import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchOnePrint = createAsyncThunk(
  "Print/fetchOne", // Change the action type to fetchOne
  async (id, { rejectWithValue }) => {    
    try {
      const response = await axios.get(
        `${url}/print/${id}/${localStorage.getItem("user")}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const PrintSlice = createSlice({
  name: "print",
  initialState: {
    Print: [],
    message: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnePrint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnePrint.fulfilled, (state, action) => {
        state.loading = false;
        state.Print = action.payload;
        state.error = null;
      })
      .addCase(fetchOnePrint.rejected, (state, action) => {
        state.loading = false;
        state.Print = [];
        state.error = action.payload;
      });
  },
});

export default PrintSlice.reducer;