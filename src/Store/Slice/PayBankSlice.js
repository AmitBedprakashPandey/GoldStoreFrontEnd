import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllPyBank = createAsyncThunk(
  "PyBank/All",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/bank/${localStorage.getItem('user')}`, {
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

export const createPyBank = createAsyncThunk(
  "PyBank/create",
  async (PyBankData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/bank`, PyBankData, {
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

export const deletePyBank = createAsyncThunk(
  "PyBank/delete",
  async (PyBankId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/bank/${PyBankId}/${localStorage.getItem('user')}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return response.data; // assuming response contains a success message or the deleted bank ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePyBank = createAsyncThunk(
  "PyBank/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/bank/${newData._id}/${localStorage.getItem('user')}`,
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
  PyBank: [],
  error: null,
  loading: false,
};

const PyBanksSlice = createSlice({
  name: "PyBank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPyBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPyBank.fulfilled, (state, action) => {
        state.loading = false;
        state.PyBank = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPyBank.rejected, (state, action) => {
        state.loading = false;
        state.PyBank = [];
        state.error = action.payload;
      })
      .addCase(createPyBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPyBank.fulfilled, (state, action) => {
        state.loading = false;
        state.PyBank.push(action.payload.data); // assuming the payload is the newly created Bank
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(createPyBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePyBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePyBank.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.PyBank.findIndex(bank => bank._id === action.payload.data._id);
        if (index !== -1) {
          state.PyBank[index] = action.payload.data; // update the specific bank
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updatePyBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePyBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePyBank.fulfilled, (state, action) => {
        state.loading = false;
        state.PyBank = state.PyBank.filter(bank => bank._id !== action.payload.data._id); // assuming payload contains the deleted bank ID
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(deletePyBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PyBanksSlice.reducer;
