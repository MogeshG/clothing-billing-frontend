import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Customer } from "../types/customer";
import axios from "axios";
import { API_BASE } from "../utils/auth";

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  selectedCustomers: Customer[];
}

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
  selectedCustomers: [],
};

// Thunks
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    const response = await axios.get("/v1/customers", { baseURL: API_BASE });
    return response.data as Customer[];
  },
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
    { rejectWithValue },
  ) => {
    try {
      await axios.post("/v1/customers", customer, {
        baseURL: API_BASE,
      });
      const response = await axios.get("/v1/customers", { baseURL: API_BASE });
      return response.data as Customer[];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to add customer",
      );
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (customer: Customer, { rejectWithValue }) => {
    try {
      await axios.put(`/v1/customers/${customer.id}`, customer, {
        baseURL: API_BASE,
      });
      const response = await axios.get("/v1/customers", { baseURL: API_BASE });
      return response.data as Customer[];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update customer",
      );
    }
  },
);

export const deleteCustomers = createAsyncThunk(
  "customers/deleteCustomers",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const promises = ids.map((id) =>
        axios.delete(`/v1/customers/${id}`, { baseURL: API_BASE }),
      );
      await Promise.all(promises);
      return ids;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete customers",
      );
    }
  },
);

export const bulkCreateCustomers = createAsyncThunk(
  "customers/bulkCreateCustomers",
  async (
    customers: Omit<Customer, "id" | "createdAt" | "updatedAt">[],
    { rejectWithValue },
  ) => {
    try {
      // const newCustomers = await Promise.all(
      //   customers.map((c) =>
      //     axios
      //       .post("/v1/customers", c, { baseURL: API_BASE })
      //       .then((res) => res.data as Customer),
      //   ),
      // );
      const response = await axios.get("/v1/customers", { baseURL: API_BASE });
      return response.data as Customer[];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to bulk create customers",
      );
    }
  },
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setSelectedCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.selectedCustomers = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch customers";
      })
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers = action.payload;
        state.loading = false;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bulkCreateCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
        state.loading = false;
      })
      .addCase(bulkCreateCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to bulk create customers";
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customers = action.payload;
        state.loading = false;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomers.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (c) => !action.payload.includes(c.id),
        );
        state.selectedCustomers = [];
        state.loading = false;
      })
      .addCase(deleteCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCustomers, clearError } = customersSlice.actions;
export default customersSlice.reducer;
