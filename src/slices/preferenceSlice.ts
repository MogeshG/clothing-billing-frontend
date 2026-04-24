import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../utils/auth";


export const fetchPreferences = createAsyncThunk(
  "preferences/fetchPreferences",
  async () => {
    const response = await axios.get(`/v1/preferences`, {
      baseURL: API_BASE
    });
    return response.data;
  }
);

export const updatePreferences = createAsyncThunk(
  "preferences/updatePreferences",
  async (preferences: Record<string, string>) => {
    const response = await axios.post(`/v1/preferences/bulk`, { preferences }, {
      baseURL: API_BASE
    });
    return response.data;
  }
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
