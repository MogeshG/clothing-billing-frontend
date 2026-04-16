import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../Layouts/Layout";
import {
  AddProductPage,
  CustomerPage,
  DashboardPage,
  InventoryPage,
  LoginPage,
  ProductPage,
} from "./pages";
import EditProductPage from "../pages/private/products/edit-product";
import Loader from "../components/CustomLoader";

export const publicRoutes = [
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
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
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: <CustomerPage />,
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
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
