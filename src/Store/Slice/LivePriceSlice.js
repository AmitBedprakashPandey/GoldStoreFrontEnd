import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const livePriceAll = createAsyncThunk(
  "FrontPage/livePriceAll",
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

export const getLivePriceByStatusUser = createAsyncThunk(
    "FrontPage/livePriceByStatusUser",
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

export const createLivePrice = createAsyncThunk(
  "FrontPage/createLivePrice",
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

export const updateLivePrice = createAsyncThunk(
  "FrontPage/updateLivePrice",
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
  livePrice: [],
  error: null,
  message: null,
  loading: false,
};

const LivePriceSlice = createSlice({
  name: "LivePrice",
  initialState,
  reducers: {
    getLivePrice: (state, action) => {
      state.livePrice = action.payload;
    },
  },
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
      .addCase(getLivePriceByStatusUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLivePriceByStatusUser.fulfilled, (state, action) => {
        state.loading = false;
        state.livePrice = action.payload;
        state.error = null;
      })
      .addCase(getLivePriceByStatusUser.rejected, (state, action) => {
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
        state.livePrice = action.payload; // assuming the payload is the newly created company
        state.error = null;
      })
      .addCase(createLivePrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLivePrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLivePrice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.livePrice = action.payload; // assuming the payload is the newly created company
        state.error = null;
      })
      .addCase(updateLivePrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { getLivePrice} = LivePriceSlice.actions;
export default LivePriceSlice.reducer;
