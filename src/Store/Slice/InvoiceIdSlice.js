import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const createInvoicesId = createAsyncThunk(
  "InvoiceId/create",
  async (BranchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/invoiceid`, BranchData, {
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

export const fetchOneInvoicesNumber = createAsyncThunk(
  "InvoiceId/fetchAll",
  async (id, { rejectWithValue }) => {
    try {


      const response = await axios.get(`${url}/invoiceid/${id}`, {
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

export const UpdateInvoicesNumber = createAsyncThunk(
  "InvoiceId/update",
  async (data, { rejectWithValue }) => {
    try {
        console.log("slice",data);

      const response = await axios.put(`${url}/invoiceid/${data}`,
        {headers: {    
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
  InvoicesNumber: [],
  error: null,
  loading: false,
};

const InvoiceIdSlice = createSlice({
  name: "InvoiceId",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneInvoicesNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneInvoicesNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.InvoicesNumber = action.payload;
        state.error = null;
      })
      .addCase(fetchOneInvoicesNumber.rejected, (state, action) => {
        state.loading = false;
        state.InvoicesNumber = [];
        state.error = action.payload;
      })
      .addCase(createInvoicesId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoicesId.fulfilled, (state, action) => {
        state.loading = false;
        state.InvoicesNumber.push(action.payload); // assuming the payload is the newly created invoiceid
        state.error = null;
      })
      .addCase(createInvoicesId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateInvoicesNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateInvoicesNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.InvoicesNumber = action.payload; // assuming the payload is the newly created invoiceid
        state.error = null;
      })
      .addCase(UpdateInvoicesNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default InvoiceIdSlice.reducer;
