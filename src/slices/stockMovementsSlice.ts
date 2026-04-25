import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { StockMovement } from "../types/stockMovement";
import { snakeToCamel } from "../utils/caseConvert";
import api from "../utils/api";

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

export const fetchStockMovements = createAsyncThunk(
  "stockMovements/fetchStockMovements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stock-movements`, {
        params: { limit: 200 },
      });
      const raw = response.data.stock_movements ?? response.data;
      return snakeToCamel(raw) as StockMovement[];
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to fetch stock movements");
    }
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
        state.error =
          (action.payload as string) || "Failed to fetch stock movements";
      });
  },
});

export const { clearError } = stockMovementsSlice.actions;
export default stockMovementsSlice.reducer;
