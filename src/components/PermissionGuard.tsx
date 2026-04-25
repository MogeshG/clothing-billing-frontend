import type { ReactNode } from "react";
import type { PermissionModule, PermissionFlags } from "../types/user";
import { usePermissions } from "../hooks/usePermissions";

interface PermissionGuardProps {
  module: PermissionModule;
  action: keyof PermissionFlags;
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGuard = ({
  module,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(module, action)) {
    return fallback;
  }

  return children;
};

export default PermissionGuard;

