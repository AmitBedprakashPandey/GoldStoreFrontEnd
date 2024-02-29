import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllBranch = createAsyncThunk(
  "Branch/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/branch/${localStorage.getItem('user')}`, {
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

export const createBranch = createAsyncThunk(
  "Branch/create",
  async (BranchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/branch`, BranchData, {
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

export const deleteBranch = createAsyncThunk(
  "Branch/delete",
  async (BranchId, { rejectWithValue }) => {
    try {
   const response =    await axios.delete(`${url}/branch/${BranchId}`, {
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

export const updateBranch = createAsyncThunk(
  "Branch/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/branch/${newData._id}`,
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
  Branch: [],
  error: null,
  loading: false,
};

const BranchsSlice = createSlice({
  name: "Branch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.Branch = action.payload;
        state.error = null;
      })
      .addCase(fetchAllBranch.rejected, (state, action) => {
        state.loading = false;
        state.Branch = [];
        state.error = action.payload;
      })
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.Branch.push(action.payload); // assuming the payload is the newly created branch
        state.error = null;
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default BranchsSlice.reducer;
