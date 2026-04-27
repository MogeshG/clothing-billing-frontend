export type Product = {
  id: string;
  name: string;
  sku?: string;
  hsnCode: string;
  description?: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  categoryName: string;
  brand?: string | null;

  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  taxInclusive: boolean;

  isActive: boolean;
  variant: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  barcode: string;
  sku: string | null;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type ProductVariantInput = {
  size: string;
  color: string;
  // barcode: string;
  sku?: string | null;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
};

export type AddProductForm = {
  name: string;
  sku?: string;
  hsnCode: string;
  description?: string | null;
  categoryId: string;
  brand?: string | null;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  taxInclusive: boolean;
  variants: ProductVariantInput[];
};
