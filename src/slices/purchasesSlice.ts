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
    purchase_no: "PUR-0001",
    status: "COMPLETED",
    vendor_name: "RK Traders",
    vendor_phone: "9876543210",
    vendor_gstin: "33ABCDE1234F1Z5",
    sub_total: 5000,
    discount: 200,
    tax_amount: 864,
    total_amount: 5664,
    purchase_date: "2026-04-01T10:00:00.000Z",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
    items: [
      {
        id: "PI1",
        purchase_id: "P1",
        item_type: "FINISHED",
        product_variant_id: "V1",
        item_name: "Men Cotton Shirt",
        sku: "SH-001-M",
        size: "M",
        color: "Blue",
        hsn_code: "6105",
        quantity: 10,
        price: 500,
        cgst_percent: 6,
        sgst_percent: 6,
        igst_percent: 0,
        total: 5000,
        createdAt: "2026-04-01T10:00:00.000Z",
      },
    ],
  },

  {
    id: "P2",
    purchase_no: "PUR-0002",
    status: "COMPLETED",
    vendor_name: "Patel Distributors",
    vendor_phone: "9123456780",
    vendor_gstin: "27ABCDE5678K1Z2",
    sub_total: 8000,
    discount: 0,
    tax_amount: 1440,
    total_amount: 9440,
    purchase_date: "2026-04-02T11:00:00.000Z",
    createdAt: "2026-04-02T11:00:00.000Z",
    updatedAt: "2026-04-02T11:00:00.000Z",
    items: [
      {
        id: "PI2",
        purchase_id: "P2",
        item_type: "FINISHED",
        product_variant_id: "V2",
        item_name: "Denim Jeans",
        sku: "JN-002-L",
        size: "L",
        color: "Black",
        hsn_code: "6203",
        quantity: 8,
        price: 1000,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
        total: 8000,
        createdAt: "2026-04-02T11:00:00.000Z",
      },
    ],
  },

  {
    id: "P3",
    purchase_no: "PUR-0003",
    status: "COMPLETED",
    vendor_name: "Sharma Supplies",
    vendor_phone: "9988776655",
    vendor_gstin: "07ABCDE4321L1Z9",
    sub_total: 12000,
    discount: 500,
    tax_amount: 2070,
    total_amount: 13570,
    purchase_date: "2026-04-03T09:30:00.000Z",
    createdAt: "2026-04-03T09:30:00.000Z",
    updatedAt: "2026-04-03T09:30:00.000Z",
    items: [
      {
        id: "PI3",
        purchase_id: "P3",
        item_type: "FINISHED",
        product_variant_id: "V3",
        item_name: "Kids T-Shirt",
        sku: "KT-003-S",
        size: "S",
        color: "Red",
        hsn_code: "6109",
        quantity: 20,
        price: 600,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
        total: 12000,
        createdAt: "2026-04-03T09:30:00.000Z",
      },
    ],
  },

  {
    id: "P4",
    purchase_no: "PUR-0004",
    status: "COMPLETED",
    vendor_name: "Ali Traders",
    vendor_phone: "9090909090",
    vendor_gstin: "36ABCDE1111Q1Z7",
    sub_total: 15000,
    discount: 1000,
    tax_amount: 2520,
    total_amount: 16520,
    purchase_date: "2026-04-04T12:15:00.000Z",
    createdAt: "2026-04-04T12:15:00.000Z",
    updatedAt: "2026-04-04T12:15:00.000Z",
    items: [
      {
        id: "PI4",
        purchase_id: "P4",
        item_type: "FINISHED",
        product_variant_id: "V4",
        item_name: "Sports Shoes",
        sku: "SS-004-42",
        size: "42",
        color: "White",
        hsn_code: "6404",
        quantity: 10,
        price: 1500,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
        total: 15000,
        createdAt: "2026-04-04T12:15:00.000Z",
      },
    ],
  },

  {
    id: "P5",
    purchase_no: "PUR-0005",
    status: "DRAFT",
    vendor_name: "Karthik Enterprises",
    vendor_phone: "9000011111",
    vendor_gstin: "33ABCDE9999R1Z3",
    sub_total: 4000,
    discount: 0,
    tax_amount: 720,
    total_amount: 4720,
    purchase_date: "2026-04-05T14:00:00.000Z",
    createdAt: "2026-04-05T14:00:00.000Z",
    updatedAt: "2026-04-05T14:00:00.000Z",
    items: [
      {
        id: "PI5",
        purchase_id: "P5",
        item_type: "FINISHED",
        product_variant_id: "V5",
        item_name: "Casual Shirt",
        sku: "CS-005-L",
        size: "L",
        color: "Green",
        hsn_code: "6105",
        quantity: 8,
        price: 500,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
        total: 4000,
        createdAt: "2026-04-05T14:00:00.000Z",
      },
    ],
  },

  {
    id: "P6",
    purchase_no: "PUR-0006",
    status: "COMPLETED",
    vendor_name: "Mehta vendors",
    vendor_phone: "8888888888",
    vendor_gstin: "24ABCDE2222S1Z6",
    sub_total: 20000,
    discount: 1500,
    tax_amount: 3330,
    total_amount: 21830,
    purchase_date: "2026-04-06T10:45:00.000Z",
    createdAt: "2026-04-06T10:45:00.000Z",
    updatedAt: "2026-04-06T10:45:00.000Z",
    items: [
      {
        id: "PI6",
        purchase_id: "P6",
        item_type: "FINISHED",
        product_variant_id: "V6",
        item_name: "Women Kurti",
        sku: "WK-006-M",
        size: "M",
        color: "Yellow",
        hsn_code: "6206",
        quantity: 20,
        price: 1000,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
        total: 20000,
        createdAt: "2026-04-06T10:45:00.000Z",
      },
    ],
  },

  {
    id: "P7",
    purchase_no: "PUR-0007",
    status: "COMPLETED",
    vendor_name: "Singh Distributors",
    vendor_phone: "9777777777",
    vendor_gstin: "36ABCDE3333T1Z4",
    sub_total: 9000,
    discount: 0,
    tax_amount: 1620,
    total_amount: 10620,
    purchase_date: "2026-04-07T16:20:00.000Z",
    createdAt: "2026-04-07T16:20:00.000Z",
    updatedAt: "2026-04-07T16:20:00.000Z",
    items: [
      {
        id: "PI7",
        purchase_id: "P7",
        item_type: "FINISHED",
        product_variant_id: "V7",
        item_name: "Jeans Jacket",
        sku: "JJ-007-L",
        size: "L",
        color: "Blue",
        hsn_code: "6201",
        quantity: 6,
        price: 1500,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
        total: 9000,
        createdAt: "2026-04-07T16:20:00.000Z",
      },
    ],
  },

  {
    id: "P8",
    purchase_no: "PUR-0008",
    status: "COMPLETED",
    vendor_name: "Lakshmi Traders",
    vendor_phone: "9666666666",
    vendor_gstin: "29ABCDE4444U1Z8",
    sub_total: 11000,
    discount: 500,
    tax_amount: 1890,
    total_amount: 12390,
    purchase_date: "2026-04-08T13:10:00.000Z",
    createdAt: "2026-04-08T13:10:00.000Z",
    updatedAt: "2026-04-08T13:10:00.000Z",
    items: [
      {
        id: "PI8",
        purchase_id: "P8",
        item_type: "FINISHED",
        product_variant_id: "V8",
        item_name: "Formal Shirt",
        sku: "FS-008-M",
        size: "M",
        color: "White",
        hsn_code: "6105",
        quantity: 11,
        price: 1000,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
        total: 11000,
        createdAt: "2026-04-08T13:10:00.000Z",
      },
    ],
  },

  {
    id: "P9",
    purchase_no: "PUR-0009",
    status: "CANCELLED",
    vendor_name: "Das & Co",
    vendor_phone: "9555555555",
    vendor_gstin: "19ABCDE5555V1Z1",
    sub_total: 6000,
    discount: 0,
    tax_amount: 0,
    total_amount: 6000,
    purchase_date: "2026-04-09T11:00:00.000Z",
    createdAt: "2026-04-09T11:00:00.000Z",
    updatedAt: "2026-04-09T11:00:00.000Z",
    items: [
      {
        id: "PI9",
        purchase_id: "P9",
        item_type: "FINISHED",
        product_variant_id: "V9",
        item_name: "T-Shirt Combo Pack",
        sku: "TC-009",
        size: "L",
        color: "Multi",
        hsn_code: "6109",
        quantity: 12,
        price: 500,
        cgst_percent: 0,
        sgst_percent: 0,
        igst_percent: 0,
        total: 6000,
        createdAt: "2026-04-09T11:00:00.000Z",
      },
    ],
  },

  {
    id: "P10",
    purchase_no: "PUR-0010",
    status: "COMPLETED",
    vendor_name: "Nair Distributors",
    vendor_phone: "9444444444",
    vendor_gstin: "32ABCDE6666W1Z0",
    sub_total: 25000,
    discount: 2000,
    tax_amount: 4140,
    total_amount: 27140,
    purchase_date: "2026-04-10T15:30:00.000Z",
    createdAt: "2026-04-10T15:30:00.000Z",
    updatedAt: "2026-04-10T15:30:00.000Z",
    items: [
      {
        id: "PI10",
        purchase_id: "P10",
        item_type: "FINISHED",
        product_variant_id: "V10",
        item_name: "Mixed Apparel Stock",
        sku: "MA-010",
        size: "Mixed",
        color: "Mixed",
        hsn_code: "6203",
        quantity: 25,
        price: 1000,
        cgst_percent: 9,
        sgst_percent: 9,
        igst_percent: 0,
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
          purchase_no: purchaseData.purchase_no,
          status: "DRAFT",
          vendor_name: purchaseData.vendor_name,
          vendor_phone: purchaseData.vendor_phone,
          vendor_gstin: purchaseData.vendor_gstin,
          purchase_date: purchaseData.purchase_date,
          sub_total: purchaseData.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0,
          ),
          discount: 0,
          tax_amount: purchaseData.items.reduce((sum, item) => {
            const total = item.quantity * item.price;
            return (
              sum +
              total *
                ((item.cgst_percent + item.sgst_percent + item.igst_percent) /
                  100)
            );
          }, 0),
          total_amount: 0, // calculated later
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: purchaseData.items.map((item) => ({
            id: `PI${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            purchase_id: `P${Date.now()}`,
            product_variant_id: undefined,
            item_name: item.item_name,
            item_type: "RAW" as const,
            sku: undefined,
            size: undefined,
            color: undefined,
            hsn_code: item.hsn_code,
            quantity: item.quantity,
            price: item.price,
            cgst_percent: item.cgst_percent,
            sgst_percent: item.sgst_percent,
            igst_percent: item.igst_percent,
            total: item.quantity * item.price,
            createdAt: new Date().toISOString(),
          })),
        };
        newPurchase.total_amount =
          newPurchase.sub_total + newPurchase.tax_amount - newPurchase.discount;
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
