import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { PermissionFlags, UserPermissions } from "../types/user";
import { PERMISSION_MODULES } from "../types/user";

export interface PermissionMatrixProps {
  permissions: UserPermissions;
  onChange: (
    module: string,
    key: keyof PermissionFlags,
    value: boolean,
  ) => void;
  disabled?: boolean;
}

const PermissionMatrix = ({
  permissions,
  onChange,
  disabled = false,
}: PermissionMatrixProps) => {
  const getModulePermissions = (module: string): PermissionFlags =>
    permissions[module] ?? {
      create: false,
      read: false,
      update: false,
      delete: false,
    };

  const handleFullControlChange = (module: string, checked: boolean) => {
    ["create", "read", "update", "delete"].forEach((key) =>
      onChange(module, key as keyof PermissionFlags, checked),
    );
  };

  return (
    <Box className="overflow-x-auto">
      <TableContainer
        component={Paper}
        className="rounded-xl border border-gray-200"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">Module</TableCell>
              <TableCell className="font-semibold" align="center">
                Create
              </TableCell>
              <TableCell className="font-semibold" align="center">
                Read
              </TableCell>
              <TableCell className="font-semibold" align="center">
                Update
              </TableCell>
              <TableCell className="font-semibold" align="center">
                Delete
              </TableCell>
              <TableCell className="font-semibold" align="center">
                Full Control
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PERMISSION_MODULES.map((module) => {
              const modulePermissions = getModulePermissions(module);
              const fullControl =
                modulePermissions.create &&
                modulePermissions.read &&
                modulePermissions.update &&
                modulePermissions.delete;

              return (
                <TableRow key={module} hover>
                  <TableCell>{module}</TableCell>
                  {(
                    Object.keys(modulePermissions) as Array<
                      keyof PermissionFlags
                    >
                  ).map((key) => (
                    <TableCell key={`${module}-${key}`} align="center">
                      <Checkbox
                        checked={modulePermissions[key]}
                        disabled={disabled}
                        onChange={(event) =>
                          onChange(module, key, event.target.checked)
                        }
                        inputProps={{ "aria-label": `${module}-${key}` }}
                      />
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Checkbox
                      checked={fullControl}
                      disabled={disabled}
                      onChange={(event) =>
                        handleFullControlChange(module, event.target.checked)
                      }
                      inputProps={{ "aria-label": `${module}-full-control` }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PermissionMatrix;
