/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { useDispatch } from "react-redux";
import { Alert, IconButton, ButtonGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteCustomers, clearError } from "../../../slices/customersSlice";
import { useCustomers } from "../../../hooks/useCustomers";
import type { Customer } from "../../../types/customer";
import CustomButton from "../../../components/CustomButton";
import AddCustomerDialog from "./AddCustomerDialog";
import EditCustomerDialog from "./EditCustomerDialog";
import DeleteCustomerDialog from "./DeleteCustomerDialog";
import BulkCustomerDialog from "./BulkCustomerDialog";
import { CustomTable } from "../../../components/CustomTable";
import type { AppDispatch } from "../../../store";
import { DeleteOutlined, EditOutlined, UploadFile } from "@mui/icons-material";

const Customers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error, refetch } = useCustomers();

  // Modals state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const handleBulkDelete = useCallback(
    async ({ table }: { table: any }) => {
      const selectedIds = table
        .getSelectedRowModel()
        .rows.map((row: any) => row.original.id);
      console.log(selectedIds);
      if (selectedIds.length > 0) {
        try {
          await dispatch(deleteCustomers(selectedIds)).unwrap();
          table.resetRowSelection();
          refetch();
        } catch (err) {
          console.error("Bulk delete failed", err);
        }
      }
    },
    [dispatch, refetch],
  );

  const columns = useMemo<MRT_ColumnDef<Customer>[]>(
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
        accessorKey: "address",
        header: "Address",
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
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <ButtonGroup variant="contained">
          <CustomButton
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
          >
            Add Customer
          </CustomButton>
          <CustomButton onClick={() => setOpenBulkDialog(true)}>
            <UploadFile />
          </CustomButton>
        </ButtonGroup>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      <CustomTable
        columns={columns}
        data={customers}
        isLoading={loading}
        enableRowSelection
        enableRowActions
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <IconButton
              onClick={() => {
                setSelectedCustomer(row.original);
                setOpenEditModal(true);
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
                setSelectedCustomer(row.original);
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

      <AddCustomerDialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
      <EditCustomerDialog
        open={openEditModal}
        customerId={selectedCustomer?.id || null}
        onClose={() => setOpenEditModal(false)}
      />
      <DeleteCustomerDialog
        open={openDeleteDialog}
        customerId={selectedCustomer?.id || null}
        onClose={() => setOpenDeleteDialog(false)}
      />
      <BulkCustomerDialog
        open={openBulkDialog}
        onClose={() => setOpenBulkDialog(false)}
        refetch={refetch}
      />
    </div>
  );
};

export default Customers;
