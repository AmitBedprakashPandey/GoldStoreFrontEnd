import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("token"),
});

export const fetchAllInvoices = createAsyncThunk(
  "InvoiceWithoutGst/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/invoicewithoutgst/${localStorage.getItem("user")}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOneInvoice = createAsyncThunk(
  "InvoiceWithoutGst/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/invoicewithoutgst/${id}/${localStorage.getItem("user")}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  "InvoiceWithoutGst/create",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/invoicewithoutgst`,
        invoiceData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "InvoiceWithoutGst/delete",
  async (invoiceId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${url}/invoicewithoutgst/${invoiceId}/${localStorage.getItem("user")}`,
        { headers: getAuthHeaders() }
      );
      return invoiceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "InvoiceWithoutGst/update",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/invoicewithoutgst/${updatedData._id}/${localStorage.getItem("user")}`,
        updatedData,
        { headers: getAuthHeaders() }
      );
      
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  invoices: [],
  error: null,
  loading: false,
  message: null,
};

const invoiceWithoutGstSlice = createSlice({
  name: "InvoiceWithoutGst",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Invoices
      .addCase(fetchAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch One Invoice
      .addCase(fetchOneInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        const index = state.invoices.findIndex(
          (invoice) => invoice._id === action.payload._id
        );
        if (index >= 0) {
          state.invoices[index] = action.payload;
        } else {
          state.invoices.push(action.payload);
        }
      })
      .addCase(fetchOneInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        const index = state.invoices.findIndex(
          (invoice) => invoice._id === action.payload._id
        );
        if (index >= 0) {
          state.invoices[index] = action.payload.data;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (invoice) => invoice._id !== action.payload
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceWithoutGstSlice.reducer;
