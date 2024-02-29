
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllPyMode = createAsyncThunk(
  "PyMode/All",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/mode/${localStorage.getItem('user')}`, {
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

export const createPyMode = createAsyncThunk(
  "PyMode/create",
  async (PyModeData, { rejectWithValue }) => {
    console.log(PyModeData);
    try {
      const response = await axios.post(`${url}/mode`, PyModeData, {
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

export const deletePyMode = createAsyncThunk(
  "PyMode/delete",
  async (PyModeId, { rejectWithValue }) => {
    try {
   const response =    await axios.delete(`${url}/mode/${PyModeId}/${localStorage.getItem('user')}`, {
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

export const updatePyMode = createAsyncThunk(
  "PyMode/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/mode/${newData._id}/${localStorage.getItem('user')}`,
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
  PyMode: [],
  error: null,
  loading: false,
};

const PyModesSlice = createSlice({
  name: "PyMode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPyMode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPyMode.fulfilled, (state, action) => {
        state.loading = false;
        state.PyMode = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPyMode.rejected, (state, action) => {
        state.loading = false;
        state.PyMode = [];
        state.error = action.payload;
      })
      .addCase(createPyMode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPyMode.fulfilled, (state, action) => {
        state.loading = false;
        state.PyMode.push(action.payload); // assuming the payload is the newly created mode
        state.error = null;
      })
      .addCase(createPyMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PyModesSlice.reducer;
