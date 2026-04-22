 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { StockMovement } from "../types/stockMovement";

interface StockMovementsState {
  stockMovements: StockMovement[];
  loading: boolean;
  error: string | null;
}

const initialState: StockMovementsState = {
  stockMovements: [],
  loading: false,
  error: null,
};

// Mock data - comprehensive sample for testing
const mockStockMovements: StockMovement[] = [
  {
    id: "sm1",
    productVariantId: "pv1",
    productName: "T-Shirt Cotton",
    sku: "TS001",
    variantSku: "TS001-M-BLUE",
    type: "IN",
    quantity: 100,
    invoiceItemId: null,
    purchaseItemId: "pi1",
    purchaseNo: "P001",
    createdAt: "2024-10-01T10:00:00Z",
    items: [
      {
        id: "smi1",
        stockMovementId: "sm1",
        batchId: "b1",
        batchNo: "B001",
        quantity: 100,
      },
    ],
  },
  {
    id: "sm2",
    productVariantId: "pv1",
    productName: "T-Shirt Cotton",
    sku: "TS001",
    variantSku: "TS001-M-BLUE",
    type: "OUT",
    quantity: 25,
    invoiceItemId: "ii1",
    invoiceNo: "INV001",
    createdAt: "2024-10-02T14:30:00Z",
    items: [
      {
        id: "smi2",
        stockMovementId: "sm2",
        batchId: "b1",
        batchNo: "B001",
        quantity: 25,
      },
    ],
  },
  {
    id: "sm3",
    productVariantId: "pv1",
    productName: "T-Shirt Cotton",
    sku: "TS001",
    variantSku: "TS001-M-BLUE",
    type: "OUT",
    quantity: 15,
    invoiceItemId: "ii2",
    invoiceNo: "INV002",
    createdAt: "2024-10-03T09:15:00Z",
    items: [
      {
        id: "smi3",
        stockMovementId: "sm3",
        batchId: "b1",
        batchNo: "B001",
        quantity: 15,
      },
    ],
  },
  {
    id: "sm4",
    productVariantId: "pv2",
    productName: "Jeans Denim",
    sku: "J001",
    variantSku: "J001-32-BLACK",
    type: "IN",
    quantity: 50,
    purchaseNo: "P002",
    createdAt: "2024-10-01T11:00:00Z",
    items: [
      {
        id: "smi4",
        stockMovementId: "sm4",
        batchId: "b2",
        batchNo: "B002",
        quantity: 30,
      },
      {
        id: "smi5",
        stockMovementId: "sm4",
        batchId: "b3",
        batchNo: "B003",
        quantity: 20,
      },
    ],
  },
  {
    id: "sm5",
    productVariantId: "pv2",
    productName: "Jeans Denim",
    sku: "J001",
    variantSku: "J001-32-BLACK",
    type: "ADJUSTMENT",
    quantity: -5,
    batchNo: "B002",
    createdAt: "2024-10-04T16:20:00Z",
    items: [
      {
        id: "smi6",
        stockMovementId: "sm5",
        batchId: "b2",
        batchNo: "B002",
        quantity: 5,
      },
    ],
  },
  // Add more for realistic data...
  {
    id: "sm6",
    productVariantId: "pv3",
    productName: "Shirt Formal",
    sku: "SH001",
    variantSku: "SH001-L-WHITE",
    type: "IN",
    quantity: 30,
    purchaseNo: "P003",
    createdAt: "2024-10-05T12:00:00Z",
    items: [
      {
        id: "smi7",
        stockMovementId: "sm6",
        batchId: "b4",
        batchNo: "B004",
        quantity: 30,
      },
    ],
  },
  {
    id: "sm7",
    productVariantId: "pv3",
    productName: "Shirt Formal",
    sku: "SH001",
    variantSku: "SH001-L-WHITE",
    type: "OUT",
    quantity: 8,
    invoiceNo: "INV003",
    createdAt: "2024-10-06T10:45:00Z",
    items: [
      {
        id: "smi8",
        stockMovementId: "sm7",
        batchId: "b4",
        batchNo: "B004",
        quantity: 8,
      },
    ],
  },
];

export const fetchStockMovements = createAsyncThunk(
  "stockMovements/fetchStockMovements",
  async (): Promise<StockMovement[]> => {
    return new Promise<StockMovement[]>((resolve) => {
      setTimeout(() => resolve(mockStockMovements), 500);
    });
  },
);

const stockMovementsSlice = createSlice({
  name: "stockMovements",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.stockMovements = action.payload;
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch stock movements";
      });
  },
});

export const { clearError } = stockMovementsSlice.actions;
export default stockMovementsSlice.reducer;
