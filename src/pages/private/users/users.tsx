import { useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { Alert, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import { CustomTable } from "../../../components/CustomTable";
import { useUsers } from "../../../hooks/useUsers";
import type { User } from "../../../types/user";
import PermissionGuard from "../../../components/PermissionGuard";

const UsersPage = () => {
  const navigate = useNavigate();
  const { users, loading, error } = useUsers();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        header: "Created",
        Cell: ({ renderedCellValue }) =>
          renderedCellValue
            ? new Date(renderedCellValue as string).toLocaleDateString()
            : "-",
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-sm text-gray-500">
            Manage team members and assign module permissions.
          </p>
        </div>
        <PermissionGuard module="Users" action="create">
          <CustomButton
            startIcon={<AddIcon />}
            onClick={() => navigate("/users/create")}
          >
            Add User
          </CustomButton>
        </PermissionGuard>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <CustomTable
        columns={columns}
        data={users}
        isLoading={loading}
        enableRowActions
        renderRowActions={({ row }) => (
          <PermissionGuard module="Users" action="update">
            <IconButton
              size="small"
              onClick={() => navigate(`/users/edit/${row.original.id}`)}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                borderRadius: 1,
                width: 36,
                height: 36,
              }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </PermissionGuard>
        )}
      />
    </div>
  );
};

export default UsersPage;
