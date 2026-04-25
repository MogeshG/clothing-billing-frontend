export const PERMISSION_MODULES = [
  "Dashboard",
  "Customers",
  "Sales",
  "Suppliers",
  "Stocks",
  "Inventory",
  "Settings",
  "Users",
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];

export interface PermissionFlags {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export type UserPermissions = Record<PermissionModule, PermissionFlags>;

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  permissions: UserPermissions;
  createdAt: string;
  updatedAt: string;
}
