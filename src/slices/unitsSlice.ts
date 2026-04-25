import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Unit } from "../types/unit";
import api from "../utils/api";
import { snakeToCamel } from "../utils/caseConvert";

interface UnitsState {
  units: Unit[];
  loading: boolean;
  error: string | null;
}

const initialState: UnitsState = {
  units: [],
  loading: false,
  error: null,
};

export const fetchUnits = createAsyncThunk<
  Unit[],
  void,
  { rejectValue: string }
>("units/fetchUnits", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/units");
    // Convert snake_case from backend to camelCase
    return response.data.map((u) => snakeToCamel(u)) as Unit[];
  } catch (error: unknown) {
    const err = error as Error;
    return rejectWithValue(err.message || "Failed to fetch units");
  }
});

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch";
      });
  },
});

export const { clearError } = unitsSlice.actions;
export default unitsSlice.reducer;
