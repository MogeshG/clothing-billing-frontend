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

export const VendorsPage = lazy(
  () => import("../pages/private/vendors/vendors"),
);
export const AddVendorPage = lazy(
  () => import("../pages/private/vendors/add-vendor"),
);
export const EditVendorPage = lazy(
  () => import("../pages/private/vendors/edit-vendor"),
);
export const PurchasesPage = lazy(
  () => import("../pages/private/purchases/purchases"),
);
export const CreatePurchasePage = lazy(
  () => import("../pages/private/purchases/create-purchase"),
);
export const UpdatePurchasePage = lazy(
  () => import("../pages/private/purchases/update-purchase"),
);
export const ViewPurchasePage = lazy(
  () => import("../pages/private/purchases/view-purchase"),
);

export const BatchesPage = lazy(
  () => import("../pages/private/batches/batches"),
);
export const UpdateBatchPage = lazy(
  () => import("../pages/private/batches/update-batch"),
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
