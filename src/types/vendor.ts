export interface Vendor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  companyName: string;
  city?: string;
  state?: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddVendorForm {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  companyName: string;
  city?: string;
  state?: string;
  country?: string;
}
