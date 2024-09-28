import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllPyMode = createAsyncThunk(
  "PyMode/All",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/mode/${localStorage.getItem("user")}`,
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

export const createPyMode = createAsyncThunk(
  "PyMode/create",
  async (PyModeData, { rejectWithValue }) => {
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
      const response = await axios.delete(
        `${url}/mode/${PyModeId}/${localStorage.getItem("user")}`,
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

export const updatePyMode = createAsyncThunk(
  "PyMode/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/mode/${newData._id}/${localStorage.getItem("user")}`,
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
  message: null,
  loading: false,
};

const PyModesSlice = createSlice({
  name: "PyMode",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.message = null;
      state.error = null;
    }
  },
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
state.message = action.payload.message
        state.PyMode.push(action.payload.data); // assuming the payload is the newly created mode
        state.error = null;
      })
      .addCase(createPyMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePyMode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePyMode.fulfilled, (state, action) => {
        
        const index = state.PyMode.findIndex(
          (payMode) => payMode._id  === action.payload.data._id
        ); // remove the branch from the state
        if(index !== -1 ){
          state.PyMode[index] = action.payload.data
        }
        
        state.loading = false;
        state.message = action.payload.message
        state.error = null;
      })
      .addCase(updatePyMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePyMode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePyMode.fulfilled, (state, action) => {
        
        state.PyMode = state.PyMode.filter(
          (branch) => branch._id !== action.payload.data._id
        ); // remove the branch from the state
        state.loading = false;
        state.message = action.payload.message
        state.error = null;
      })
      .addCase(deletePyMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearNotifications } = PyModesSlice.actions;
export default PyModesSlice.reducer;
