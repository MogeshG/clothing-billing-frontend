import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { PermissionModule, PermissionFlags } from "../types/user";

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.app.user);

  const permissions = useMemo(() => {
    return user?.permissions || {};
  }, [user]);

  const hasPermission = (
    module: PermissionModule,
    action: keyof PermissionFlags,
  ): boolean => {
    const modulePerms = permissions[module];
    if (!modulePerms) return false;
    return Boolean(modulePerms[action]);
  };

  const canCreate = (module: PermissionModule) => hasPermission(module, "create");
  const canRead = (module: PermissionModule) => hasPermission(module, "read");
  const canUpdate = (module: PermissionModule) => hasPermission(module, "update");
  const canDelete = (module: PermissionModule) => hasPermission(module, "delete");

  return {
    permissions,
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
  };
};

