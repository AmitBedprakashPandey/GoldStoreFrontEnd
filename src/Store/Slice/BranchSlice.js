import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllBranch = createAsyncThunk(
  "Branch/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/branch/${localStorage.getItem("user")}`,
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
      const response = await axios.delete(`${url}/branch/${BranchId}`, {
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
  message: null,
  loading: false,
};

const BranchsSlice = createSlice({
  name: "Branch",
  initialState,
  reducers: {
    clearNotification(state) {
      state.message = null;
      state.error = null;
    },
  },
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
        state.Branch.push(action.payload.data); // assuming the payload is the newly created branch
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.Branch.findIndex(
          (branch) => branch._id === action.payload.data._id
        );
        if (index !== -1) {
          state.Branch[index] = action.payload.data; //  update the branch in the state
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.Branch = state.Branch.filter(
          (branch) => branch._id !== action.payload.data._id
        );
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearNotification } = BranchsSlice.actions;
export default BranchsSlice.reducer;
