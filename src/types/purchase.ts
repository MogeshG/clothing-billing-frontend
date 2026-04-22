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
  costPrice: number;
  cgstPercent?: number;
  sgstPercent?: number;
  igstPercent?: number;
  mrp?: number;
  sellingPrice?: number;
  total: number;
  createdAt: string;
}

export interface AddPurchaseForm {
  purchaseNo: string;
  vendorName?: string;
  vendorPhone?: string;
  vendorGstin?: string;
  discount?: number;
  purchaseDate: string;
  items: Array<{
    itemName: string;
    itemType: string;
    sku?: string;
    size?: string;
    color?: string;
    hsnCode: string;
    quantity: number;
    cgstPercent?: number;
    sgstPercent?: number;
    igstPercent?: number;
    mrp?: number;
    sellingPrice?: number;
    costPrice: number;
    taxInclusive?: boolean;
  }>;
}

export interface UpdatePurchaseForm extends AddPurchaseForm {
  id: string;
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
}

export type ItemForm = {
  itemName: string;
  itemType: "RAW" | "FINISHED";
  hsnCode: string;
  quantity: number;
  costPrice: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  total: number;
  sku?: string;
  size?: string;
  color?: string;
  productVariantId?: string;
  unitId: string;
  unitName: string;
  unitSymbol: string;
  taxInclusive?: boolean;
  mrp?: number;
  sellingPrice?: number;
};
