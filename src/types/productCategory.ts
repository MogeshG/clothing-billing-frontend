export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddProductCategoryForm {
  name: string;
  description?: string;
}
