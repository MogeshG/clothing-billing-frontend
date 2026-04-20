import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Batch } from "../types/batch";

interface BatchesState {
  batches: Batch[];
  loading: boolean;
  error: string | null;
}

const initialState: BatchesState = {
  batches: [],
  loading: false,
  error: null,
};

export const mockBatches: Batch[] = [
  {
    id: "b1",
    productVariantId: "v1",
    productName: "Cotton T-Shirt",
    variantSku: "TSHIRT-001-BLK-M",
    mrp: "499",
    barcode: "2342342342300",
    hsnCode: "6109",
    batchNo: "BATCH-001",
    status: "PENDING",
    purchaseItemId: "PI1",
    purchaseNo: "PUR-0001",
    vendorName: "RK Traders",
    purchaseDate: "2026-04-01T10:00:00.000Z",
    purchasePrice: 200,
    sellingPrice: 399,
    cgstPercent: 9,
    sgstPercent: 9,
    igstPercent: 0,
    quantity: 10,
    remainingQuantity: 10,
    manufactureDate: "2026-03-15T00:00:00.000Z",
    expiryDate: "2027-03-15T00:00:00.000Z",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "b2",
    productVariantId: "v3",
    productName: "Denim Jeans",
    barcode: "2342342342300",
    variantSku: "JEANS-101-BLU-32",
    mrp: "1299",
    hsnCode: "6203",
    batchNo: "BATCH-002",
    status: "ACTIVE",
    purchaseItemId: "PI2",
    purchaseNo: "PUR-0002",
    vendorName: "Patel Distributors",
    purchaseDate: "2026-04-02T11:00:00.000Z",
    purchasePrice: 700,
    sellingPrice: 1299,
    cgstPercent: 9,
    sgstPercent: 9,
    igstPercent: 0,
    quantity: 8,
    remainingQuantity: 6,
    manufactureDate: "2026-03-20T00:00:00.000Z",
    expiryDate: "2027-03-20T00:00:00.000Z",
    createdAt: "2026-04-02T11:00:00.000Z",
    updatedAt: "2026-04-03T09:00:00.000Z",
  },
];

export const fetchBatches = createAsyncThunk("batches/fetchBatches", async () => {
  return new Promise<Batch[]>((resolve) => {
    setTimeout(() => resolve(mockBatches), 500);
  });
});

export const updateBatch = createAsyncThunk(
  "batches/updateBatch",
  async (batchData: Partial<Batch> & { id: string }, { rejectWithValue }) => {
    try {
      // Mock update - only allow price/sellingPrice changes for PENDING status
      const index = mockBatches.findIndex((b) => b.id === batchData.id);
      if (index === -1) {
        return rejectWithValue("Batch not found");
      }

      if (mockBatches[index].status !== "PENDING") {
        return rejectWithValue("Can only edit PENDING batches");
      }

      mockBatches[index] = {
        ...mockBatches[index],
        ...batchData,
        updatedAt: new Date().toISOString(),
      };

      return mockBatches[index];
    } catch (error) {
      console.error("Error updating batch:", error);
      return rejectWithValue("Failed to update batch");
    }
  },
);

export const blockBatch = createAsyncThunk(
  "batches/blockBatch",
  async (batchId: string, { rejectWithValue }) => {
    try {
      const index = mockBatches.findIndex((b) => b.id === batchId);
      if (index === -1) {
        return rejectWithValue("Batch not found");
      }

      if (mockBatches[index].status !== "ACTIVE") {
        return rejectWithValue("Can only block ACTIVE batches");
      }

      mockBatches[index].status = "BLOCKED";
      mockBatches[index].updatedAt = new Date().toISOString();

      return mockBatches[index];
    } catch (error) {
      console.error("Error blocking batch:", error);
      return rejectWithValue("Failed to block batch");
    }
  },
);

const batchesSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        const index = state.batches.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.batches[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(blockBatch.fulfilled, (state, action) => {
        const index = state.batches.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.batches[index] = action.payload;
        }
        state.error = null;
      });
  },
});

export const { clearError } = batchesSlice.actions;
export default batchesSlice.reducer;
