export interface StockAdjustment {
  id: string;
  productVariantId: string;
  productName: string;
  batchNo: string;
  type: "+" | "-";
  quantity: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface StockAdjustmentsState {
  adjustments: StockAdjustment[];
  loading: boolean;
  error: string | null;
}

export interface BatchForAdjustment {
  id: string;
  batchNo: string;
  productName: string;
  variantSku: string;
  remainingQuantity: number;
  expiryDate?: string;
  status: string; // ACTIVE | EXPIRED | BLOCKED
}
