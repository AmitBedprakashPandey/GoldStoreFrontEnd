import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllCustomers = createAsyncThunk(
  "Customer/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/customer/${localStorage.getItem('user')}`, {
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

export const createCustomer = createAsyncThunk(
  "Customer/create",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/customer`, customerData, {
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

export const deleteCustomer = createAsyncThunk(
  "Customer/delete",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/customer/${customerId}`, {
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

export const updateCustomer = createAsyncThunk(
  "Customer/update",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${url}/customer/${newData._id}`,
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
  Customer: [],
  error: null,
  loading: false,
};

const customersSlice = createSlice({
  name: "Customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.Customer = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.Customer = [];
        state.error = action.payload;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.Customer.push(action.payload); // assuming the payload is the newly created customer
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customersSlice.reducer;
