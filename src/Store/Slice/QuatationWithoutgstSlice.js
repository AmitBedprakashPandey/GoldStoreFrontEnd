import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllQuotationWithoutgsts = createAsyncThunk(
  "QuotationWithoutgstWitoutGst/fetchAll",
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

export const fetchOneQuotationWithoutgsts = createAsyncThunk(
  "QuotationWithoutgstWitoutGst/fetchOne", // Change the action type to fetchOne
  async (id, { rejectWithValue }) => {
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

export const createQuotationWithoutgst = createAsyncThunk(
  "QuotationWithoutgstWitoutGst/create",
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

export const deleteQuotationWithoutgst = createAsyncThunk(
  "QuotationWithoutgstWitoutGst/delete",
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

export const updateQuotationWithoutgst = createAsyncThunk(
  "QuotationWithoutgstWitoutGst/update",
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
  QuotationWithoutgst: [],
  error: null,
  loading: false,
  message: null,
};

const invoiceWitoutGstSlice = createSlice({
  name: "QuotationWithoutgst",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQuotationWithoutgsts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuotationWithoutgsts.fulfilled, (state, action) => {
        state.loading = false;
        state.QuotationWithoutgst = action.payload;
        state.error = null;
      })
      .addCase(fetchAllQuotationWithoutgsts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOneQuotationWithoutgsts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneQuotationWithoutgsts.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.QuotationWithoutgst = action.payload;
        state.error = null;
      })
      .addCase(fetchOneQuotationWithoutgsts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createQuotationWithoutgst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuotationWithoutgst.fulfilled, (state, action) => {
        state.loading = false;
        state.QuotationWithoutgst = action.payload; // assuming the payload is the newly created customer
        state.error = null;
      })
      .addCase(createQuotationWithoutgst.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuotationWithoutgst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotationWithoutgst.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        state.error = null;
      })
      .addCase(updateQuotationWithoutgst.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceWitoutGstSlice.reducer;
