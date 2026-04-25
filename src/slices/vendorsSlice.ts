/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Vendor, AddVendorForm } from "../types/vendor";
import api from "../utils/api";

interface VendorsState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  selectedVendors: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: VendorsState = {
  vendors: [],
  loading: false,
  error: null,
  selectedVendors: [],
  pagination: null,
};

export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async ({
    search = "",
    page = 1,
    limit = 50,
  }: { search?: string; page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams({
      ...(search && { search }),
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get(`/vendors?${params}`);
    return response.data;
  },
);

export const addVendor = createAsyncThunk(
  "vendors/addVendor",
  async (vendorData: AddVendorForm, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/vendors", vendorData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to add vendor",
      );
    }
  },
);

export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async (vendor: Partial<Vendor> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/v1/vendors/${vendor.id}`, vendor);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update vendor",
      );
    }
  },
);

export const deleteVendors = createAsyncThunk(
  "vendors/deleteVendors",
  async (vendorIds: string[], { rejectWithValue }) => {
    try {
      const promises = vendorIds.map((id) => api.delete(`/v1/vendors/${id}`));
      await Promise.all(promises);
      return vendorIds;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete vendors",
      );
    }
  },
);

const vendorsSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedVendors: (state, action: PayloadAction<string[]>) => {
      state.selectedVendors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.vendors || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.vendors = [];
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.vendors.unshift(action.payload.vendor);
        state.error = null;
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(
          (v) => v.id === action.payload.vendor.id,
        );
        if (index !== -1) state.vendors[index] = action.payload.vendor;
        state.error = null;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteVendors.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter(
          (v) => !action.payload.includes(v.id),
        );
        state.error = null;
      })
      .addCase(deleteVendors.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedVendors } = vendorsSlice.actions;
export default vendorsSlice.reducer;
