import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllInvoices = createAsyncThunk(
  "InvoiceWitoutGst/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/invoicewithoutgst/${localStorage.getItem("user")}`,
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

export const fetchOneInvoices = createAsyncThunk(
  "InvoiceWitoutGst/fetchOne", // Change the action type to fetchOne
  async (id, { rejectWithValue }) => {
    console.log(id);
    try {
      const response = await axios.get(
        `${url}/invoicewithoutgst/${id}/${localStorage.getItem("user")}`,
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

export const createInvoice = createAsyncThunk(
  "InvoiceWitoutGst/create",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/invoicewithoutgst`, customerData, {
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

export const deleteInvoice = createAsyncThunk(
  "InvoiceWitoutGst/delete",
  async (customerId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${url}/invoicewithoutgst/${customerId}/${localStorage.getItem("user")}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return customerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "InvoiceWitoutGst/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/invoicewithoutgst/${newData._id}/${localStorage.getItem("user")}`,
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
  Invoice: [],
  error: null,
  loading: false,
  message: null,
};

const invoiceWitoutGstSlice = createSlice({
  name: "Invoice",
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
        state.Invoice = action.payload;
        state.error = null;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOneInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.Invoice = action.payload;
        state.error = null;
      })
      .addCase(fetchOneInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.Invoice = action.payload; // assuming the payload is the newly created customer
        state.error = null;
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

        state.error = null;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceWitoutGstSlice.reducer;
