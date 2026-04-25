import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../Layouts/Layout";
import {
  AddProductPage,
  AddUserPage,
  AddVendorPage,
  BatchesPage,
  CreatePurchasePage,
  NewStockAdjustmentPage,
  CustomerPage,
  DashboardPage,
  EditProductPage,
  EditUserPage,
  EditVendorPage,
  InventoryPage,
  LoginPage,
  ProductCategoriesPage,
  ProductPage,
  PurchasesPage,
  StockAdjustmentsPage,
  StockMovementsPage,
  UpdateBatchPage,
  UpdatePurchasePage,
  UsersPage,
  VendorsPage,
  ViewPurchasePage,
  SettingsPage,
} from "./pages";
import POSPage from "../pages/private/pos/pos";
import InvoicesPage from "../pages/private/sales/invoices";
import Loader from "../components/CustomLoader";

export const publicRoutes = [
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];

export const privateRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Layout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="pos" replace /> },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: <CustomerPage />,
      },
      {
        path: "vendors",
        element: <VendorsPage />,
      },
      {
        path: "vendors/add-vendor",
        element: <AddVendorPage />,
      },
      {
        path: "vendors/edit-vendor/:id",
        element: <EditVendorPage />,
      },
      {
        path: "purchases",
        element: <PurchasesPage />,
      },
      {
        path: "purchases/create-purchase",
        element: <CreatePurchasePage />,
      },
      {
        path: "purchases/update-purchase/:id",
        element: <UpdatePurchasePage />,
      },
      {
        path: "purchases/view-purchase/:id",
        element: <ViewPurchasePage />,
      },
      {
        path: "batches",
        element: <BatchesPage />,
      },
      {
        path: "batches/update-batch/:id",
        element: <UpdateBatchPage />,
      },
      {
        path: "stock-movements",
        element: <StockMovementsPage />,
      },
      {
        path: "stock-adjustments",
        element: <StockAdjustmentsPage />,
      },
      {
        path: "stock-adjustments/new-adjustment",
        element: <NewStockAdjustmentPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "products/add-product",
        element: <AddProductPage />,
      },
      {
        path: "products/edit-product/:id",
        element: <EditProductPage />,
      },
      {
        path: "product-categories",
        element: <ProductCategoriesPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/create",
        element: <AddUserPage />,
      },
      {
        path: "users/edit/:id",
        element: <EditUserPage />,
      },
      {
        path: "pos",
        element: <POSPage />,
      },
      {
        path: "sales/invoices",
        element: <InvoicesPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
