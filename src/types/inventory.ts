export interface Batch {
  id: string;
  productVariantId: string;
  batchNo: string;
  purchasePrice: number;
  sellingPrice?: number;
  quantity: number;
  remainingQuantity: number;
  manufactureDate?: string;
  expiryDate?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku?: string;
  price?: number;
  costPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  brand?: string;
  barcode?: string;
  basePrice: number;
  costPrice?: number;
  mrp: number;
  gstPercent: number;
  taxInclusive: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory extends Batch {
  id: string;
  productVariantId: string;
  batchNo: string;
  product: Product;
  variant: ProductVariant;
  purchasePrice: number;
  sellingPrice?: number;
  quantity: number;
  remainingQuantity: number;
  manufactureDate?: string;
  expiryDate?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  sku?: string;
  price?: number;
  costPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  brand?: string;
  barcode?: string;
  basePrice: number;
  costPrice?: number;
  mrp: number;
  gstPercent: number;
  taxInclusive: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory extends Batch {
  product: Product;
  variant: ProductVariant;
}
