import React, { useMemo, useState } from "react";
import { Alert, Chip, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import formatRupee from "../../../utils/formatRupee";
import { CustomTable } from "../../../components/CustomTable";
import type { MRT_ColumnDef } from "material-react-table";
import type { SalesReturn } from "../../../types/salesReturn";
import { useSalesReturn } from "../../../hooks/useSalesReturn";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import PermissionGuard from "../../../components/PermissionGuard";
import CustomButton from "../../../components/CustomButton";
import { useNavigate } from "react-router-dom";
import ViewSalesReturn from "./view-sales-return";
import SalesReturnConfirmDialog from "./SalesReturnConfirmDialog";

const SalesReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { salesReturns, loading, error, refetch, clearError } =
    useSalesReturn();
  const [columnPinning, setColumnPinning] = useState({
    left: ["mrt-row-select", "salesReturnNo", "invoice.invoiceNo"],
    right: ["mrt-row-actions"],
  });

  const [selectedSalesReturn, setSelectedSalesReturn] =
    useState<SalesReturn | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "approve" | "delete";
    id: string;
  }>({ open: false, action: "approve", id: "" });

  const handleApprove = (id: string) => {
    setConfirmDialog({ open: true, action: "approve", id });
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({ open: true, action: "delete", id });
  };

  const columns = useMemo<MRT_ColumnDef<SalesReturn>[]>(
    () => [
      {
        accessorKey: "salesReturnNo",
        header: "Sales Return No",
      },
      {
        accessorKey: "invoice.invoiceNo",
        header: "Invoice No",
        Cell: ({ row }) => (
          <span>{row.original.invoice?.invoiceNo || "—"}</span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        Cell: ({ row }) => (
          <div>
            {row.original.customerName}
            {row.original.customerPhone && (
              <div className="text-xs text-gray-500">
                {row.original.customerPhone}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => {
          const color =
            row.original.status === "APPROVED" ? "success" : "warning";
          return (
            <Chip
              label={row.original.status}
              color={color as "success" | "warning"}
              size="small"
            />
          );
        },
      },
      {
        accessorKey: "items",
        header: "Items",
        Cell: ({ row }) => <span>{row.original.items.length}</span>,
        size: 120,
      },
      {
        accessorKey: "totalRefund",
        header: "Total Refund",
        Cell: ({ row }) => (
          <strong className="text-green-600">
            {formatRupee(row.original.totalRefund)}
          </strong>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        Cell: ({ row }) => dayjs(row.original.createdAt).format("MMM DD, YYYY"),
        size: 140,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Sales Return</h1>
        <PermissionGuard module="Sales" action="create">
          <CustomButton
            startIcon={<AddIcon />}
            onClick={() => navigate("/sales/sales-return/create")}
          >
            New Sales Return
          </CustomButton>
        </PermissionGuard>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={salesReturns}
        isLoading={loading}
        enableRowSelection={false}
        enableColumnPinning
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        enableRowActions
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedSalesReturn(row.original);
                setDrawerOpen(true);
              }}
              title="View Sales Return"
              sx={{
                border: "1px solid",
                borderColor: "secondary.main",
                color: "secondary.main",
                borderRadius: 1,
                width: 36,
                height: 36,
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            {row.original.status === "DRAFT" && (
              <>
                <PermissionGuard module="Sales" action="update">
                  <IconButton
                    size="small"
                    onClick={() => handleApprove(row.original.id)}
                    title="Approve Sales Return"
                    sx={{
                      border: 1,
                      borderColor: "success.main",
                      borderRadius: 1,
                      color: "success.main",
                      width: 36,
                      height: 36,
                    }}
                  >
                    <CheckCircle fontSize="small" />
                  </IconButton>
                </PermissionGuard>
                <PermissionGuard module="Sales" action="delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(row.original.id)}
                    title="Delete Sales Return"
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
                </PermissionGuard>
              </>
            )}
          </div>
        )}
      />

      <ViewSalesReturn
        salesReturn={selectedSalesReturn}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <SalesReturnConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        action={confirmDialog.action}
        salesReturnId={confirmDialog.id}
        onSuccess={refetch}
      />
    </div>
  );
};

export default SalesReturnsPage;
