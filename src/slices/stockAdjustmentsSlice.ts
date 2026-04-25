import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  StockAdjustment,
  StockAdjustmentsState,
  BatchForAdjustment,
} from "../types/stockAdjustment";
import api from "../utils/api";
import { camelToSnake, snakeToCamel } from "../utils/caseConvert";

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

export const fetchStockAdjustments = createAsyncThunk(
  "stockAdjustments/fetchStockAdjustments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stock-adjustments`);
      return snakeToCamel(response.data) as StockAdjustment[];
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to fetch adjustments");
    }
  },
);

export const fetchBatchesForAdjustment = createAsyncThunk(
  "stockAdjustments/fetchBatchesForAdjustment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stock-adjustments/batches`);
      return snakeToCamel(response.data) as BatchForAdjustment[];
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to fetch batches");
    }
  },
);

export const createStockAdjustment = createAsyncThunk(
  "stockAdjustments/createStockAdjustment",
  async (
    adjustment: Omit<StockAdjustment, "id" | "createdAt">,
    { rejectWithValue },
  ) => {
    try {
      const snakeData = camelToSnake(adjustment);
      const response = await api.post(`/stock-adjustments`, snakeData);
      return snakeToCamel(response.data.adjustment) as StockAdjustment;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to create adjustment");
    }
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = stockAdjustmentsSlice.actions;
export default stockAdjustmentsSlice.reducer;

