export interface SalesReturn {
  id: string;
  salesReturnNo: string;
  invoiceId: string;
  customerName: string;
  customerPhone?: string;
  totalRefund: number;
  reason?: string;
  status: "DRAFT" | "APPROVED";
  createdAt: string;
  updatedAt?: string;
  items: SalesReturnItem[];
  invoice?: {
    id: string;
    invoiceNo: string;
    customerName?: string;
    customerPhone?: string;
    totalAmount: number;
    status: string;
  };
}

export interface SalesReturnItem {
  id: string;
  salesReturnId: string;
  productName: string;
  productSku?: string;
  batchNo?: string;
  quantity: number;
  unit: string;
  refundAmount: number;
  createdAt: string;
}

export interface AddSalesReturnForm {
  salesReturnNo?: string;
  invoiceId: string;
  customerName: string;
  customerPhone?: string;
  totalRefund?: number;
  reason?: string;
  items: Array<{
    productName: string;
    productSku?: string;
    batchNo?: string;
    quantity: number;
    unit: string;
    refundAmount: number;
  }>;
}
