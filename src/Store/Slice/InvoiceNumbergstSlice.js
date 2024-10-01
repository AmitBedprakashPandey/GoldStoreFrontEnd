import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const createInvoicesId = createAsyncThunk(
  "invoicegst/create",
  async (BranchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/invoicegst`, BranchData, {
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

export const fetchOneInvoiceNumberGst = createAsyncThunk(
  "invoicegst/fetchAll",
  async (id, { rejectWithValue }) => {
    try {


      const response = await axios.get(`${url}/invoicegst/${localStorage.getItem("companyid")}`, {
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

export const UpdateInvoiceNumberGst = createAsyncThunk(
  "invoicegst/update",
  async (data, { rejectWithValue }) => {
    try {
        console.log("slice",data);

      const response = await axios.put(`${url}/invoicegst/${data}`,
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
  InvoiceNumberGst: [],
  error: null,
  message : null,
  loading: false,
};

const invoicegstSlice = createSlice({
  name: "invoicegst",
  initialState,
  reducers: {
    clearNotification(state) {
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneInvoiceNumberGst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOneInvoiceNumberGst.fulfilled, (state, action) => {
        state.loading = false;
        state.InvoiceNumberGst = action.payload;
        state.error = null;
      })
      .addCase(fetchOneInvoiceNumberGst.rejected, (state, action) => {
        state.loading = false;
        state.InvoiceNumberGst = [];
        state.error = action.payload;
      })
      .addCase(createInvoicesId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoicesId.fulfilled, (state, action) => {
        state.InvoiceNumberGst.push(action.payload.data); // assuming the payload is the newly created invoicegst
        state.loading = false;
        state.message = action.payload.message
        state.error = null;
      })
      .addCase(createInvoicesId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateInvoiceNumberGst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateInvoiceNumberGst.fulfilled, (state, action) => {
        state.loading = false;
        state.InvoiceNumberGst = action.payload; // assuming the payload is the newly created invoicegst
        
        state.error = null;
      })
      .addCase(UpdateInvoiceNumberGst.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoicegstSlice.reducer;
