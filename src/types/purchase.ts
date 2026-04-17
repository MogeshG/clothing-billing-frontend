export interface Purchase {
  id: string;
  purchase_no: string;
  status: "DRAFT" | "COMPLETED" | "CANCELLED";
  vendor_name?: string;
  vendor_phone?: string;
  vendor_gstin?: string;
  sub_total: number;
  discount: number;
  tax_amount: number;
  total_amount: number;
  purchase_date: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_variant_id?: string;
  item_name: string;
  item_type: string;
  sku?: string;
  size?: string;
  color?: string;
  hsn_code: string;
  quantity: number;
  price: number;
  cgst_percent: number;
  sgst_percent: number;
  igst_percent: number;
  total: number;
  createdAt: string;
}

export interface AddPurchaseForm {
  purchase_no: string;
  vendor_name?: string;
  vendor_phone?: string;
  vendor_gstin?: string;
  purchase_date: string;
  items: Array<{
    item_name: string;
    item_type: string;
    sku?: string;
    size?: string;
    color?: string;
    hsn_code: string;
    quantity: number;
    price: number;
    cgst_percent: number;
    sgst_percent: number;
    igst_percent: number;
  }>;
}

export interface UpdatePurchaseForm {
  purchase_no?: string;
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
  vendor_name?: string;
  vendor_phone?: string;
  vendor_gstin?: string;
  sub_total?: number;
  discount?: number;
  tax_amount?: number;
  total_amount?: number;
  purchase_date?: string;
}
