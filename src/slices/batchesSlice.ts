import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Batch } from "../types/batch";
import axios from "axios";
import { API_BASE } from "../utils/auth";
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

export const fetchBatches = createAsyncThunk("batches/fetchBatches", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/v1/batches", { baseURL: API_BASE });
    return response.data.batches.map(snakeToCamel) as Batch[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch batches");
  }
});

export const updateBatch = createAsyncThunk(
  "batches/updateBatch",
  async (batchData: Partial<Batch> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/v1/batches/${batchData.id}`,
        batchData, { baseURL: API_BASE });
      return response.data;
    } catch (error: any) {
      console.error("Error updating batch:", error);
      return rejectWithValue(error.message || "Failed to update batch");
    }
  },
);

export const blockBatch = createAsyncThunk(
  "batches/blockBatch",
  async (batchId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/v1/batches/${batchId}`, {
        status: "BLOCKED",
      }, { baseURL: API_BASE });
      return response.data;
    } catch (error: any) {
      console.error("Error blocking batch:", error);
      return rejectWithValue(error.message || "Failed to block batch");
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
        state.activeBatches = action.payload.filter((b: Batch) => b.status === "ACTIVE");
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        const index = state.batches.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.batches[index] = action.payload;
          state.activeBatches = state.batches.filter((b) => b.status === "ACTIVE");
        }
        state.error = null;
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(blockBatch.fulfilled, (state, action) => {
        const index = state.batches.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.batches[index] = action.payload;
          state.activeBatches = state.batches.filter((b) => b.status === "ACTIVE");
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
