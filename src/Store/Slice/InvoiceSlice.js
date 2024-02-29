import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllInvoices = createAsyncThunk(
  "Invoice/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/invoice/${localStorage.getItem("user")}`,
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
  "Invoice/fetchOne", // Change the action type to fetchOne
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/invoice/${id}/${localStorage.getItem("user")}`,
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
  "Invoice/create",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/Invoice`, customerData, {
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
  "Invoice/delete",
  async (customerId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${url}/Invoice/${customerId}/${localStorage.getItem("user")}`,
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
  "Invoice/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/Invoice/${newData._id}/${localStorage.getItem("user")}`,
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

const invoiceSlice = createSlice({
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

export default invoiceSlice.reducer;
