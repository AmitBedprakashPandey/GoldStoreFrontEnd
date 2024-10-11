import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.React_APP_API_URL;

export const fetchAllCustomers = createAsyncThunk(
  "Customer/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/customer/${localStorage.getItem("user")}`,
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
  message: null,
};

const customersSlice = createSlice({
  name: "Customer",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.message = null;
      state.error = null;
    },
  },
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
        state.Customer.push(action.payload?.data); // assuming the payload is the newly created customer
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.Customer.findIndex(
          (customer) => customer._id === action.payload?.data?._id
        );
        if (index !== -1) {
          state.Customer[index] = action.payload?.data  ; // update the customer in the state
        }
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        
        state.Customer = state.Customer.filter(
          (customer) => customer._id !== action.payload.data._id
        ); // remove the customer from the state
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearNotifications } = customersSlice.actions;
export default customersSlice.reducer;
