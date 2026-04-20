/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Grid, IconButton } from "@mui/material";
import { addInvoice, clearError } from "../../../slices/invoicesSlice";
import { useInvoices } from "../../../hooks/useInvoices";

import { useCustomers } from "../../../hooks/useCustomers";
// import { useInventory } from "../../../hooks/useInventory";
import type { AddInvoiceForm } from "../../../types/invoice";
import type { Batch } from "../../../types/batch";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import CustomSearch from "../../../components/CustomSearch";
// Removed CustomTable - using native Grid
import Stepper from "../../../components/CustomStepper";
import ProductCard from "../../../components/ProductCard";
import type { ItemForm } from "./ItemForm";
import { useBatches } from "../../../hooks/useBatches";
import CustomDatePicker from "../../../components/CustomDatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AppDispatch } from "../../../store";
import type { Customer } from "../../../types/customer";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import formatRupee from "../../../utils/formatRupee";

const POSPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useInvoices();

  const { customers } = useCustomers();
  const { batches, loading: batchesLoading } = useBatches();
  const [batchSearch, setBatchSearch] = useState("");
  const [formData, setFormData] = useState<Partial<AddInvoiceForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<ItemForm[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
  } | null>(null);

  // Auto generate invoiceNo
  useEffect(() => {
    const dateStr = dayjs().format("YYYYMMDD");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      invoiceNo: `INV-${dateStr}-${randomStr}`,
    }));
  }, []);

  const filteredBatches = useMemo(() => {
    return batches
      .filter(
        (batch: Batch) =>
          batch.productName.toLowerCase().includes(batchSearch.toLowerCase()) ||
          batch.batchNo.toLowerCase().includes(batchSearch.toLowerCase()) ||
          batch.barcode.toLowerCase().includes(batchSearch.toLowerCase()),
      )
      .slice(0, 10);
  }, [batches, batchSearch]);

  const handleAddBatch = useCallback(
    (batch: Batch, qty: number) => {
      if (qty <= 0 || batch.remainingQuantity <= 0) return;

      // Check if batch already exists, update quantity
      const existingIndex = items.findIndex((item) => item.batchNo === batch.batchNo);
      const newItem: ItemForm = {
        productName: batch.productName,
        variantSku: batch.variantSku || "",
        barcode: batch.barcode,
        hsnCode: batch.hsnCode,
        batchNo: batch.batchNo,
        expiryDate: batch.expiryDate,
        quantity: qty,
        price: batch.sellingPrice,
        discount: 0,
        cgstPercent: batch.cgstPercent,
        sgstPercent: batch.sgstPercent,
        igstPercent: batch.igstPercent,
        total: 0,
      };
      // Recalc total
      newItem.total =
        (newItem.price * newItem.quantity - newItem.discount) *
        (1 + (newItem.cgstPercent + newItem.sgstPercent + newItem.igstPercent) / 100);

      if (existingIndex >= 0) {
        // Update existing
        const newItems = [...items];
        newItems[existingIndex] = newItem;
        setItems(newItems);
      } else {
        // Add new
        setItems((prev) => [...prev, newItem]);
      }
    },
    [items],
  );

  const calculateTotals = useMemo(() => {
    // productName: batch.productName,
    // variantSku: batch.variantSku,
    // mrp: batch.mrp,
    // barcode: batch.barcode,
    // hsnCode: batch.hsnCode,
    // batchNo: batch.batchNo,
    // expiryDate: batch.expiryDate,
    // quantity: qty,
    // price: batch.sellingPrice,
    // discount: 0,
    // cgstPercent: batch.cgstPercent,
    // sgstPercent: batch.sgstPercent,

    const subTotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity - item.discount),
      0,
    );
    const taxTotal = items.reduce(
      (sum, item) =>
        sum +
        (item.price * item.quantity * (item.cgstPercent + item.sgstPercent + item.igstPercent)) /
          100,
      0,
    );
    const total = subTotal + taxTotal;
    return {
      subTotal: subTotal.toFixed(2),
      taxTotal: taxTotal.toFixed(2),
      total: total.toFixed(2),
    };
  }, [items]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!formData.invoiceNo?.trim()) {
      newErrors.invoiceNo = "Invoice No required";
      valid = false;
    }
    if (items.length === 0) {
      newErrors.items = "At least one item required";
      valid = false;
    }
    items.forEach((item, index) => {
      if (!item.productName.trim()) {
        newErrors[`product_${index}`] = "Product required";
        valid = false;
      }
      if (item.quantity <= 0) {
        newErrors[`quantity_${index}`] = "Quantity must be > 0";
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: AddInvoiceForm = {
      invoiceNo: formData.invoiceNo!,
      customerName: selectedCustomer?.name || formData.customerName?.trim() || undefined,
      customerPhone: selectedCustomer?.phone || formData.customerPhone?.trim() || undefined,
      customerEmail: selectedCustomer?.email || formData.customerEmail?.trim() || undefined,
      customerAddress: selectedCustomer?.address || formData.customerAddress?.trim() || undefined,
      invoiceDate: formData.invoiceDate || dayjs().format("YYYY-MM-DD"),
      items,
    };

    setIsSubmitting(true);
    try {
      await dispatch(addInvoice(submitData)).unwrap();
      navigate("/sales/invoices");
    } catch (err) {
      console.error("Create invoice failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed unused legacy variant/product selection functions

  // const addItem = () => {
  //   setItems([
  //     ...items,
  //     {
  //       productName: "",
  //       hsnCode: "",
  //       quantity: 1,
  //       price: 0,
  //       discount: 0,
  //       cgstPercent: 9,
  //       sgstPercent: 9,
  //       igstPercent: 0,
  //       total: 0,
  //     },
  //   ]);
  // };

  const updateItem = (index: number, field: keyof ItemForm, value: unknown) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    // Recalc total
    item.total =
      (item.price * item.quantity - item.discount) *
      (1 + (item.cgstPercent + item.sgstPercent + item.igstPercent) / 100);
    newItems[index] = item;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCustomerSelect = (customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
  }) => {
    setSelectedCustomer(customer);
    setFormData({
      ...formData,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: customer.address,
    });
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">POS - New Bill</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {/* Header */}
          <div className="flex flex-col gap-2">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <CustomInput
                  label="Invoice No"
                  value={formData.invoiceNo || ""}
                  onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <CustomDatePicker
                  label="Invoice Date"
                  value={dayjs()}
                  onChange={(val: Dayjs | null) =>
                    setFormData({
                      ...formData,
                      invoiceDate: val?.toISOString() || "",
                    })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomSearch
                  label="Select Customer"
                  data={customers.filter((c): c is Customer => c != null)}
                  getLabel={(c: Customer) => `${c.name} (${c.phone})`}
                  onSelect={(item) => item && handleCustomerSelect(item)}
                  placeholder="Search customer by name/phone..."
                  // newOptionText="Add new customer"
                />
              </Grid>
            </Grid>
          </div>

          {/* Items - 2 Column View */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-700">Items ({items.length})</h2>
            </div>
            {errors.items && <Alert severity="error">{errors.items}</Alert>}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3, lg: 3 }} className="space-y-3">
                <CustomInput
                  label="Search Available Batches"
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  placeholder="Search by product, batch no, barcode..."
                />

                {batchesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <span>Loading batches...</span>
                  </div>
                ) : filteredBatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No batches found. Try different search.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredBatches.map((batch) => (
                      <ProductCard
                        items={items}
                        key={batch.id}
                        batch={batch}
                        onAdd={handleAddBatch}
                      />
                    ))}
                  </div>
                )}
              </Grid>
              {/* Right Column: Added Products Table */}
              <Grid size={{ xs: 12, lg: 9, md: 9 }} className="space-y-2">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    No items added yet. Select batches from left to add.
                  </div>
                ) : (
                  <CustomTable
                    columns={[
                      {
                        accessorKey: "productName",
                        header: "Product",
                        size: 200,
                      },
                      {
                        accessorKey: "batchNo",
                        header: "Batch / Variant",
                        Cell: ({ row }: any) => (
                          <div className="flex flex-col text-sm">
                            <span>{row.original.batchNo || row.original.variantSku || ""}</span>
                            <span className="text-xs text-gray-500">
                              {row.original.expiryDate
                                ? dayjs(row.original.expiryDate).format("MMM DD")
                                : row.original.size || "N/A"}
                            </span>
                          </div>
                        ),
                      },
                      {
                        header: "Price",
                        accessorFn: (row: ItemForm) => formatRupee(row.price),
                        size: 150,
                      },
                      {
                        header: "Quantity",
                        accessorKey: "quantity",
                        Cell: ({ row }: any) => (
                          <Stepper
                            value={row.original.quantity}
                            min={1}
                            onChange={(val) => updateItem(row.index, "quantity", val)}
                            onIncrease={() =>
                              updateItem(row.index, "quantity", row.original.quantity + 1)
                            }
                            onDecrease={() => {
                              if (row.original.quantity > 1) {
                                updateItem(row.index, "quantity", row.original.quantity - 1);
                              }
                            }}
                          />
                        ),
                        size: 170,
                      },
                      {
                        header: "Total",
                        accessorFn: (row: ItemForm) => formatRupee(row.total),
                        size: 150,
                      },
                      {
                        id: "actions",
                        header: "Actions",
                        enableColumnOrdering: false,
                        Cell: ({ row }: any) => (
                          <IconButton
                            onClick={() => removeItem(row.index)}
                            className="text-red-500 hover:bg-red-50"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        ),
                        size: 120,
                      },
                    ]}
                    data={items}
                    enableRowSelection={false}
                    enableColumnFilters={false}
                    enableGlobalFilter={false}
                    enablePagination={false}
                    enableSorting={true}
                  />
                )}
              </Grid>
            </Grid>
          </div>

          {/* Totals */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-end space-x-4 text-lg font-semibold">
              <div>Subtotal: {formatRupee(Number(calculateTotals.subTotal))}</div>
              <div>Tax: {formatRupee(Number(calculateTotals.taxTotal))}</div>
              <div className="text-blue-600 font-bold">
                Total: {formatRupee(Number(calculateTotals.total))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <CustomButton variant="outlined" onClick={() => navigate("/sales")}>
              Cancel
            </CustomButton>
            <CustomButton onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Finalize Bill"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default POSPage;
