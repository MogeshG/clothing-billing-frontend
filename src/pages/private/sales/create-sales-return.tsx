import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Alert,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { MRT_ColumnDef } from "material-react-table";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import { CustomTable } from "../../../components/CustomTable";
import { useSalesReturnActions } from "../../../hooks/useSalesReturn";
import { useInvoices } from "../../../hooks/useInvoices";
import { useProducts } from "../../../hooks/useProducts";
import type { Invoice } from "../../../types/invoice";
import type { AddSalesReturnForm } from "../../../types/salesReturn";
import CustomSearch from "../../../components/CustomSearch";

interface LineItem {
  id: string;
  productName: string;
  productSku: string;
  batchNo?: string;
  quantity: number;
  unit: string;
  refundAmount: number;
  maxQuantity?: number; // original invoice quantity limit
}

const emptyItem = (): LineItem => ({
  id: crypto.randomUUID(),
  productName: "",
  productSku: "",
  quantity: 1,
  unit: "pcs",
  refundAmount: 0,
});

const CreateSalesReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const { createSalesReturn } = useSalesReturnActions();
  const { invoices } = useInvoices();
  const { products } = useProducts();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [reason, setReason] = useState("");
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const completedInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === "COMPLETED"),
    [invoices],
  );

  /* Populate / clear customer & line items when invoice selection changes */
  useEffect(() => {
    if (selectedInvoice) {
      setCustomerName(selectedInvoice.customerName || "");
      setCustomerPhone(selectedInvoice.customerPhone || "");
      setItems(
        selectedInvoice.items.map((item) => ({
          id: crypto.randomUUID(),
          productName: item.productName,
          productSku: item.productSku || item.variantSku || "",
          batchNo: item.batchNo || undefined,
          quantity: item.quantity,
          unit: "pcs",
          refundAmount: item.price,
          maxQuantity: item.quantity,
        })),
      );
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setItems([emptyItem()]);
    }
  }, [selectedInvoice]);

  const totalRefund = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (Number(item.refundAmount) || 0) * (Number(item.quantity) || 0),
        0,
      ),
    [items],
  );

  const addItem = () => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === "quantity" && item.maxQuantity !== undefined) {
          const num = Number(value);
          if (num > item.maxQuantity) {
            return { ...item, [field]: item.maxQuantity };
          }
        }
        return { ...item, [field]: value };
      }),
    );
  };

  const handleSubmit = async () => {
    setError(null);

    if (!selectedInvoice) {
      setError("Please select an invoice");
      return;
    }
    if (!customerName.trim()) {
      setError("Customer name is required");
      return;
    }
    if (items.length === 0) {
      setError("At least one item is required");
      return;
    }
    for (const item of items) {
      if (!item.productName.trim()) {
        setError("Product name is required for all items");
        return;
      }
      if (item.quantity < 1) {
        setError("Quantity must be at least 1");
        return;
      }
      if (item.maxQuantity !== undefined && item.quantity > item.maxQuantity) {
        setError(
          `Quantity for "${item.productName}" cannot exceed ${item.maxQuantity}`,
        );
        return;
      }
      if (item.refundAmount < 0) {
        setError("Refund amount cannot be negative");
        return;
      }
      if (!item.unit.trim()) {
        setError("Unit is required for all items");
        return;
      }
    }

    const payload: AddSalesReturnForm = {
      invoiceId: selectedInvoice.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      reason: reason.trim() || undefined,
      totalRefund,
      items: items.map((item) => ({
        productName: item.productName.trim(),
        productSku: item.productSku.trim() || undefined,
        batchNo: item.batchNo || undefined,
        quantity: Number(item.quantity),
        unit: item.unit.trim(),
        refundAmount: Number(item.refundAmount),
      })),
    };

    setSubmitting(true);
    try {
      await createSalesReturn(payload);
      navigate("/sales/sales-return");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create sales return";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const itemColumns = useMemo<MRT_ColumnDef<LineItem>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Product Name",
        size: 250,
        Cell: ({ row }) => (
          <CustomSearch
            data={products}
            value={
              products.find((p) => p.name === row.original.productName) || null
            }
            inputValue={row.original.productName}
            getLabel={(product) => product.name}
            onChange={(val) => updateItem(row.original.id, "productName", val)}
            onSelect={(product) =>
              setItems((prev) =>
                prev.map((item) =>
                  item.id === row.original.id
                    ? {
                        ...item,
                        productName: product?.name || "",
                        productSku: product?.sku || "",
                      }
                    : item,
                ),
              )
            }
            label=""
            className="w-full"
            placeholder="Search product..."
          />
        ),
      },
      {
        accessorKey: "productSku",
        header: "SKU",
        Cell: ({ row }) => (
          <CustomInput
            value={row.original.productSku}
            disabled
            placeholder="SKU"
          />
        ),
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        size: 110,
        Cell: ({ row }) => (
          <div style={{ width: 90 }}>
            <CustomInput
              type="number"
              value={row.original.quantity}
              onChange={(e) =>
                updateItem(row.original.id, "quantity", Number(e.target.value))
              }
              errorText={
                row.original.maxQuantity !== undefined
                  ? `Max: ${row.original.maxQuantity}`
                  : undefined
              }
            />
          </div>
        ),
      },
      {
        accessorKey: "unit",
        header: "Unit",
        size: 110,
        Cell: ({ row }) => (
          <div style={{ width: 80 }}>
            <CustomInput value={row.original.unit} disabled />
          </div>
        ),
      },
      {
        accessorKey: "refundAmount",
        header: "Refund / Unit",
        size: 150,
        Cell: ({ row }) => (
          <div style={{ width: 120 }}>
            <CustomInput
              type="number"
              value={row.original.refundAmount}
              onChange={(e) =>
                updateItem(
                  row.original.id,
                  "refundAmount",
                  Number(e.target.value),
                )
              }
            />
          </div>
        ),
      },
    ],
    [products],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex items-center gap-2">
        <IconButton onClick={() => navigate("/sales/sales-return")}>
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-3xl font-bold text-gray-900">New Sales Return</h1>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Invoice Details
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <CustomSearch
              data={completedInvoices}
              value={selectedInvoice}
              getLabel={(option) =>
                `${option.invoiceNo} — ${option.customerName || "Walk-in"}`
              }
              onSelect={(newValue) => setSelectedInvoice(newValue)}
              label="Select Invoice"
              placeholder="Search invoice..."
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <CustomInput
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4, lg: 4 }}>
            <CustomInput
              label="Customer Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInput
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Items
        </Typography>

        <CustomTable
          columns={itemColumns}
          data={items}
          enableRowSelection={false}
          enableGlobalFilter={false}
          enableColumnFilters={false}
          enableSorting={false}
          enablePagination={false}
          enableRowActions
          renderRowActions={({ row }) => (
            <IconButton
              size="small"
              color="error"
              onClick={() => removeItem(row.original.id)}
              disabled={items.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          )}
        />

        <Grid container spacing={2} className="items-center" sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomButton
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addItem}
            >
              Add Item
            </CustomButton>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "right" }}>
            <Typography variant="h6">
              Total Refund: ₹{totalRefund.toLocaleString("en-IN")}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2} className="justify-end">
          <Grid size={{ xs: 12, md: "auto" }}>
            <CustomButton
              variant="outlined"
              onClick={() => navigate("/sales/sales-return")}
            >
              Cancel
            </CustomButton>
          </Grid>
          <Grid size={{ xs: 12, md: "auto" }}>
            <CustomButton onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Creating..." : "New Sales Return"}
            </CustomButton>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CreateSalesReturnPage;
