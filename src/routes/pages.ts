import { lazy } from "react";

export const LoginPage = lazy(() => import("../pages/public/Login.tsx"));
export const DashboardPage = lazy(
  () => import("../pages/private/dashboard.tsx"),
);
export const CustomerPage = lazy(
  () => import("../pages/private/customers/customer.tsx"),
);

export const InventoryPage = lazy(
  () => import("../pages/private/inventory/inventory.tsx"),
);
export const ProductPage = lazy(
  () => import("../pages/private/products/products.tsx"),
);
export const AddProductPage = lazy(
  () => import("../pages/private/products/add-product.tsx"),
);
export const EditProductPage = lazy(
  () => import("../pages/private/products/edit-product.tsx"),
);

export const ProductCategoriesPage = lazy(
  () => import("../pages/private/product-categories/product-categories.tsx"),
);

export const VendorsPage = lazy(
  () => import("../pages/private/vendors/vendors.tsx"),
);
export const AddVendorPage = lazy(
  () => import("../pages/private/vendors/add-vendor.tsx"),
);
export const EditVendorPage = lazy(
  () => import("../pages/private/vendors/edit-vendor.tsx"),
);
export const PurchasesPage = lazy(
  () => import("../pages/private/purchases/purchases.tsx"),
);
export const CreatePurchasePage = lazy(
  () => import("../pages/private/purchases/create-purchase.tsx"),
);
export const UpdatePurchasePage = lazy(
  () => import("../pages/private/purchases/update-purchase.tsx"),
);
export const ViewPurchasePage = lazy(
  () => import("../pages/private/purchases/view-purchase.tsx"),
);

export const BatchesPage = lazy(
  () => import("../pages/private/batches/batches.tsx"),
);
export const UpdateBatchPage = lazy(
  () => import("../pages/private/batches/update-batch.tsx"),
);

export const StockMovementsPage = lazy(
  () => import("../pages/private/stock-movements/stock-movements.tsx"),
);

export const StockAdjustmentsPage = lazy(
  () => import("../pages/private/stock-adjustments/stock-adjustments.tsx"),
);
export const NewStockAdjustmentPage = lazy(
  () => import("../pages/private/stock-adjustments/new-adjustment.tsx"),
);
