import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ProductCategory,
  AddProductCategoryForm,
} from "../types/productCategory";
import api from "../utils/api";

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

export const fetchProductCategories = createAsyncThunk(
  "productCategories/fetchProductCategories",
  async () => {
    const response = await api.get(`/categories`);
    return response.data;
  },
);

export const addProductCategory = createAsyncThunk(
  "productCategories/addProductCategory",
  async (
    categoryData: AddProductCategoryForm,
    { rejectWithValue },
  ): Promise<ProductCategory> => {
    try {
      const response = await api.post("/categories", categoryData);
      return response.data.category;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to add category") as never;
    }
  },
);

export const updateProductCategory = createAsyncThunk(
  "productCategories/updateProductCategory",
  async (
    category: Partial<ProductCategory> & { id: string },
    { rejectWithValue },
  ): Promise<ProductCategory> => {
    try {
      const response = await api.put(`/categories/${category.id}`, category);
      return response.data.category;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(
        err.message || "Failed to update category",
      ) as never;
    }
  },
);

export const deleteProductCategories = createAsyncThunk(
  "productCategories/deleteProductCategories",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const promises = ids.map((id) => api.delete(`/categories/${id}`));
      await Promise.all(promises);
      return ids;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message || "Failed to delete categories");
    }
  },
);

export const bulkCreateProductCategories = createAsyncThunk(
  "productCategories/bulkCreateProductCategories",
  async (
    categories: AddProductCategoryForm[],
    { rejectWithValue },
  ): Promise<ProductCategory[]> => {
    try {
      const promises = categories.map((categoryData) =>
        api.post("/categories", categoryData),
      );
      const responses = await Promise.all(promises);
      return responses.map((res) => res.data.category);
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(
        err.message || "Failed to bulk create categories",
      ) as never;
    }
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
          (action.payload as string) || "Failed to fetch product categories";
      })
      .addCase(addProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductCategory.fulfilled, (state, action) => {
        state.productCategories.unshift(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductCategory.fulfilled, (state, action) => {
        const index = state.productCategories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.productCategories[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProductCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductCategories.fulfilled, (state, action) => {
        state.productCategories = state.productCategories.filter(
          (c) => !action.payload.includes(c.id),
        );
        state.selectedProductCategories = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteProductCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bulkCreateProductCategories.fulfilled, (state, action) => {
        state.productCategories.unshift(...action.payload);
        state.loading = false;
      });
  },
});

export const { setSelectedProductCategories, clearError } =
  productCategoriesSlice.actions;
export default productCategoriesSlice.reducer;

