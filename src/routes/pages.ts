import { lazy } from "react";

export const LoginPage = lazy(() => import("../pages/public/Login"));
export const DashboardPage = lazy(() => import("../pages/private/dashboard"));
export const CustomerPage = lazy(
  () => import("../pages/private/customers/customer"),
);
