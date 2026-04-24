export interface StockMovementItem {
  id: string;
  stockMovementId: string;
  batchId: string;
  batchNo: string;
  quantity: number;
}

export interface StockMovement {
  id: string;
  productVariantId: string;
  productName: string;
  variantSku?: string;
  invoiceItemId?: string;
  purchaseItemId?: string;
  invoiceNo?: string;
  purchaseNo?: string;
  batchNo?: string; // for adjustment reference
  type: "PURCHASE" | "SALE" | "ADJUSTMENT";
  quantity: number;
  unit?: string;
  createdAt: string;
  items: StockMovementItem[]; // FIFO breakdown
}

export interface StockMovementsState {
  stockMovements: StockMovement[];
  loading: boolean;
  error: string | null;
}
