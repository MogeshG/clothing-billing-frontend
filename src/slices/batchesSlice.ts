import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Batch } from "../types/batch";
import api from "../utils/api";
import { snakeToCamel } from "../utils/caseConvert";

interface BatchesState {
  batches: Batch[];
  activeBatches: Batch[];
  loading: boolean;
  error: string | null;
}

const initialState: BatchesState = {
  batches: [],
  activeBatches: [],
  loading: false,
  error: null,
};

export const fetchBatches = createAsyncThunk(
  "batches/fetchBatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/batches");
      return response.data.batches.map(snakeToCamel) as Batch[];
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to fetch batches");
    }
  },
);

export const updateBatch = createAsyncThunk(
  "batches/updateBatch",
  async (batchData: Partial<Batch> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/batches/${batchData.id}`, batchData);
      return response.data;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to update batch");
    }
  },
);

export const blockBatch = createAsyncThunk(
  "batches/blockBatch",
  async (batchId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/batches/${batchId}`, {
        status: "BLOCKED",
      });
      return response.data;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to block batch");
    }
  },
);

export const generateBatchNo = createAsyncThunk(
  "batches/generateBatchNo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/batches/generate-batch-no");
      return response.data.batchNo as string;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to generate batch number");
    }
  },
);

export const generateBarcode = createAsyncThunk(
  "batches/generateBarcode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/batches/generate-barcode");
      return response.data.barcode as string;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to generate barcode");
    }
  },
);

const batchesSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
        state.activeBatches = action.payload.filter(
          (b: Batch) => b.status === "ACTIVE",
        );
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        const index = state.batches.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.batches[index] = action.payload;
          state.activeBatches = state.batches.filter(
            (b) => b.status === "ACTIVE",
          );
        }
        state.error = null;
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(blockBatch.fulfilled, (state, action) => {
        const index = state.batches.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.batches[index] = action.payload;
          state.activeBatches = state.batches.filter(
            (b) => b.status === "ACTIVE",
          );
        }
        state.error = null;
      })
      .addCase(blockBatch.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = batchesSlice.actions;
export default batchesSlice.reducer;
