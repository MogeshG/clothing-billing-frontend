/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

import type { Batch, Inventory } from "../types/inventory";

interface InventoryState {
  inventory: Inventory[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  inventory: [],
  loading: false,
  error: null,
};

// Mock data based on schema.prisma Batches model
const mockInventory: Inventory[] = [
  {
    id: "1",
    productVariantId: "pv1",
    batchNo: "B001",
    purchasePrice: 100,
    sellingPrice: 150,
    quantity: 100,
    remainingQuantity: 85,
    manufactureDate: "2024-01-01",
    expiryDate: "2025-01-01",
    supplierName: "Supplier A",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: {
      id: "p1",
      name: "T-Shirt Cotton",
      sku: "TS001",
      description: "Cotton T-Shirt",
      categoryId: "cat1",
      brand: "BrandX",
      barcode: "123456789",
      basePrice: 120,
      costPrice: 100,
      mrp: 150,
      gstPercent: 5,
      taxInclusive: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    variant: {
      id: "pv1",
      productId: "p1",
      size: "M",
      color: "Blue",
      sku: "TS001-M-BLUE",
      price: 150,
      costPrice: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  // Add more mock data...
  {
    id: "2",
    productVariantId: "pv2",
    batchNo: "B002",
    purchasePrice: 200,
    sellingPrice: 300,
    quantity: 50,
    remainingQuantity: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: {
      id: "p2",
      name: "Jeans",
      sku: "J001",
      description: "Denim Jeans",
      categoryId: "cat2",
      brand: "DenimCo",
      barcode: "987654321",
      basePrice: 250,
      costPrice: 200,
      mrp: 300,
      gstPercent: 12,
      taxInclusive: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    variant: {
      id: "pv2",
      productId: "p2",
      size: "32",
      color: "Black",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

// Thunks
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (): Promise<Inventory[]> => {
    return new Promise<Inventory[]>((resolve) => {
      setTimeout(() => resolve(mockInventory), 500);
    });
  },
);

export const createBatch = createAsyncThunk(
  "inventory/createBatch",
  async (batch: Omit<Batch, "id" | "createdAt" | "updatedAt">) => {
    return new Promise<Batch>((resolve) => {
      setTimeout(() => {
        const newBatch: Batch = {
          id: Math.random().toString(36).substr(2, 9),
          ...batch,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          remainingQuantity: batch.quantity,
        };
        mockInventory.push(newBatch as Inventory);
        resolve(newBatch);
      }, 500);
    });
  },
);

export const updateBatch = createAsyncThunk(
  "inventory/updateBatch",
  async (batch: Batch) => {
    return new Promise<Batch>((resolve) => {
      setTimeout(() => {
        const index = mockInventory.findIndex((b: any) => b.id === batch.id);
        if (index !== -1) {
          mockInventory[index] = {
            ...batch,
            updatedAt: new Date().toISOString(),
          } as Inventory;
        }
        resolve(mockInventory[index]);
      }, 500);
    });
  },
);

export const deleteBatch = createAsyncThunk(
  "inventory/deleteBatch",
  async (id: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const index = mockInventory.findIndex((b: any) => b.id === id);
        if (index !== -1) {
          mockInventory.splice(index, 1);
        }
        resolve(id);
      }, 500);
    });
  },
);

export const updateBatchStock = createAsyncThunk(
  "inventory/updateBatchStock",
  async ({ id, quantity }: { id: string; quantity: number }) => {
    return new Promise<Batch>((resolve) => {
      setTimeout(() => {
        const index = mockInventory.findIndex((b: any) => b.id === id);
        if (index !== -1) {
          mockInventory[index].remainingQuantity = quantity;
          mockInventory[index].updatedAt = new Date().toISOString();
        }
        resolve(mockInventory[index]);
      }, 500);
    });
  },
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch inventory";
      })
      .addCase(updateBatchStock.fulfilled, (state, action) => {
        const index = state.inventory.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) {
          state.inventory[index] = action.payload as Inventory;
        }
        state.loading = false;
      });
  },
});

export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
