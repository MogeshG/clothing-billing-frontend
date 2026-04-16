import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Customer } from "../types/customer";

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

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    address: "123 Main St",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "0987654321",
    email: "jane@example.com",
    address: "456 Oak Ave",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more mock data...
  {
    id: "3",
    name: "Bob Johnson",
    phone: "1122334455",
    email: undefined,
    address: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Alice Brown",
    phone: "5566778899",
    email: "alice@example.com",
    address: "789 Pine Rd",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Charlie Wilson",
    phone: "0011223344",
    email: undefined,
    address: "101 Elm St",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Charlie Wilson",
    phone: "0011223344",
    email: undefined,
    address: "101 Elm St",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Charlie Wilson",
    phone: "0011223344",
    email: undefined,
    address: "101 Elm St",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Charlie Wilson",
    phone: "0011223344",
    email: undefined,
    address: "101 Elm St",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Charlie Wilson",
    phone: "0011223344",
    email: undefined,
    address: "101 Elm St",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Thunks
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    return new Promise<Customer[]>((resolve) => {
      setTimeout(() => resolve(mockCustomers), 500);
    });
  },
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => {
    return new Promise<Customer>((resolve) => {
      setTimeout(() => {
        const newCustomer: Customer = {
          id: Math.random().toString(36).substr(2, 9),
          ...customer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockCustomers.push(newCustomer);
        resolve(newCustomer);
      }, 500);
    });
  },
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (customer: Customer) => {
    return new Promise<Customer>((resolve) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex((c) => c.id === customer.id);
        if (index !== -1) {
          mockCustomers[index] = {
            ...customer,
            updatedAt: new Date().toISOString(),
          };
        }
        resolve(customer);
      }, 500);
    });
  },
);

export const deleteCustomers = createAsyncThunk(
  "customers/deleteCustomers",
  async (ids: string[]) => {
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        for (const id of ids) {
          const index = mockCustomers.findIndex((c) => c.id === id);
          if (index !== -1) {
            mockCustomers.splice(index, 1);
          }
        }
        resolve(ids);
      }, 500);
    });
  },
);

export const bulkCreateCustomers = createAsyncThunk(
  "customers/bulkCreateCustomers",
  async (customers: Omit<Customer, "id" | "createdAt" | "updatedAt">[]) => {
    return new Promise<Customer[]>((resolve) => {
      setTimeout(() => {
        const newCustomers = customers.map((customer) => ({
          id: Math.random().toString(36).substr(2, 9),
          ...customer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        mockCustomers.push(...newCustomers);
        resolve(newCustomers);
      }, 500);
    });
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
        state.error = action.error.message || "Failed to fetch customers";
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
        state.loading = false;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteCustomers.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (c) => !action.payload.includes(c.id),
        );
        state.selectedCustomers = [];
        state.loading = false;
      });
  },
});

export const { setSelectedCustomers, clearError } = customersSlice.actions;
export default customersSlice.reducer;
