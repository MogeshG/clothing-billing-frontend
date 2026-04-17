/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { useDispatch } from "react-redux";
import { Alert, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteVendors, clearError } from "../../../slices/vendorsSlice";
import { useVendors } from "../../../hooks/useVendors";
import type { Vendor } from "../../../types/vendor";
import CustomButton from "../../../components/CustomButton";
import DeleteVendorDialog from "./DeleteVendorDialog";
import { CustomTable } from "../../../components/CustomTable";
import type { AppDispatch } from "../../../store";
import {
  DeleteOutlined,
  EditOutlined,
  RemoveRedEye,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { vendors, loading, error, refetch } = useVendors();

  // Modals state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [columnPinning, setColumnPinning] = useState({
    left: ["mrt-row-select", "name"],
    right: ["mrt-row-actions"],
  });

  const handleBulkDelete = useCallback(
    async ({ table }: { table: any }) => {
      const selectedIds = table
        .getSelectedRowModel()
        .rows.map((row: any) => row.original.id);
      if (selectedIds.length > 0) {
        try {
          await dispatch(deleteVendors(selectedIds)).unwrap();
          table.resetRowSelection();
          refetch();
        } catch (err) {
          console.error("Bulk delete failed", err);
        }
      }
    },
    [dispatch, refetch],
  );

  const columns = useMemo<MRT_ColumnDef<Vendor>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 150,
      },
      {
        accessorKey: "company_name",
        header: "Company",
      },
      {
        accessorKey: "gstin",
        header: "GSTIN",
        size: 140,
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        accessorKey: "state",
        header: "State",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        Cell: ({ renderedCellValue }) =>
          new Date(renderedCellValue as string).toLocaleDateString(),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Vendors</h1>
        <CustomButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/vendors/add-vendor")}
        >
          Add Vendor
        </CustomButton>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={vendors}
        isLoading={loading}
        enableColumnPinning
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        enableRowSelection
        enableRowActions
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <IconButton
              onClick={() => {
                navigate(`/purchases?vendor_name=${row.original.company_name}`);
              }}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "secondary.main",
                color: "secondary.main",
                borderRadius: 1,
                width: 36,
                height: 36,
              }}
            >
              <RemoveRedEye fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => {
                navigate(`/vendors/edit-vendor/${row.original.id}`);
              }}
              size="small"
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
            <IconButton
              size="small"
              onClick={() => {
                setSelectedVendor(row.original);
                setOpenDeleteDialog(true);
              }}
              sx={{
                border: 1,
                borderColor: "error.main",
                borderRadius: 1,
                color: "error.main",
                width: 36,
                height: 36,
              }}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </div>
        )}
        renderTopToolbarCustomActions={({ table }) => {
          const selectedRows = table.getSelectedRowModel().rows;
          return selectedRows.length > 0 ? (
            <CustomButton
              variant="contained"
              className="bg-red-500! hover:bg-red-600! text-white"
              size="small"
              onClick={() => handleBulkDelete({ table })}
              startIcon={<DeleteIcon />}
            >
              Delete Selected ({selectedRows.length})
            </CustomButton>
          ) : null;
        }}
      />

      <DeleteVendorDialog
        open={openDeleteDialog}
        vendorId={selectedVendor?.id || null}
        onClose={() => setOpenDeleteDialog(false)}
      />
    </div>
  );
};

export default Vendors;
