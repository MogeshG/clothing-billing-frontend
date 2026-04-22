 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  StockAdjustment,
  StockAdjustmentsState,
  BatchForAdjustment,
} from "../types/stockAdjustment";

interface StockAdjustmentsStateExtended extends StockAdjustmentsState {
  batches: BatchForAdjustment[];
  creating: boolean;
}

const initialState: StockAdjustmentsStateExtended = {
  adjustments: [],
  batches: [],
  loading: false,
  creating: false,
  error: null,
};

// Mock data
const mockAdjustments: StockAdjustment[] = [
  {
    id: "adj1",
    productVariantId: "pv1",
    productName: "T-Shirt Cotton M Blue",
    batchNo: "B001",
    type: "-",
    quantity: 5,
    reason: "Damaged",
    createdBy: "admin",
    createdAt: "2024-10-04T16:20:00Z",
  },
  {
    id: "adj2",
    productVariantId: "pv2",
    productName: "Jeans 32 Black",
    batchNo: "B002",
    type: "+",
    quantity: 10,
    reason: "Stock count mismatch",
    createdBy: "manager",
    createdAt: "2024-10-05T10:30:00Z",
  },
];

const mockBatches: BatchForAdjustment[] = [
  {
    id: "b1",
    batchNo: "B001",
    productName: "T-Shirt Cotton M Blue",
    variantSku: "TS001-M-BLUE",
    remainingQuantity: 60,
    expiryDate: "2025-01-01",
    status: "ACTIVE",
  },
  {
    id: "b2",
    batchNo: "B002",
    productName: "Jeans 32 Black",
    variantSku: "J001-32-BLACK",
    remainingQuantity: 45,
    status: "ACTIVE",
  },
  {
    id: "b3",
    batchNo: "B003",
    productName: "T-Shirt Cotton M Blue",
    variantSku: "TS001-M-BLUE",
    remainingQuantity: 20,
    expiryDate: "2024-11-01",
    status: "EXPIRED",
  },
];

export const fetchStockAdjustments = createAsyncThunk(
  "stockAdjustments/fetchStockAdjustments",
  async (): Promise<StockAdjustment[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdjustments), 500),
    );
  },
);

export const fetchBatchesForAdjustment = createAsyncThunk(
  "stockAdjustments/fetchBatchesForAdjustment",
  async (): Promise<BatchForAdjustment[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockBatches), 300),
    );
  },
);

export const createStockAdjustment = createAsyncThunk(
  "stockAdjustments/createStockAdjustment",
  async (
    adjustment: Omit<StockAdjustment, "id" | "createdAt">,
  ): Promise<StockAdjustment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAdjustment: StockAdjustment = {
          id: Math.random().toString(36).substr(2, 9),
          ...adjustment,
          createdAt: new Date().toISOString(),
        };
        mockAdjustments.unshift(newAdjustment);
        resolve(newAdjustment);
      }, 1000);
    });
  },
);

const stockAdjustmentsSlice = createSlice({
  name: "stockAdjustments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch adjustments
      .addCase(fetchStockAdjustments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockAdjustments.fulfilled, (state, action) => {
        state.loading = false;
        state.adjustments = action.payload;
      })
      .addCase(fetchStockAdjustments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch adjustments";
      })
      // Fetch batches
      .addCase(fetchBatchesForAdjustment.fulfilled, (state, action) => {
        state.batches = action.payload;
      })
      // Create adjustment
      .addCase(createStockAdjustment.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createStockAdjustment.fulfilled, (state, action) => {
        state.creating = false;
        state.adjustments.unshift(action.payload);
      })
      .addCase(createStockAdjustment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || "Failed to create adjustment";
      });
  },
});

export const { clearError } = stockAdjustmentsSlice.actions;
export default stockAdjustmentsSlice.reducer;
