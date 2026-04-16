import { lazy } from "react";

export const LoginPage = lazy(() => import("../pages/public/Login"));
export const DashboardPage = lazy(() => import("../pages/private/dashboard"));
export const CustomerPage = lazy(
  () => import("../pages/private/customers/customer"),
);

export const InventoryPage = lazy(
  () => import("../pages/private/inventory/inventory"),
);
export const ProductPage = lazy(
  () => import("../pages/private/products/products"),
);
export const AddProductPage = lazy(
  () => import("../pages/private/products/add-product"),
);
export const EditProductPage = lazy(
  () => import("../pages/private/products/edit-product"),
);

export const ProductCategoriesPage = lazy(
  () => import("../pages/private/product-categories/product-categories"),
);
