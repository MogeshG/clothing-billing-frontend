export interface Invoice {
  id: string;
  invoiceNo: string;
  status: "DRAFT" | "COMPLETED" | "CANCELLED";
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  subTotal: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentMethod?: string;
  invoiceDate: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productVariantId?: string;
  productName: string;
  productSku?: string;
  variantSku?: string;
  hsnCode: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  discount: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
  createdAt: string;
}

export interface AddInvoiceForm {
  invoiceNo: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  invoiceDate: string;
  paymentMethod?: string;
  items: Array<{
    productVariantId?: string;
    productName: string;
    productSku?: string;
    variantSku?: string;
    hsnCode: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
    discount: number;
    cgstPercent: number;
    sgstPercent: number;
    igstPercent: number;
  }>;
}
