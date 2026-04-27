/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Chip, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import dayjs from "dayjs";
import formatRupee from "../../../utils/formatRupee";
import { CustomTable } from "../../../components/CustomTable";
import type { MRT_ColumnDef } from "material-react-table";
import ViewInvoiceDrawer from "./viewInvoiceDrawer";
import type { Invoice } from "../../../types/invoice";
import { useInvoices } from "../../../hooks/useInvoices";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import PermissionGuard from "../../../components/PermissionGuard";
import { InlineLoader } from "../../../components/CustomLoader";

const InvoicesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    invoices,
    drafts,
    loading,
    error,
    refetch,
    clearError,
    deleteInvoice,
  } = useInvoices();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const allInvoices = useMemo(() => {
    const combined = [...invoices, ...drafts];
    return combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [invoices, drafts]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this invoice?"))
        return;
      try {
        await dispatch(deleteInvoice(id)).unwrap();
        refetch();
      } catch (err) {
        console.error("Delete invoice failed", err);
      }
    },
    [dispatch, deleteInvoice, refetch],
  );

  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceNo",
        header: "Invoice No",
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        Cell: ({ row }) => (
          <div>
            <div>{row.original.customerName || "Walk-in"}</div>
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
            row.original.status === "COMPLETED"
              ? "success"
              : row.original.status === "DRAFT"
                ? "warning"
                : "error";
          return (
            <Chip
              label={row.original.status}
              color={color as any}
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
        accessorKey: "totalAmount",
        header: "Total",
        Cell: ({ row }) => (
          <strong className="text-green-600">
            {formatRupee(row.original.totalAmount)}
          </strong>
        ),
      },
      {
        accessorKey: "invoiceDate",
        header: "Date",
        Cell: ({ row }) =>
          dayjs(row.original.invoiceDate).format("MMM DD, YYYY"),
        size: 140,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {loading && <InlineLoader label="Loading invoices..." />}

      <CustomTable
        columns={columns}
        data={allInvoices}
        isLoading={loading}
        enableRowSelection={false}
        enableRowActions
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedInvoice(row.original);
                setDrawerOpen(true);
              }}
              title="View Invoice"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            {row.original.status !== "COMPLETED" && (
              <PermissionGuard module="Sales" action="delete">
                <IconButton
                  size="small"
                  onClick={() => handleDelete(row.original.id)}
                  title="Delete Invoice"
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
            )}
          </div>
        )}
      />

      <ViewInvoiceDrawer
        invoice={selectedInvoice}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default InvoicesPage;
