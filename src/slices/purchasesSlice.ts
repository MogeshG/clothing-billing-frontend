import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Purchase,
  AddPurchaseForm,
  UpdatePurchaseForm,
} from "../types/purchase";

interface PurchasesState {
  purchases: Purchase[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchasesState = {
  purchases: [],
  loading: false,
  error: null,
};

export const mockPurchases: Purchase[] = [
  {
    id: "P1",
    purchaseNo: "PUR-0001",
    status: "COMPLETED",
    vendorName: "RK Traders",
    vendorPhone: "9876543210",
    vendorGstin: "33ABCDE1234F1Z5",
    subTotal: 5000,
    discount: 200,
    taxAmount: 864,
    totalAmount: 5664,
    purchaseDate: "2026-04-01T10:00:00.000Z",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
    items: [
      {
        id: "PI1",
        purchaseId: "P1",
        itemType: "FINISHED",
        productVariantId: "V1",
        itemName: "Men Cotton Shirt",
        sku: "SH-001-M",
        size: "M",
        color: "Blue",
        hsnCode: "6105",
        quantity: 10,
        price: 500,
        cgstPercent: 6,
        sgstPercent: 6,
        igstPercent: 0,
        total: 5000,
        createdAt: "2026-04-01T10:00:00.000Z",
      },
    ],
  },

  {
    id: "P2",
    purchaseNo: "PUR-0002",
    status: "COMPLETED",
    vendorName: "Patel Distributors",
    vendorPhone: "9123456780",
    vendorGstin: "27ABCDE5678K1Z2",
    subTotal: 8000,
    discount: 0,
    taxAmount: 1440,
    totalAmount: 9440,
    purchaseDate: "2026-04-02T11:00:00.000Z",
    createdAt: "2026-04-02T11:00:00.000Z",
    updatedAt: "2026-04-02T11:00:00.000Z",
    items: [
      {
        id: "PI2",
        purchaseId: "P2",
        itemType: "FINISHED",
        productVariantId: "V2",
        itemName: "Denim Jeans",
        sku: "JN-002-L",
        size: "L",
        color: "Black",
        hsnCode: "6203",
        quantity: 8,
        price: 1000,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 8000,
        createdAt: "2026-04-02T11:00:00.000Z",
      },
    ],
  },

  {
    id: "P3",
    purchaseNo: "PUR-0003",
    status: "COMPLETED",
    vendorName: "Sharma Supplies",
    vendorPhone: "9988776655",
    vendorGstin: "07ABCDE4321L1Z9",
    subTotal: 12000,
    discount: 500,
    taxAmount: 2070,
    totalAmount: 13570,
    purchaseDate: "2026-04-03T09:30:00.000Z",
    createdAt: "2026-04-03T09:30:00.000Z",
    updatedAt: "2026-04-03T09:30:00.000Z",
    items: [
      {
        id: "PI3",
        purchaseId: "P3",
        itemType: "FINISHED",
        productVariantId: "V3",
        itemName: "Kids T-Shirt",
        sku: "KT-003-S",
        size: "S",
        color: "Red",
        hsnCode: "6109",
        quantity: 20,
        price: 600,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 12000,
        createdAt: "2026-04-03T09:30:00.000Z",
      },
    ],
  },

  {
    id: "P4",
    purchaseNo: "PUR-0004",
    status: "COMPLETED",
    vendorName: "Ali Traders",
    vendorPhone: "9090909090",
    vendorGstin: "36ABCDE1111Q1Z7",
    subTotal: 15000,
    discount: 1000,
    taxAmount: 2520,
    totalAmount: 16520,
    purchaseDate: "2026-04-04T12:15:00.000Z",
    createdAt: "2026-04-04T12:15:00.000Z",
    updatedAt: "2026-04-04T12:15:00.000Z",
    items: [
      {
        id: "PI4",
        purchaseId: "P4",
        itemType: "FINISHED",
        productVariantId: "V4",
        itemName: "Sports Shoes",
        sku: "SS-004-42",
        size: "42",
        color: "White",
        hsnCode: "6404",
        quantity: 10,
        price: 1500,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 15000,
        createdAt: "2026-04-04T12:15:00.000Z",
      },
    ],
  },

  {
    id: "P5",
    purchaseNo: "PUR-0005",
    status: "DRAFT",
    vendorName: "Karthik Enterprises",
    vendorPhone: "9000011111",
    vendorGstin: "33ABCDE9999R1Z3",
    subTotal: 4000,
    discount: 0,
    taxAmount: 720,
    totalAmount: 4720,
    purchaseDate: "2026-04-05T14:00:00.000Z",
    createdAt: "2026-04-05T14:00:00.000Z",
    updatedAt: "2026-04-05T14:00:00.000Z",
    items: [
      {
        id: "PI5",
        purchaseId: "P5",
        itemType: "FINISHED",
        productVariantId: "V5",
        itemName: "Casual Shirt",
        sku: "CS-005-L",
        size: "L",
        color: "Green",
        hsnCode: "6105",
        quantity: 8,
        price: 500,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 4000,
        createdAt: "2026-04-05T14:00:00.000Z",
      },
    ],
  },

  {
    id: "P6",
    purchaseNo: "PUR-0006",
    status: "COMPLETED",
    vendorName: "Mehta vendors",
    vendorPhone: "8888888888",
    vendorGstin: "24ABCDE2222S1Z6",
    subTotal: 20000,
    discount: 1500,
    taxAmount: 3330,
    totalAmount: 21830,
    purchaseDate: "2026-04-06T10:45:00.000Z",
    createdAt: "2026-04-06T10:45:00.000Z",
    updatedAt: "2026-04-06T10:45:00.000Z",
    items: [
      {
        id: "PI6",
        purchaseId: "P6",
        itemType: "FINISHED",
        productVariantId: "V6",
        itemName: "Women Kurti",
        sku: "WK-006-M",
        size: "M",
        color: "Yellow",
        hsnCode: "6206",
        quantity: 20,
        price: 1000,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 20000,
        createdAt: "2026-04-06T10:45:00.000Z",
      },
    ],
  },

  {
    id: "P7",
    purchaseNo: "PUR-0007",
    status: "COMPLETED",
    vendorName: "Singh Distributors",
    vendorPhone: "9777777777",
    vendorGstin: "36ABCDE3333T1Z4",
    subTotal: 9000,
    discount: 0,
    taxAmount: 1620,
    totalAmount: 10620,
    purchaseDate: "2026-04-07T16:20:00.000Z",
    createdAt: "2026-04-07T16:20:00.000Z",
    updatedAt: "2026-04-07T16:20:00.000Z",
    items: [
      {
        id: "PI7",
        purchaseId: "P7",
        itemType: "FINISHED",
        productVariantId: "V7",
        itemName: "Jeans Jacket",
        sku: "JJ-007-L",
        size: "L",
        color: "Blue",
        hsnCode: "6201",
        quantity: 6,
        price: 1500,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 9000,
        createdAt: "2026-04-07T16:20:00.000Z",
      },
    ],
  },

  {
    id: "P8",
    purchaseNo: "PUR-0008",
    status: "COMPLETED",
    vendorName: "Lakshmi Traders",
    vendorPhone: "9666666666",
    vendorGstin: "29ABCDE4444U1Z8",
    subTotal: 11000,
    discount: 500,
    taxAmount: 1890,
    totalAmount: 12390,
    purchaseDate: "2026-04-08T13:10:00.000Z",
    createdAt: "2026-04-08T13:10:00.000Z",
    updatedAt: "2026-04-08T13:10:00.000Z",
    items: [
      {
        id: "PI8",
        purchaseId: "P8",
        itemType: "FINISHED",
        productVariantId: "V8",
        itemName: "Formal Shirt",
        sku: "FS-008-M",
        size: "M",
        color: "White",
        hsnCode: "6105",
        quantity: 11,
        price: 1000,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 11000,
        createdAt: "2026-04-08T13:10:00.000Z",
      },
    ],
  },

  {
    id: "P9",
    purchaseNo: "PUR-0009",
    status: "CANCELLED",
    vendorName: "Das & Co",
    vendorPhone: "9555555555",
    vendorGstin: "19ABCDE5555V1Z1",
    subTotal: 6000,
    discount: 0,
    taxAmount: 0,
    totalAmount: 6000,
    purchaseDate: "2026-04-09T11:00:00.000Z",
    createdAt: "2026-04-09T11:00:00.000Z",
    updatedAt: "2026-04-09T11:00:00.000Z",
    items: [
      {
        id: "PI9",
        purchaseId: "P9",
        itemType: "FINISHED",
        productVariantId: "V9",
        itemName: "T-Shirt Combo Pack",
        sku: "TC-009",
        size: "L",
        color: "Multi",
        hsnCode: "6109",
        quantity: 12,
        price: 500,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0,
        total: 6000,
        createdAt: "2026-04-09T11:00:00.000Z",
      },
    ],
  },

  {
    id: "P10",
    purchaseNo: "PUR-0010",
    status: "COMPLETED",
    vendorName: "Nair Distributors",
    vendorPhone: "9444444444",
    vendorGstin: "32ABCDE6666W1Z0",
    subTotal: 25000,
    discount: 2000,
    taxAmount: 4140,
    totalAmount: 27140,
    purchaseDate: "2026-04-10T15:30:00.000Z",
    createdAt: "2026-04-10T15:30:00.000Z",
    updatedAt: "2026-04-10T15:30:00.000Z",
    items: [
      {
        id: "PI10",
        purchaseId: "P10",
        itemType: "FINISHED",
        productVariantId: "V10",
        itemName: "Mixed Apparel Stock",
        sku: "MA-010",
        size: "Mixed",
        color: "Mixed",
        hsnCode: "6203",
        quantity: 25,
        price: 1000,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 25000,
        createdAt: "2026-04-10T15:30:00.000Z",
      },
    ],
  },
];

export const fetchPurchases = createAsyncThunk(
  "purchases/fetchPurchases",
  async () => {
    return new Promise<Purchase[]>((resolve) => {
      setTimeout(() => resolve(mockPurchases), 500);
    });
  },
);

export const addPurchase = createAsyncThunk(
  "purchases/addPurchase",
  async (purchaseData: AddPurchaseForm) => {
    return new Promise<Purchase>((resolve) => {
      setTimeout(() => {
        const newPurchase: Purchase = {
          id: `P${Date.now()}`,
          purchaseNo: purchaseData.purchaseNo,
          status: "DRAFT",
          vendorName: purchaseData.vendorName,
          vendorPhone: purchaseData.vendorPhone,
          vendorGstin: purchaseData.vendorGstin,
          purchaseDate: purchaseData.purchaseDate,
          subTotal: purchaseData.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0,
          ),
          discount: 0,
          taxAmount: purchaseData.items.reduce((sum, item) => {
            const total = item.quantity * item.price;
            return (
              sum +
              total *
                ((item.cgstPercent + item.sgstPercent + item.igstPercent) / 100)
            );
          }, 0),
          totalAmount: 0, // calculated later
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: purchaseData.items.map((item) => ({
            id: `PI${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            purchaseId: `P${Date.now()}`,
            productVariantId: undefined,
            itemName: item.itemName,
            itemType: "RAW" as const,
            sku: undefined,
            size: undefined,
            color: undefined,
            hsnCode: item.hsnCode,
            quantity: item.quantity,
            price: item.price,
            cgstPercent: item.cgstPercent,
            sgstPercent: item.sgstPercent,
            igstPercent: item.igstPercent,
            total: item.quantity * item.price,
            createdAt: new Date().toISOString(),
          })),
        };
        newPurchase.totalAmount =
          newPurchase.subTotal + newPurchase.taxAmount - newPurchase.discount;
        resolve(newPurchase);
      }, 1000);
    });
  },
);

export const updatePurchase = createAsyncThunk(
  "purchases/updatePurchase",
  async (
    updateData: UpdatePurchaseForm & { id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/purchases/${updateData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to update purchase");
    }
  },
);

const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.purchases.unshift(action.payload);
        state.error = null;
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) state.purchases[index] = action.payload;
        state.error = null;
      });
  },
});

export const { clearError } = purchasesSlice.actions;
export default purchasesSlice.reducer;
