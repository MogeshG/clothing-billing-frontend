import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Invoice, AddInvoiceForm } from "../types/invoice";
import { camelToSnake, snakeToCamel } from "../utils/caseConvert";
import api from "../utils/api";

interface InvoicesState {
  invoices: Invoice[];
  drafts: Invoice[];
  loading: boolean;
  creating: boolean;
  billHtml: string | null;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  drafts: [],
  loading: false,
  creating: false,
  billHtml: null,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/invoices");
      // Backend returns { invoices: [], pagination: {} }
      return snakeToCamel(response.data.invoices);
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to fetch invoices");
    }
  },
);

export const addInvoice = createAsyncThunk(
  "invoices/addInvoice",
  async (invoiceData: AddInvoiceForm, { rejectWithValue }) => {
    try {
      // For POS, we usually want to finalize immediately
      const payload = camelToSnake({
        ...invoiceData,
        status: invoiceData.status || "COMPLETED",
      });
      const response = await api.post("/invoices", payload);

      return snakeToCamel(response.data.invoice);
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to create invoice");
    }
  },
);

export const createDraftInvoice = createAsyncThunk(
  "invoices/createDraft",
  async (invoiceData: AddInvoiceForm, { rejectWithValue }) => {
    try {
      const payload = camelToSnake({
        ...invoiceData,
        status: "DRAFT",
      });
      const response = await api.post("/invoices", payload);
      return snakeToCamel(response.data.invoice);
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to create draft");
    }
  },
);

export const updateDraftInvoice = createAsyncThunk(
  "invoices/updateDraft",
  async (
    { id, invoiceData }: { id: string; invoiceData: Partial<AddInvoiceForm> },
    { rejectWithValue },
  ) => {
    try {
      const payload = camelToSnake(invoiceData);
      const response = await api.put(`/invoices/${id}`, payload);
      return snakeToCamel(response.data.invoice);
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to update draft");
    }
  },
);

export const finalizeInvoice = createAsyncThunk(
  "invoices/finalize",
  async (
    {
      id,
      paidAmount,
      paymentMethod,
    }: {
      id: string;
      paidAmount: number;
      paymentMethod?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/invoices/${id}/finalize`, {
        paid_amount: paidAmount,
        payment_method: paymentMethod,
      });
      return snakeToCamel(response.data.invoice);
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to finalize invoice");
    }
  },
);

export const deleteInvoice = createAsyncThunk(
  "invoices/deleteInvoice",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/invoices/${id}`);
      return id;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to delete invoice");
    }
  },
);

export const generateBill = createAsyncThunk<
  string,
  { id: string; type: "a4" | "thermal" },
  { rejectValue: string }
>("invoices/generateBill", async ({ id, type }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/invoices/${id}/bill`, {
      params: { type },
    });
    return response.data.html as string;
  } catch (error) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to generate bill");
  }
});

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBillHtml: (state) => {
      state.billHtml = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInvoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInvoices.fulfilled,
        (state, action: PayloadAction<Invoice[]>) => {
          state.loading = false;
          state.invoices = action.payload.filter(
            (inv) => inv.status !== "DRAFT",
          );
          state.drafts = action.payload.filter((inv) => inv.status === "DRAFT");
        },
      )
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addInvoice
      .addCase(addInvoice.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(
        addInvoice.fulfilled,
        (state, action: PayloadAction<Invoice>) => {
          state.creating = false;
          if (action.payload.status === "DRAFT") {
            state.drafts.unshift(action.payload);
          } else {
            state.invoices.unshift(action.payload);
          }
        },
      )
      .addCase(createDraftInvoice.fulfilled, (state, action) => {
        state.drafts.unshift(action.payload);
      })
      .addCase(updateDraftInvoice.fulfilled, (state, action) => {
        const index = state.drafts.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.drafts[index] = action.payload;
        }
      })
      .addCase(addInvoice.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      // finalizeInvoice
      .addCase(
        finalizeInvoice.fulfilled,
        (state, action: PayloadAction<Invoice>) => {
          state.drafts = state.drafts.filter(
            (inv) => inv.id !== action.payload.id,
          );
          state.invoices.unshift(action.payload);
        },
      )
      // deleteInvoice
      .addCase(
        deleteInvoice.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.invoices = state.invoices.filter(
            (inv) => inv.id !== action.payload,
          );
          state.drafts = state.drafts.filter(
            (inv) => inv.id !== action.payload,
          );
        },
      )
      // generateBill
      .addCase(generateBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateBill.fulfilled, (state, action) => {
        state.loading = false;
        state.billHtml = action.payload;
      })
      .addCase(generateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearBillHtml } = invoicesSlice.actions;
export default invoicesSlice.reducer;
