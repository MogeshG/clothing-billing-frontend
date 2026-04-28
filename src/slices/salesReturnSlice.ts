import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { SalesReturn, AddSalesReturnForm } from "../types/salesReturn";
import api from "../utils/api";
import { camelToSnake, snakeToCamel } from "../utils/caseConvert";

interface salesReturnState {
  salesReturns: SalesReturn[];
  selectedSalesReturn: SalesReturn | null;
  loading: boolean;
  creating: boolean;
  billHtml: string | null;
  error: string | null;
}

const initialState: salesReturnState = {
  salesReturns: [],
  selectedSalesReturn: null,
  loading: false,
  creating: false,
  billHtml: null,
  error: null,
};

export const fetchSalesReturns = createAsyncThunk<
  SalesReturn[],
  void,
  { rejectValue: string }
>("salesReturns/fetchSalesReturns", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/sales-returns");
    return response.data.map((cn: unknown) =>
      snakeToCamel(cn as never),
    ) as SalesReturn[];
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to fetch sales returns");
  }
});

export const fetchSalesReturnById = createAsyncThunk<
  SalesReturn,
  string,
  { rejectValue: string }
>("salesReturns/fetchSalesReturnById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/sales-returns/${id}`);
    return snakeToCamel(response.data as never) as SalesReturn;
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to fetch sales returns");
  }
});

export const addSalesReturn = createAsyncThunk<
  SalesReturn,
  AddSalesReturnForm,
  { rejectValue: string }
>("salesReturns/addSalesReturn", async (formData, { rejectWithValue }) => {
  try {
    const payload = camelToSnake({ ...formData });
    const response = await api.post("/sales-returns", payload);
    return snakeToCamel(response.data.salesReturn as never) as SalesReturn;
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to create sales returns");
  }
});

export const updateSalesReturn = createAsyncThunk<
  SalesReturn,
  { id: string; data: Partial<AddSalesReturnForm> },
  { rejectValue: string }
>(
  "salesReturns/updateSalesReturn",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const payload = camelToSnake({ ...data });
      const response = await api.patch(`/sales-returns/${id}`, payload);
      return snakeToCamel(response.data.salesReturn as never) as SalesReturn;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to update sales returns");
    }
  },
);

export const approveSalesReturn = createAsyncThunk<
  SalesReturn,
  string,
  { rejectValue: string }
>("salesReturns/approveSalesReturn", async (id, { rejectWithValue }) => {
  try {
    const response = await api.post(`/sales-returns/${id}/approve`);
    return snakeToCamel(response.data.salesReturn as never) as SalesReturn;
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to approve sales returns");
  }
});

export const deleteSalesReturn = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("salesReturns/deleteSalesReturn", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/sales-returns/${id}`);
    return id;
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to delete sales returns");
  }
});

export const generateSalesReturnBill = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "salesReturns/generateSalesReturnBill",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sales-returns/${id}/bill`);
      return response.data.html as string;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to generate bill");
    }
  },
);

const salesReturnsSlice = createSlice({
  name: "salesReturns",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSalesReturn: (state) => {
      state.selectedSalesReturn = null;
    },
    clearBillHtml: (state) => {
      state.billHtml = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSalesReturns
      .addCase(fetchSalesReturns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReturns = action.payload;
      })
      .addCase(fetchSalesReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sales returns";
      })
      // fetchSalesReturnById
      .addCase(fetchSalesReturnById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSalesReturn = action.payload;
      })
      .addCase(fetchSalesReturnById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sales returns";
      })
      // addSalesReturn
      .addCase(addSalesReturn.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(addSalesReturn.fulfilled, (state, action) => {
        state.creating = false;
        state.salesReturns.unshift(action.payload);
      })
      .addCase(addSalesReturn.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to create sales returns";
      })
      // updateSalesReturn
      .addCase(updateSalesReturn.fulfilled, (state, action) => {
        const index = state.salesReturns.findIndex(
          (cn) => cn.id === action.payload.id,
        );
        if (index !== -1) {
          state.salesReturns[index] = action.payload;
        }
        if (state.selectedSalesReturn?.id === action.payload.id) {
          state.selectedSalesReturn = action.payload;
        }
      })
      .addCase(updateSalesReturn.rejected, (state, action) => {
        state.error = action.payload || "Failed to update sales returns";
      })
      // approveSalesReturn
      .addCase(approveSalesReturn.fulfilled, (state, action) => {
        const index = state.salesReturns.findIndex(
          (cn) => cn.id === action.payload.id,
        );
        if (index !== -1) {
          state.salesReturns[index] = action.payload;
        }
        if (state.selectedSalesReturn?.id === action.payload.id) {
          state.selectedSalesReturn = action.payload;
        }
      })
      .addCase(approveSalesReturn.rejected, (state, action) => {
        state.error = action.payload || "Failed to approve sales returns";
      })
      // deleteSalesReturn
      .addCase(deleteSalesReturn.fulfilled, (state, action) => {
        state.salesReturns = state.salesReturns.filter(
          (cn) => cn.id !== action.payload,
        );
        if (state.selectedSalesReturn?.id === action.payload) {
          state.selectedSalesReturn = null;
        }
      })
      .addCase(deleteSalesReturn.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete sales returns";
      })
      // generateSalesReturnBill
      .addCase(generateSalesReturnBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateSalesReturnBill.fulfilled, (state, action) => {
        state.loading = false;
        state.billHtml = action.payload;
      })
      .addCase(generateSalesReturnBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedSalesReturn, clearBillHtml } =
  salesReturnsSlice.actions;
export default salesReturnsSlice.reducer;
