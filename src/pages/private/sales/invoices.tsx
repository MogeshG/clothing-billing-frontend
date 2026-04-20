/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { Chip, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import formatRupee from "../../../utils/formatRupee";
import { CustomTable } from "../../../components/CustomTable";
import type { MRT_ColumnDef } from "material-react-table";
import ViewInvoiceDrawer from "./viewInvoiceDrawer";
import type { Invoice } from "../../../types/invoice";

import { mockInvoices } from "./mockInvoices";

const InvoicesPage: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>

      <CustomTable
        columns={columns}
        data={mockInvoices}
        enableRowSelection={false}
        enableRowActions
        renderRowActions={({ row }) => (
          <IconButton
            size="small"
            onClick={() => {
              setSelectedInvoice(row.original.id);
              setDrawerOpen(true);
            }}
            title="View Invoice"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        )}
      />

      <ViewInvoiceDrawer
        invoiceId={selectedInvoice || ""}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default InvoicesPage;
