import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  StockAdjustment,
  StockAdjustmentsState,
  BatchForAdjustment,
} from "../types/stockAdjustment";
import { API_BASE } from "../utils/auth";
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
      const response = await axios.get(`/v1/stock-adjustments`, {
        baseURL: API_BASE,
      });
      return snakeToCamel(response.data) as StockAdjustment[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch adjustments");
    }
  },
);

export const fetchBatchesForAdjustment = createAsyncThunk(
  "stockAdjustments/fetchBatchesForAdjustment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/v1/stock-adjustments/batches`, {
        baseURL: API_BASE,
      });
      return snakeToCamel(response.data) as BatchForAdjustment[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch batches");
    }
  },
);

export const createStockAdjustment = createAsyncThunk(
  "stockAdjustments/createStockAdjustment",
  async (
    adjustment: Omit<StockAdjustment, "id" | "createdAt">,
    { rejectWithValue }
  ) => {
    try {
      const snakeData = camelToSnake(adjustment);
      const response = await axios.post(`/v1/stock-adjustments`, snakeData, {
        baseURL: API_BASE,
      });
      return snakeToCamel(response.data.adjustment) as StockAdjustment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create adjustment");
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
