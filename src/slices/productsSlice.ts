/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product, AddProductForm } from "../types/product";
import axios from "axios";
import { API_BASE } from "../utils/auth";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProducts: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  selectedProducts: [],
  pagination: null,
};

function transformToCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(transformToCamelCase);
  }
  
  const camelCaseObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    camelCaseObj[camelKey] = transformToCamelCase(obj[key]);
  }
  
  // Special handling for variants → variant
  if (camelCaseObj.variants) {
    camelCaseObj.variant = camelCaseObj.variants;
    delete camelCaseObj.variants;
  }
  
  return camelCaseObj;
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    search = "",
    page = 1,
    limit = 50,
  }: { search?: string; page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams({
      ...(search && { search }),
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await axios.get(`/v1/products?${params}`, {
      baseURL: API_BASE,
    });
    return {
      ...response.data,
      products: response.data.products.map((p: any) => transformToCamelCase(p)),
    };
  },
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData: AddProductForm, { rejectWithValue }) => {
    try {
      const response = await axios.post("/v1/products", productData, {
        baseURL: API_BASE,
      });
      return {
        product: transformToCamelCase(response.data.product),
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to add product",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product: Partial<Product> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/v1/products/${product.id}`, product, {
        baseURL: API_BASE,
      });
      return {
        product: transformToCamelCase(response.data.product),
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update product",
      );
    }
  },
);

export const deleteProducts = createAsyncThunk(
  "products/deleteProducts",
  async (productIds: string[], { rejectWithValue }) => {
    try {
      const promises = productIds.map((id) =>
        axios.delete(`/v1/products/${id}`, { baseURL: API_BASE }),
      );
      await Promise.all(promises);
      return productIds;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete products",
      );
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProducts: (state, action: PayloadAction<string[]>) => {
      state.selectedProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.products = [];
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.product);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.product.id,
        );
        if (index !== -1) state.products[index] = action.payload.product;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteProducts.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => !action.payload.includes(p.id),
        );
        state.error = null;
      })
      .addCase(deleteProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedProducts } = productsSlice.actions;
export default productsSlice.reducer;
