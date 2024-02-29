import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchByUser = createAsyncThunk(
  "company/fetchByUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/company/${data}`, {
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

export const createCompany = createAsyncThunk(
  "company/create",
  async (data, { rejectWithValue }) => {

    try {
      const response = await axios.post(`${url}/company`,data, {
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

export const updateCompany = createAsyncThunk(
  "company/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/company/${newData.user}`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data; // assuming response contains updated data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  Company: [],
  error: null,
  message: null,
  loading: false,
};

const CompanySlice = createSlice({
  name: "Company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.Company = action.payload;
        state.error = null;
      })
      .addCase(fetchByUser.rejected, (state, action) => {
        state.loading = false;
        state.Company = [];
        state.error = action.payload;
      })
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.Company = action.payload; // assuming the payload is the newly created company
        state.error = null;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.Company = action.payload; // assuming the payload is the newly created company
        state.error = null;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default CompanySlice.reducer;
