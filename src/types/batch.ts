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
  mrp: string;
  sellingPrice: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
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
  manufactureDate?: string;
  expiryDate?: string;
}
