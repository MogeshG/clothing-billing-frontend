export type ItemForm = {
  productName: string;
  productSku?: string;
  variantId?: string;
  variantSku?: string;
  barcode?: string;
  hsnCode: string;
  batchNo?: string;
  expiryDate?: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  discount: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  total: number;
};
