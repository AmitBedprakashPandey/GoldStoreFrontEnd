import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.React_APP_API_URL;
const getToken = () => localStorage.getItem("token");
const getUser = () => localStorage.getItem("user");

const createHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: getToken(),
});

export const fetchAllInvoices = createAsyncThunk(
  "invoice/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/invoice/${getUser()}`, {
        headers: createHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOneInvoice = createAsyncThunk(
  "invoice/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/invoice/${id}/${getUser()}`,
        { headers: createHeaders() }
      );
      console.log("get",response.data.data);
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  "invoice/create",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/invoice`, invoiceData, {
        headers: createHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoice/delete",
  async (invoiceId, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/invoice/${invoiceId}/${getUser()}`, {
        headers: createHeaders(),
      });
      return invoiceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "invoice/update",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/invoice/${invoiceData._id}/${getUser()}`,
        invoiceData,
        { headers: createHeaders() }
      );
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  Invoices: [],
  error: null,
  loading: false,
  message: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.Invoices = action.payload;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOneInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        // Find the invoice based on the `quote` field
        const index = state.Invoices.findIndex(
          (invoice) => invoice.quot === action.payload.quot
        );

        // Update the invoice if found, or add it if not found
        if (index !== -1) {
          state.Invoices[index] = action.payload;
        } else {
          state.Invoices.push(action.payload);
        }
      })
      .addCase(fetchOneInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.Invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        const index = state.Invoices.findIndex(
          (invoice) => invoice._id === action.payload._id
        );

        if (index >= 0) {
          state.Invoices[index] = action.payload.data;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.Invoices = state.Invoices.filter(
          (invoice) => invoice._id !== action.payload
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceSlice.reducer;
