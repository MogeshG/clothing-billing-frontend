import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { ProductCategory } from "../types/productCategory";

interface ProductCategoriesState {
  productCategories: ProductCategory[];
  loading: boolean;
  error: string | null;
  selectedProductCategories: ProductCategory[];
}

const initialState: ProductCategoriesState = {
  productCategories: [],
  loading: false,
  error: null,
  selectedProductCategories: [],
};

// Mock data
const mockProductCategories: ProductCategory[] = [
  {
    id: "cat1",
    name: "Apparel",
    description: "Clothing and apparel items",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat2",
    name: "Bottomwear",
    description: "Pants, jeans, shorts",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat3",
    name: "Footwear",
    description: "Shoes, sandals, boots",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat4",
    name: "Accessories",
    description: "Belts, wallets, sunglasses",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat5",
    name: "Electronics",
    description: "Gadgets and electronics",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cat6",
    name: "Home & Living",
    description: "Home decor and living items",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Thunks
export const fetchProductCategories = createAsyncThunk(
  "productCategories/fetchProductCategories",
  async () => {
    return new Promise<ProductCategory[]>((resolve) => {
      setTimeout(() => resolve(mockProductCategories), 500);
    });
  },
);

export const addProductCategory = createAsyncThunk(
  "productCategories/addProductCategory",
  async (category: Omit<ProductCategory, "id" | "createdAt" | "updatedAt">) => {
    return new Promise<ProductCategory>((resolve) => {
      setTimeout(() => {
        const newCategory: ProductCategory = {
          id: Math.random().toString(36).substr(2, 9),
          ...category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockProductCategories.push(newCategory);
        resolve(newCategory);
      }, 500);
    });
  },
);

export const updateProductCategory = createAsyncThunk(
  "productCategories/updateProductCategory",
  async (category: ProductCategory) => {
    return new Promise<ProductCategory>((resolve) => {
      setTimeout(() => {
        const index = mockProductCategories.findIndex(
          (c) => c.id === category.id,
        );
        if (index !== -1) {
          mockProductCategories[index] = {
            ...category,
            updatedAt: new Date().toISOString(),
          };
        }
        resolve(mockProductCategories[index]);
      }, 500);
    });
  },
);

export const deleteProductCategories = createAsyncThunk(
  "productCategories/deleteProductCategories",
  async (ids: string[]) => {
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        for (const id of ids) {
          const index = mockProductCategories.findIndex((c) => c.id === id);
          if (index !== -1) {
            mockProductCategories.splice(index, 1);
          }
        }
        resolve(ids);
      }, 500);
    });
  },
);

export const bulkCreateProductCategories = createAsyncThunk(
  "productCategories/bulkCreateProductCategories",
  async (
    categories: Omit<ProductCategory, "id" | "createdAt" | "updatedAt">[],
  ) => {
    return new Promise<ProductCategory[]>((resolve) => {
      setTimeout(() => {
        const newCategories = categories.map((category) => ({
          id: Math.random().toString(36).substr(2, 9),
          ...category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        mockProductCategories.push(...newCategories);
        resolve(newCategories);
      }, 500);
    });
  },
);

const productCategoriesSlice = createSlice({
  name: "productCategories",
  initialState,
  reducers: {
    setSelectedProductCategories: (
      state,
      action: PayloadAction<ProductCategory[]>,
    ) => {
      state.selectedProductCategories = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.productCategories = action.payload;
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch product categories";
      })
      .addCase(addProductCategory.fulfilled, (state, action) => {
        state.productCategories.push(action.payload);
        state.loading = false;
      })
      .addCase(updateProductCategory.fulfilled, (state, action) => {
        const index = state.productCategories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.productCategories[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteProductCategories.fulfilled, (state, action) => {
        state.productCategories = state.productCategories.filter(
          (c) => !action.payload.includes(c.id),
        );
        state.selectedProductCategories = [];
        state.loading = false;
      });
  },
});

export const { setSelectedProductCategories, clearError } =
  productCategoriesSlice.actions;
export default productCategoriesSlice.reducer;
