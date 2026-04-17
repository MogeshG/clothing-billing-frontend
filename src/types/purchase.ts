export interface Purchase {
  id: string;
  purchaseNo: string;
  status: "DRAFT" | "COMPLETED" | "CANCELLED";
  vendorName?: string;
  vendorPhone?: string;
  vendorGstin?: string;
  subTotal: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productVariantId?: string;
  itemName: string;
  itemType: string;
  sku?: string;
  size?: string;
  color?: string;
  hsnCode: string;
  quantity: number;
  price: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  total: number;
  createdAt: string;
}

export interface AddPurchaseForm {
  purchaseNo: string;
  vendorName?: string;
  vendorPhone?: string;
  vendorGstin?: string;
  purchaseDate: string;
  items: Array<{
    itemName: string;
    itemType: string;
    sku?: string;
    size?: string;
    color?: string;
    hsnCode: string;
    quantity: number;
    price: number;
    cgstPercent: number;
    sgstPercent: number;
    igstPercent: number;
  }>;
}

export interface UpdatePurchaseForm {
  purchaseNo?: string;
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
  vendorName?: string;
  vendorPhone?: string;
  vendorGstin?: string;
  subTotal?: number;
  discount?: number;
  taxAmount?: number;
  totalAmount?: number;
  purchaseDate?: string;
}
