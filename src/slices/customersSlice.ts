import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Customer } from "../types/customer";
import api from "../utils/api";
import { snakeToCamel } from "../utils/caseConvert";

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
    const response = await api.get("/customers");
    return snakeToCamel(response.data) as Customer[];
  },
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">,
    { rejectWithValue },
  ) => {
    try {
      await api.post("/customers", customer);
      const response = await api.get("/customers");
      return snakeToCamel(response.data) as Customer[];
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to add customer");
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (customer: Customer, { rejectWithValue }) => {
    try {
      await api.put(`/customers/${customer.id}`, customer);
      const response = await api.get("/customers");
      return response.data as Customer[];
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to update customer");
    }
  },
);

export const deleteCustomers = createAsyncThunk(
  "customers/deleteCustomers",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const promises = ids.map((id) => api.delete(`/customers/${id}`));
      await Promise.all(promises);
      return ids;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to delete customers");
    }
  },
);

export const bulkCreateCustomers = createAsyncThunk(
  "customers/bulkCreateCustomers",
  async (
    _customers: Omit<Customer, "id" | "createdAt" | "updatedAt">[],
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/customers");
      return snakeToCamel(response.data) as Customer[];
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to bulk create customers");
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
