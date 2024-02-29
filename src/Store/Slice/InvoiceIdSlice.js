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

export const fetchOneInvoicesId = createAsyncThunk(
  "InvoiceId/fetchAll",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/invoiceid/${localStorage.getItem('user')}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return response.data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInvoicesId = createAsyncThunk(
  "InvoiceId/update",
  async (data, { rejectWithValue }) => {

    try {
      const response = await axios.put(
        `${url}/invoiceid/${data}/${localStorage.getItem('user')}`,       
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
  invoiceId: [],
  error: null,
  loading: false,
};

const InvoiceIdSlice = createSlice({
  name: "InvoiceId",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneInvoicesId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneInvoicesId.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceId = action.payload;
        state.error = null;
      })
      .addCase(fetchOneInvoicesId.rejected, (state, action) => {
        state.loading = false;
        state.invoiceId = [];
        state.error = action.payload;
      })
      .addCase(createInvoicesId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoicesId.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceId.push(action.payload); // assuming the payload is the newly created invoiceid
        state.error = null;
      })
      .addCase(createInvoicesId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInvoicesId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoicesId.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceId = action.payload; // assuming the payload is the newly created invoiceid
        state.error = null;
      })
      .addCase(updateInvoicesId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default InvoiceIdSlice.reducer;
