import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Vendor, AddVendorForm } from "../types/vendor";

interface VendorsState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  selectedVendors: string[];
}

const initialState: VendorsState = {
  vendors: [],
  loading: false,
  error: null,
  selectedVendors: [],
};

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Ravi Kumar",
    phone: "9876543210",
    email: "ravi.kumar@gmail.com",
    address: "12, T Nagar",
    gstin: "33ABCDE1234F1Z5",
    companyName: "RK Traders",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Suresh Patel",
    phone: "9123456780",
    email: "suresh.patel@gmail.com",
    address: "MG Road",
    gstin: "27ABCDE5678K1Z2",
    companyName: "Patel Distributors",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Anita Sharma",
    phone: "9988776655",
    email: "anita.sharma@gmail.com",
    address: "Sector 18",
    gstin: "07ABCDE4321L1Z9",
    companyName: "Sharma Supplies",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Mohammed Ali",
    phone: "9090909090",
    email: "ali.mohd@gmail.com",
    address: "Charminar Area",
    gstin: "36ABCDE1111Q1Z7",
    companyName: "Ali Traders",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Karthik R",
    phone: "9000011111",
    email: "karthik.r@gmail.com",
    address: "Velachery",
    gstin: "33ABCDE9999R1Z3",
    companyName: "Karthik Enterprises",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Priya Mehta",
    phone: "8888888888",
    email: "priya.mehta@gmail.com",
    address: "Navrangpura",
    gstin: "24ABCDE2222S1Z6",
    companyName: "Mehta Suppliers",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Vikram Singh",
    phone: "9777777777",
    email: "vikram.singh@gmail.com",
    address: "Banjara Hills",
    gstin: "36ABCDE3333T1Z4",
    companyName: "Singh Distributors",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Lakshmi Narayan",
    phone: "9666666666",
    email: "lakshmi.n@gmail.com",
    address: "Jayanagar",
    gstin: "29ABCDE4444U1Z8",
    companyName: "Lakshmi Traders",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Rahul Das",
    phone: "9555555555",
    email: "rahul.das@gmail.com",
    address: "Salt Lake",
    gstin: "19ABCDE5555V1Z1",
    companyName: "Das & Co",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Arjun Nair",
    phone: "9444444444",
    email: "arjun.nair@gmail.com",
    address: "Kakkanad",
    gstin: "32ABCDE6666W1Z0",
    companyName: "Nair Distributors",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async () => {
    return new Promise<Vendor[]>((resolve) => {
      setTimeout(() => resolve(mockVendors), 500);
    });
  },
);

export const addVendor = createAsyncThunk(
  "vendors/addVendor",
  async (vendorData: AddVendorForm, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) throw new Error("Failed to add");
      return await response.json();
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to add vendor");
    }
  },
);

export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async (vendor: Partial<Vendor> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });
      if (!response.ok) throw new Error("Failed to update");
      return await response.json();
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to update vendor");
    }
  },
);

export const deleteVendors = createAsyncThunk(
  "vendors/deleteVendors",
  async (vendorIds: string[], { rejectWithValue }) => {
    try {
      const promises = vendorIds.map((id) =>
        fetch(`/api/vendors/${id}`, { method: "DELETE" }),
      );
      const responses = await Promise.all(promises);
      if (responses.some((r) => !r.ok)) throw new Error("Failed to delete");
      return vendorIds;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to delete vendors");
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
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.vendors.unshift(action.payload);
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(
          (v) => v.id === action.payload.id,
        );
        if (index !== -1) state.vendors[index] = action.payload;
        state.error = null;
      })
      .addCase(deleteVendors.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter(
          (v) => !action.payload.includes(v.id),
        );
        state.error = null;
      });
  },
});

export const { clearError, setSelectedVendors } = vendorsSlice.actions;
export default vendorsSlice.reducer;
