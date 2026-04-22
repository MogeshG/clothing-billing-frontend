import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Purchase,
  AddPurchaseForm,
  UpdatePurchaseForm,
} from "../types/purchase";
import axios from "axios";
import { API_BASE } from "../utils/auth";
import { camelToSnake, snakeToCamel } from "../utils/caseConvert";

interface PurchasesState {
  purchases: Purchase[];
  loading: boolean;
  error: string | null;
  selectedPurchase: Purchase | null;
}

const initialState: PurchasesState = {
  purchases: [],
  loading: false,
  error: null,
  selectedPurchase: null,
};

export const fetchPurchases = createAsyncThunk<
  Purchase[],
  void,
  { rejectValue: string }
>("purchases/fetchPurchases", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/v1/purchases", {
      baseURL: API_BASE,
    });
    // Convert snake_case from backend to camelCase for frontend types
    return response.data.map((p) => snakeToCamel(p)) as Purchase[];
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch purchases";
    return rejectWithValue(message);
  }
});

export const fetchPurchaseById = createAsyncThunk<
  Purchase,
  string,
  { rejectValue: string }
>("purchases/fetchPurchaseById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/v1/purchases/${id}`, {
      baseURL: API_BASE,
    });
    return snakeToCamel(response.data) as Purchase;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch purchase";
    return rejectWithValue(message);
  }
});

export const addPurchase = createAsyncThunk<
  Purchase,
  AddPurchaseForm,
  { rejectValue: string }
>("purchases/addPurchase", async (purchaseData, { rejectWithValue }) => {
  try {
    const snakeData = camelToSnake(purchaseData);
    const response = await axios.post("/v1/purchases", snakeData, {
      baseURL: API_BASE,
    });
    return snakeToCamel(response.data.purchase) as Purchase;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create purchase";
    return rejectWithValue(message);
  }
});

export const updatePurchase = createAsyncThunk<
  Purchase,
  UpdatePurchaseForm & { id: string },
  { rejectValue: string }
>("purchases/updatePurchase", async (updateData, { rejectWithValue }) => {
  try {
    const { id, ...data } = updateData;
    const snakeData = camelToSnake(data);
    const response = await axios.put(`/v1/purchases/${id}`, snakeData, {
      baseURL: API_BASE,
    });
    return snakeToCamel(response.data.purchase) as Purchase;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update purchase";
    return rejectWithValue(message);
  }
});

export const removePurchase = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("purchases/deletePurchase", async (id, { rejectWithValue, dispatch }) => {
  try {
    await axios.delete(`/v1/purchases/${id}`, {
      baseURL: API_BASE,
    });
    // Optimistic remove
    dispatch(fetchPurchases());
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete purchase";
    return rejectWithValue(message);
  }
});

const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPurchase: (state, action) => {
      state.selectedPurchase = action.payload;
    },
    clearSelectedPurchase: (state) => {
      state.selectedPurchase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch";
      })
      .addCase(fetchPurchaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPurchase = action.payload;
        const index = state.purchases.findIndex((p) => p.id === action.payload.id);
        if (index === -1) {
          state.purchases.push(action.payload);
        } else {
          state.purchases[index] = action.payload;
        }
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch purchase";
      })
      .addCase(addPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases.unshift(action.payload);
      })
      .addCase(addPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add";
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.error = action.payload || "Failed to update";
      })
      .addCase(removePurchase.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete";
      });
  },
});

export const { clearError, setSelectedPurchase, clearSelectedPurchase } = purchasesSlice.actions;
export default purchasesSlice.reducer;
