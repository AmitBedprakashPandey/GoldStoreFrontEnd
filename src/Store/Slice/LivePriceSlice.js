import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const livePriceAll = createAsyncThunk(
  "FrontPage/livePriceAll",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/liveprice`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getLivePrice = createAsyncThunk(
  "FrontPage/getLivePrice",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/liveprice/status`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getCompany = createAsyncThunk(
  "FrontPage/getCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/liveprice/Company`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createLivePrice = createAsyncThunk(
  "FrontPage/createLivePrice",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/liveprice`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  livePrice: [],
  error: null,
  message: null,
  loading: false,
};

const LivePriceSlice = createSlice({
  name: "LivePrice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(livePriceAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(livePriceAll.fulfilled, (state, action) => {
        state.loading = false;
        state.livePrice = action.payload;
        state.error = null;
      })
      .addCase(livePriceAll.rejected, (state, action) => {
        state.loading = false;
        state.livePrice = [];
        state.error = action.payload;
      })

      .addCase(createLivePrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLivePrice.fulfilled, (state, action) => {
        state.loading = false;
        state.livePrice.push(action.payload.data);
        state.message = action.payload.message
        state.error = null;
      })
      .addCase(createLivePrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default LivePriceSlice.reducer;
