import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "../types/product";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Cotton T-Shirt",
    sku: "TSHIRT-001",
    hsnCode: "6109",
    description: "Premium cotton round neck t-shirt",
    categoryId: "c1",
    categoryName: "Apparel",
    brand: "Basics",
    gstPercent: 5,
    taxInclusive: true,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    variant: [
      {
        id: "v1",
        size: "M",
        color: "Black",
        barcode: "111111",
        sku: "TSHIRT-001-BLK-M",
        costPrice: 200,
        sellingPrice: 399,
        mrp: 499,
        createdAt: "2025-01-10T10:00:00Z",
        updatedAt: "2025-01-10T10:00:00Z",
        isDeleted: false,
      },
      {
        id: "v2",
        size: "L",
        color: "White",
        barcode: "111112",
        sku: "TSHIRT-001-WHT-L",
        costPrice: 210,
        sellingPrice: 429,
        mrp: 499,
        createdAt: "2025-01-10T10:00:00Z",
        updatedAt: "2025-01-10T10:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p2",
    name: "Denim Jeans",
    sku: "JEANS-101",
    hsnCode: "6203",
    description: "Slim fit stretch denim jeans",
    categoryId: "c2",
    categoryName: "Bottomwear",
    brand: "DenimCo",
    gstPercent: 12,
    taxInclusive: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-02-01T09:00:00Z",
    updatedAt: "2025-02-05T09:00:00Z",
    variant: [
      {
        id: "v3",
        size: "32",
        color: "Blue",
        barcode: "222221",
        sku: "JEANS-101-BLU-32",
        costPrice: 700,
        sellingPrice: 1299,
        mrp: 1499,
        createdAt: "2025-02-01T09:00:00Z",
        updatedAt: "2025-02-01T09:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p3",
    name: "Running Shoes",
    sku: "SHOES-201",
    hsnCode: "6404",
    description: "Lightweight running shoes",
    categoryId: "c3",
    categoryName: "Footwear",
    brand: "SportX",
    gstPercent: 18,
    taxInclusive: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-03-10T08:00:00Z",
    updatedAt: "2025-03-12T08:00:00Z",
    variant: [
      {
        id: "v4",
        size: "8",
        color: "Red",
        barcode: "333331",
        sku: "SHOES-201-RED-8",
        costPrice: 1200,
        sellingPrice: 1999,
        mrp: 2499,
        createdAt: "2025-03-10T08:00:00Z",
        updatedAt: "2025-03-10T08:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p4",
    name: "Formal Shirt",
    sku: "SHIRT-401",
    hsnCode: "6205",
    description: "Slim fit formal shirt",
    categoryId: "c1",
    categoryName: "Apparel",
    brand: "UrbanWear",
    gstPercent: 5,
    taxInclusive: true,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-22T10:00:00Z",
    variant: [
      {
        id: "v5",
        size: "L",
        color: "White",
        barcode: "444441",
        sku: "SHIRT-401-WHT-L",
        costPrice: 350,
        sellingPrice: 799,
        mrp: 999,
        createdAt: "2025-01-20T10:00:00Z",
        updatedAt: "2025-01-20T10:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p5",
    name: "Smart Watch",
    sku: "WATCH-501",
    hsnCode: "9102",
    description: "Fitness tracking smart watch",
    categoryId: "c4",
    categoryName: "Electronics",
    brand: "TechTime",
    gstPercent: 18,
    taxInclusive: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-02-15T11:00:00Z",
    updatedAt: "2025-02-16T11:00:00Z",
    variant: [
      {
        id: "v6",
        size: "One Size",
        color: "Black",
        barcode: "555551",
        sku: "WATCH-501-BLK",
        costPrice: 1500,
        sellingPrice: 2999,
        mrp: 3499,
        createdAt: "2025-02-15T11:00:00Z",
        updatedAt: "2025-02-15T11:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p6",
    name: "Backpack",
    sku: "BAG-601",
    hsnCode: "4202",
    description: "Water-resistant travel backpack",
    categoryId: "c5",
    categoryName: "Accessories",
    brand: "TravelPro",
    gstPercent: 12,
    taxInclusive: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-05T07:00:00Z",
    updatedAt: "2025-01-06T07:00:00Z",
    variant: [
      {
        id: "v7",
        size: "Medium",
        color: "Grey",
        barcode: "666661",
        sku: "BAG-601-GRY",
        costPrice: 500,
        sellingPrice: 999,
        mrp: 1299,
        createdAt: "2025-01-05T07:00:00Z",
        updatedAt: "2025-01-05T07:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p7",
    name: "Hoodie",
    sku: "HOOD-701",
    hsnCode: "6110",
    description: "Winter fleece hoodie",
    categoryId: "c1",
    categoryName: "Apparel",
    brand: "WarmWear",
    gstPercent: 5,
    taxInclusive: true,
    isActive: false,
    isDeleted: false,
    createdAt: "2025-01-25T09:00:00Z",
    updatedAt: "2025-02-01T09:00:00Z",
    variant: [
      {
        id: "v8",
        size: "XL",
        color: "Black",
        barcode: "777771",
        sku: "HOOD-701-BLK-XL",
        costPrice: 600,
        sellingPrice: 1199,
        mrp: 1499,
        createdAt: "2025-01-25T09:00:00Z",
        updatedAt: "2025-01-25T09:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p8",
    name: "Wireless Earbuds",
    sku: "EAR-801",
    hsnCode: "8518",
    description: "Noise cancelling earbuds",
    categoryId: "c4",
    categoryName: "Electronics",
    brand: "SoundMax",
    gstPercent: 18,
    taxInclusive: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-03-01T10:00:00Z",
    updatedAt: "2025-03-02T10:00:00Z",
    variant: [
      {
        id: "v9",
        size: "One Size",
        color: "White",
        barcode: "888881",
        sku: "EAR-801-WHT",
        costPrice: 900,
        sellingPrice: 1999,
        mrp: 2499,
        createdAt: "2025-03-01T10:00:00Z",
        updatedAt: "2025-03-01T10:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p9",
    name: "Leather Belt",
    sku: "BELT-901",
    hsnCode: "4203",
    description: "Genuine leather belt",
    categoryId: "c5",
    categoryName: "Accessories",
    brand: "LeatherCraft",
    gstPercent: 12,
    taxInclusive: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-02-10T08:00:00Z",
    updatedAt: "2025-02-12T08:00:00Z",
    variant: [
      {
        id: "v10",
        size: "M",
        color: "Brown",
        barcode: "999991",
        sku: "BELT-901-BRN-M",
        costPrice: 200,
        sellingPrice: 499,
        mrp: 699,
        createdAt: "2025-02-10T08:00:00Z",
        updatedAt: "2025-02-10T08:00:00Z",
        isDeleted: false,
      },
    ],
  },
  {
    id: "p10",
    name: "Sunglasses",
    sku: "SUN-1001",
    hsnCode: "9004",
    description: "UV protection sunglasses",
    categoryId: "c5",
    categoryName: "Accessories",
    brand: "SunGuard",
    gstPercent: 18,
    taxInclusive: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2025-03-05T12:00:00Z",
    updatedAt: "2025-03-06T12:00:00Z",
    variant: [
      {
        id: "v11",
        size: "One Size",
        color: "Black",
        barcode: "101011",
        sku: "SUN-1001-BLK",
        costPrice: 300,
        sellingPrice: 799,
        mrp: 999,
        createdAt: "2025-03-05T12:00:00Z",
        updatedAt: "2025-03-05T12:00:00Z",
        isDeleted: false,
      },
    ],
  },
];

// Thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => resolve(mockProducts), 500);
    });
  },
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    return new Promise<Product>((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          id: Math.random().toString(36).substr(2, 9),
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockProducts.push(newProduct);
        resolve(newProduct);
      }, 500);
    });
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product: Product) => {
    return new Promise<Product>((resolve) => {
      setTimeout(() => {
        const index = mockProducts.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          mockProducts[index] = {
            ...product,
            updatedAt: new Date().toISOString(),
          };
        }
        resolve(mockProducts[index]);
      }, 500);
    });
  },
);

export const deleteProducts = createAsyncThunk(
  "products/deleteProducts",
  async (ids: string[]) => {
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        for (const id of ids) {
          const index = mockProducts.findIndex((p) => p.id === id);
          if (index !== -1) {
            mockProducts.splice(index, 1);
          }
        }
        resolve(ids);
      }, 500);
    });
  },
);

export const bulkCreateProducts = createAsyncThunk(
  "products/bulkCreateProducts",
  async (products: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        const newProducts = products.map((product) => ({
          id: Math.random().toString(36).substr(2, 9),
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        mockProducts.push(...newProducts);
        resolve(newProducts);
      }, 500);
    });
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteProducts.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => !action.payload.includes(p.id),
        );
        state.loading = false;
      })
      .addCase(bulkCreateProducts.fulfilled, (state, action) => {
        state.products.push(...action.payload);
        state.loading = false;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
