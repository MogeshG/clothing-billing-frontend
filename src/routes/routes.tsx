import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../Layouts/Layout";
import { CustomerPage, DashboardPage, LoginPage } from "./pages";

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
      <Suspense fallback={<div>Loading...</div>}>
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
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
