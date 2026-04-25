export interface Batch {
  id: string;
  productVariantId: string;
  productName: string;
  variantSku: string;
  hsnCode: string;
  batchNo: string;
  barcode: string;
  status: "PENDING" | "ACTIVE" | "BLOCKED" | "EXPIRED";
  purchaseItemId?: string;
  purchaseNo?: string;
  vendorName?: string;
  purchaseDate: string;
  purchasePrice: number;
  mrp: number;
  sellingPrice: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  taxInclusive: boolean;
  quantity: number;
  remainingQuantity: number;
  manufactureDate?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBatchForm {
  status: string;
  sellingPrice?: number;
  mrp?: number;
  manufactureDate?: string;
  expiryDate?: string;
  batchNo?: string;
  barcode?: string;
}
