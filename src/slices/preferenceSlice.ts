import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchPreferences = createAsyncThunk(
  "preferences/fetchPreferences",
  async () => {
    const response = await api.get(`/preferences`);
    return response.data;
  },
);

export const updatePreferences = createAsyncThunk(
  "preferences/updatePreferences",
  async (preferences: Record<string, string>) => {
    const response = await api.post(`/preferences/bulk`, { preferences });
    return response.data;
  },
);

interface PreferenceState {
  preferences: Record<string, string>;
  loading: boolean;
  error: string | null;
}

const initialState: PreferenceState = {
  preferences: {
    invoiceType: "a4",
  },
  loading: false,
  error: null,
};

const preferenceSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch preferences";
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      });
  },
});

export default preferenceSlice.reducer;
