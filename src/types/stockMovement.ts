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
  sku?: string; // product sku
  invoiceItemId?: string;
  purchaseItemId?: string;
  invoiceNo?: string;
  purchaseNo?: string;
  batchNo?: string; // for adjustment
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  createdAt: string;
  items: StockMovementItem[]; // FIFO breakdown
}

export interface StockMovementsState {
  stockMovements: StockMovement[];
  loading: boolean;
  error: string | null;
}
