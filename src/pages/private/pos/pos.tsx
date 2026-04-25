/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { useInvoices } from "../../../hooks/useInvoices";
import { usePreferences } from "../../../hooks/usePreferences";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
} from "@mui/material";
import AddCustomerDialog from "../customers/AddCustomerDialog";
import type { Invoice } from "../../../types/invoice";

import { useCustomers } from "../../../hooks/useCustomers";
import type { AddInvoiceForm } from "../../../types/invoice";
import type { Batch } from "../../../types/batch";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import CustomSearch from "../../../components/CustomSearch";
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
import CustomSelect from "../../../components/CustomSelect";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { fetchCustomers } from "../../../slices/customersSlice";
import PermissionGuard from "../../../components/PermissionGuard";
import { SectionLoader } from "../../../components/CustomLoader";

const POSPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    drafts,
    error: invoicesError,
    billHtml: reduxBillHtml,
    addInvoice,
    createDraftInvoice,
    finalizeInvoice,
    updateDraftInvoice,
    clearError,
    deleteInvoice,
    generateBill,
    clearBillHtml,
  } = useInvoices();
  const { preferences } = usePreferences();
  const { customers } = useCustomers();
  // Customer Creation State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const {
    activeBatches,
    loading: batchesLoading,
    refetch: refetchBatches,
  } = useBatches();
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
  const [showDrafts, setShowDrafts] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleReset = useCallback(() => {
    setItems([]);
    setAmountPaid(0);
    setBillDiscount(0);
    setCurrentDraftId(null);
    setSelectedCustomer(null);
    setErrors({});

    // Set default invoice date
    setFormData({
      invoiceDate: dayjs().format("YYYY-MM-DD"),
    });
  }, []);

  // Auto generate invoiceNo
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  // Auto-print when bill is loaded
  useEffect(() => {
    if (reduxBillHtml && showBillModal) {
      const timer = setTimeout(() => {
        const iframe = document.querySelector(
          'iframe[title="Bill Preview"]',
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      }, 800); // Wait for content to render
      return () => clearTimeout(timer);
    }
  }, [reduxBillHtml, showBillModal]);

  const filteredBatches = useMemo(() => {
    return activeBatches
      .filter(
        (batch: Batch) =>
          (batch.productName
            .toLowerCase()
            .includes(batchSearch.toLowerCase()) ||
            batch.batchNo.toLowerCase().includes(batchSearch.toLowerCase()) ||
            batch.barcode.toLowerCase().includes(batchSearch.toLowerCase())) &&
          batch.remainingQuantity > 0,
      )
      .map((batch: Batch) => {
        const itemInCart = items.find((item) => item.batchNo === batch.batchNo);
        return {
          ...batch,
          remainingQuantity:
            batch.remainingQuantity - (itemInCart?.quantity || 0),
        };
      })
      .slice(0, 10);
  }, [activeBatches, batchSearch, items]);

  const handleAddBatch = useCallback((batch: Batch, qty: number) => {
    const itemInCart = items.find((item) => item.batchNo === batch.batchNo);
    const totalAvailable =
      batch.remainingQuantity + (itemInCart?.quantity || 0);

    if (qty < 0 || qty > totalAvailable || !Number.isFinite(qty)) return;

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
      cgstPercent: batch.cgstPercent || 0,
      sgstPercent: batch.sgstPercent || 0,
      igstPercent: batch.igstPercent || 0,
      taxInclusive: batch.taxInclusive || false,
      total: 0,
    };
    // Recalc total
    const subtotal = newItem.price * newItem.quantity - newItem.discount;
    const taxRate = newItem.taxInclusive
      ? 0
      : (newItem.cgstPercent + newItem.sgstPercent) / 100;
    newItem.total = isFinite(subtotal) ? subtotal * (1 + taxRate) : 0;

    setItems((prevItems) => {
      if (qty === 0) {
        return prevItems.filter((item) => item.batchNo !== batch.batchNo);
      }
      const idx = prevItems.findIndex(
        (item) =>
          (item.batchNo && item.batchNo === batch.batchNo) ||
          (!item.batchNo && item.variantSku === batch.variantSku),
      );
      if (idx >= 0) {
        const updated = [...prevItems];
        updated[idx] = newItem;
        return updated;
      }
      return [...prevItems, newItem];
    });
  }, [items]);

  const [billDiscount, setBillDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountPaid, setAmountPaid] = useState(0);
  const [invoiceType, setInvoiceType] = useState<"a4" | "thermal">(
    (preferences.invoiceType as any) || "a4",
  );

  // Update invoiceType when preferences are loaded
  useEffect(() => {
    if (preferences.invoiceType) {
      setInvoiceType(preferences.invoiceType as any);
    }
  }, [preferences.invoiceType]);

  const calculateTotals = useMemo(() => {
    const subTotal = items.reduce((sum, item) => {
      const lineAmount = item.price * item.quantity - item.discount;
      if (item.taxInclusive) {
        return (
          sum +
          lineAmount /
            (1 + (Number(item.cgstPercent) + Number(item.sgstPercent)) / 100)
        );
      }
      return sum + lineAmount;
    }, 0);
    const taxTotal = items.reduce((sum, item) => {
      const lineAmount = item.price * item.quantity - item.discount;
      const taxRate =
        (Number(item.cgstPercent) + Number(item.sgstPercent)) / 100;
      if (item.taxInclusive) {
        const base = lineAmount / (1 + taxRate);
        return sum + base * taxRate;
      }
      return sum + lineAmount * taxRate;
    }, 0);
    const grandTotal = subTotal + taxTotal - billDiscount;
    const due = Math.max(0, grandTotal - amountPaid);
    return {
      subTotal,
      taxTotal,
      discount: billDiscount,
      total: grandTotal,
      paid: amountPaid,
      due,
    };
  }, [items, billDiscount, amountPaid]);

  const validateForm = (mode: "DRAFT" | "COMPLETED"): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    // Common validations
    if (items.length === 0) {
      newErrors.items = "At least one item required";
      valid = false;
      showMessage("Please add at least one item", "error");
    }

    // Checkout specific validations
    if (mode === "COMPLETED") {
      if (!selectedCustomer) {
        newErrors.customer = "Customer is required for checkout";
        valid = false;
        showMessage("Please select a customer for checkout", "error");
      }
      if (amountPaid <= 0) {
        newErrors.amountPaid = "Payment amount is required";
        valid = false;
        showMessage("Please enter the payment amount", "error");
      }
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

  const handleLoadDraft = async (draft: Invoice) => {
    setFormData({
      invoiceNo: draft.invoiceNo || "",
      customerName: draft.customerName,
      customerPhone: draft.customerPhone,
      customerEmail: draft.customerEmail,
      customerAddress: draft.customerAddress,
      invoiceDate: draft.invoiceDate,
    });
    setItems(
      draft.items.map((invItem) => {
        const batchDetails = activeBatches.find(
          (b) => b.batchNo === invItem.batchNo,
        );
        return {
          productName: invItem.productName,
          variantSku: invItem.variantSku || "",
          barcode: batchDetails?.barcode || "",
          hsnCode: invItem.hsnCode,
          batchNo: batchDetails?.batchNo || "",
          expiryDate: batchDetails?.expiryDate || "",
          quantity: Number(invItem.quantity),
          price: Number(invItem.price),
          discount: Number(invItem.discount),
          cgstPercent: Number(invItem.cgstPercent),
          sgstPercent: Number(invItem.sgstPercent),
          igstPercent: Number(invItem.igstPercent),
          taxInclusive: invItem.taxInclusive,
          total: Number(invItem.total),
        };
      }),
    );
    setAmountPaid(Number(draft.paidAmount || 0));
    setBillDiscount(Number(draft.discount || 0));
    setCurrentDraftId(draft.id);
    setSelectedCustomer({
      id: "", // We don't have the customer ID in the invoice object usually, but we have the details
      name: draft.customerName || "",
      phone: draft.customerPhone || "",
      email: draft.customerEmail || "",
      address: draft.customerAddress || "",
    });
    setShowDrafts(false);
  };

  const handleGenerateBill = async (invoiceId?: string) => {
    const id = invoiceId || currentDraftId;
    if (!id) return;

    setIsSubmitting(true);
    try {
      await dispatch(generateBill({ id, type: invoiceType })).unwrap();
      setShowBillModal(true);
    } catch (err) {
      console.error("Generate bill failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm("COMPLETED")) return;

    setIsSubmitting(true);
    const submitData: AddInvoiceForm = {
      status: "COMPLETED" as const,
      customerName:
        selectedCustomer?.name || formData.customerName?.trim() || "Walk-in",
      customerPhone:
        selectedCustomer?.phone || formData.customerPhone?.trim() || "",
      customerEmail:
        selectedCustomer?.email || formData.customerEmail?.trim() || "",
      customerAddress:
        selectedCustomer?.address || formData.customerAddress?.trim() || "",
      invoiceDate: formData.invoiceDate || dayjs().format("YYYY-MM-DD"),
      paymentMethod: paymentMethod || "CASH",
      discount: billDiscount,
      paidAmount: amountPaid,
      items: items.map((item) => ({
        productName: item.productName,
        productSku: item.barcode, // Barcode is often used as SKU in POS
        variantSku: item.variantSku,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        cgstPercent: item.cgstPercent,
        sgstPercent: item.sgstPercent,
        igstPercent: item.igstPercent,
        taxInclusive: item.taxInclusive,
        batchNo: item.batchNo,
      })),
    };

    try {
      let result;
      if (currentDraftId) {
        // Update draft first to ensure latest items are saved
        await dispatch(
          updateDraftInvoice({ id: currentDraftId, invoiceData: submitData }),
        ).unwrap();
        // Then finalize it
        result = await dispatch(
          finalizeInvoice({
            id: currentDraftId,
            paidAmount: submitData.paidAmount,
            paymentMethod: submitData.paymentMethod,
          }),
        ).unwrap();
      } else {
        result = await dispatch(addInvoice(submitData)).unwrap();
      }

      if (result.id) {
        handleGenerateBill(result.id);
        refetchBatches();
      }
      handleReset();
      showMessage("Invoice created successfully!");
    } catch (err: any) {
      console.error("Create invoice failed:", err);
      showMessage(`Error: ${err}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItem = useCallback(
    (index: number, field: keyof ItemForm, value: unknown) => {
      setItems((prevItems) => {
        if (index < 0 || index >= prevItems.length) return prevItems;
        const newItems = [...prevItems];
        const item = { ...newItems[index], [field]: value as any };
        const subtotal = item.price * item.quantity - item.discount;
        const taxRate = item.taxInclusive
          ? 0
          : (Number(item.cgstPercent) + Number(item.sgstPercent)) / 100;
        item.total = isFinite(subtotal) ? subtotal * (1 + taxRate) : 0;
        newItems[index] = item;
        return newItems;
      });
    },
    [],
  );

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAddress: customer.address,
      }));
    }
  };

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">POS - New Bill</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {invoicesError && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {invoicesError}
            </Alert>
          )}

          {/* Header */}
          <div className="flex flex-col gap-2">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <CustomInput
                  label="Invoice No"
                  value={formData.invoiceNo || "Auto-generated"}
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
                  data={customers}
                  value={selectedCustomer}
                  getLabel={(c: Customer) => `${c.name} (${c.phone})`}
                  onSelect={(item) =>
                    item && handleCustomerSelect(item as Customer)
                  }
                  placeholder="Search customer by name/phone..."
                  actionOption={() => ({
                    label: "Add new customer",
                    icon: AddCircleOutlineOutlined,
                    onClick: () => setIsCustomerModalOpen(true),
                  })}
                />
              </Grid>
            </Grid>
          </div>

          {/* Customer Creation Dialog */}
          <AddCustomerDialog
            open={isCustomerModalOpen}
            onClose={() => setIsCustomerModalOpen(false)}
            onSuccess={(customer) => {
              handleCustomerSelect(customer);
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <h2 className="text-xl font-semibold text-gray-700">
                Items ({items.length})
              </h2>
              <CustomButton
                onClick={() => setShowDrafts(true)}
                variant="outlined"
                size="small"
              >
                View Drafts ({drafts.length})
              </CustomButton>
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
                  <SectionLoader label="Loading batches..." />
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
                  <div className="max-h-96 overflow-auto space-y-2">
                    {/* Header */}
                    <Grid
                      container
                      className="bg-gray-50 p-3 rounded-lg sticky top-0 z-10 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      <Grid size={2} className="font-medium text-center">
                        Product
                      </Grid>
                      <Grid size={2} className="text-center">
                        Batch
                      </Grid>
                      <Grid size={2} className="text-center">
                        Price
                      </Grid>
                      <Grid size={3} className="text-center">
                        Qty
                      </Grid>
                      <Grid size={2} className="text-center">
                        Total
                      </Grid>
                      <Grid size={1} className="text-center">
                        {" "}
                      </Grid>
                    </Grid>
                    {/* Items */}
                    {items.map((item, index) => (
                      <Grid
                        container
                        key={item.batchNo || index}
                        className="p-3 border text-center border-gray-200 rounded-lg hover:bg-gray-50 items-center gap-2"
                      >
                        <Grid
                          size={2}
                          className="text-sm font-medium truncate text-center"
                        >
                          {item.productName}
                        </Grid>
                        <Grid size={2} className="text-sm text-center">
                          <div>{item.batchNo || item.variantSku || "-"}</div>
                          {item.expiryDate && (
                            <div className="text-xs text-orange-600 text-center">
                              {dayjs(item.expiryDate).format("MMM DD")}
                            </div>
                          )}
                        </Grid>
                        <Grid
                          size={2}
                          className="text-sm font-medium text-center"
                        >
                          {formatRupee(Number(item.price))}
                        </Grid>
                        <Grid size={3} className="flex justify-center">
                          <Stepper
                            value={item.quantity}
                            min={1}
                            max={
                              (activeBatches.find(
                                (bt) =>
                                  (item.batchNo &&
                                    bt.batchNo === item.batchNo) ||
                                  (!item.batchNo &&
                                    bt.variantSku === item.variantSku),
                              )?.remainingQuantity || 0) + item.quantity
                            }
                            onChange={(val) =>
                              updateItem(index, "quantity", val)
                            }
                            onIncrease={() =>
                              updateItem(index, "quantity", item.quantity + 1)
                            }
                            onDecrease={() => {
                              if (item.quantity > 1) {
                                updateItem(
                                  index,
                                  "quantity",
                                  item.quantity - 1,
                                );
                              }
                            }}
                          />
                        </Grid>
                        <Grid
                          size={2}
                          className="text-sm font-semibold text-green-600 text-center"
                        >
                          {formatRupee(item.total)}
                        </Grid>
                        <Grid size={1} className="flex justify-end">
                          <IconButton
                            onClick={() => removeItem(index)}
                            size="small"
                            className="text-red-500 hover:bg-red-50"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                )}
              </Grid>
            </Grid>
          </div>

          {/* Additional Fields & Totals */}
          <div className="space-y-4">
            <Grid container spacing={3}>
              {/* Bill Discount - Top Right */}
              <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                <CustomInput
                  label="Bill Discount (₹)"
                  type="number"
                  value={billDiscount}
                  onChange={(e) =>
                    setBillDiscount(
                      Number(Number(e.target.value || 0).toFixed(2)),
                    )
                  }
                  placeholder="0"
                />
              </Grid>
              {/* Payment Method - Middle Left */}
              <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                <CustomSelect
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={[
                    { value: "CASH", label: "Cash" },
                    { value: "CARD", label: "Card" },
                    { value: "UPI", label: "UPI" },
                    { value: "BANK", label: "Bank Transfer" },
                  ]}
                />
              </Grid>
              {/* Amount Paid - Middle Right */}
              <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                <div className="flex gap-2 items-center">
                  <CustomInput
                    label="Amount Paid (₹)"
                    type="number"
                    value={amountPaid}
                    onChange={(e) =>
                      setAmountPaid(
                        Number(Number(e.target.value || 0).toFixed(2)),
                      )
                    }
                    placeholder="0"
                    className="flex-1"
                  />
                  <CustomButton
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setAmountPaid(Number(calculateTotals.total.toFixed(2)))
                    }
                    className="h-full! px-1 py-3! text-xs!"
                    disabled={calculateTotals.total === 0}
                  >
                    Pay in Full
                  </CustomButton>
                </div>
              </Grid>
            </Grid>
            {/* Totals Stack - Right */}
            <div className="flex justify-end space-y-2">
              <div className="grid grid-cols-2 w-2/5 gap-4 text-sm font-medium text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="text-right">Subtotal:</div>
                <div className="font-semibold text-right">
                  {formatRupee(calculateTotals.subTotal)}
                </div>
                <div className="text-right">Tax:</div>
                <div className="font-semibold text-right">
                  {formatRupee(calculateTotals.taxTotal)}
                </div>
                <div className="text-right">Discount:</div>
                <div className="text-red-600 font-semibold text-right">
                  -{formatRupee(calculateTotals.discount)}
                </div>
                <div className="text-right">Paid:</div>
                <div className="font-semibold text-green-600 text-right">
                  {formatRupee(calculateTotals.paid)}
                </div>
                <div className="text-right text-xl grid grid-cols-2 font-bold pt-2 border-t border-gray-200 col-span-2 justify-between text-blue-600">
                  <span>Total:</span>
                  <span>{formatRupee(calculateTotals.total)}</span>
                </div>
                {calculateTotals.due > 0 && (
                  <div className="col-span-2 text-right font-bold text-orange-600 text-lg mt-1">
                    Due: {formatRupee(calculateTotals.due)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <CustomButton
              onClick={handleReset}
              variant="outlined"
              disabled={isSubmitting}
            >
              Clear
            </CustomButton>
            <PermissionGuard module="Sales" action="create">
              <CustomButton
                onClick={() => {
                  if (!validateForm("DRAFT")) return;
                  const submitData: AddInvoiceForm = {
                    status: "DRAFT" as const,
                    customerName:
                      selectedCustomer?.name ||
                      formData.customerName?.trim() ||
                      "Walk-in",
                    customerPhone:
                      selectedCustomer?.phone ||
                      formData.customerPhone?.trim() ||
                      "",
                    customerEmail:
                      selectedCustomer?.email ||
                      formData.customerEmail?.trim() ||
                      "",
                    customerAddress:
                      selectedCustomer?.address ||
                      formData.customerAddress?.trim() ||
                      "",
                    invoiceDate:
                      formData.invoiceDate || dayjs().format("YYYY-MM-DD"),
                    paymentMethod: paymentMethod || "CASH",
                    discount: billDiscount,
                    paidAmount: amountPaid,
                    items: items.map((item) => ({
                      productName: item.productName,
                      productSku: item.barcode,
                      variantSku: item.variantSku,
                      hsnCode: item.hsnCode,
                      quantity: item.quantity,
                      price: item.price,
                      discount: item.discount,
                      cgstPercent: item.cgstPercent,
                      sgstPercent: item.sgstPercent,
                      igstPercent: item.igstPercent,
                      taxInclusive: item.taxInclusive,
                    })),
                  };

                  const action = currentDraftId
                    ? dispatch(
                        updateDraftInvoice({
                          id: currentDraftId,
                          invoiceData: submitData,
                        }),
                      )
                    : dispatch(createDraftInvoice(submitData as AddInvoiceForm));

                  action
                    .unwrap()
                    .then(() => {
                      showMessage(
                        currentDraftId ? "Draft updated!" : "Draft saved!",
                      );
                      handleReset();
                    })
                    .catch((err) =>
                      showMessage(`Error: ${err.message}`, "error"),
                    );
                }}
                variant="outlined"
                disabled={items.length === 0 || isSubmitting}
              >
                Save Draft
              </CustomButton>
            </PermissionGuard>
            <PermissionGuard module="Sales" action="create">
              <CustomButton
                onClick={() => handleSubmit()}
                variant="contained"
                disabled={items.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Checkout & Print"}
              </CustomButton>
            </PermissionGuard>
          </div>
          <Dialog
            open={showBillModal}
            onClose={() => {
              setShowBillModal(false);
              dispatch(clearBillHtml());
            }}
            maxWidth={invoiceType === "thermal" ? "xs" : "md"}
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                  minHeight: invoiceType === "thermal" ? "600px" : "80vh",
                },
              },
            }}
          >
            <DialogTitle className="flex justify-between items-center bg-gray-50 border-b p-4">
              <Typography variant="h6" className="font-bold text-blue-800">
                Bill Preview (
                {invoiceType === "thermal" ? "Thermal" : "A4 Size"})
              </Typography>
              <div className="flex gap-2">
                <CustomButton
                  onClick={() => {
                    const iframe = document.querySelector(
                      'iframe[title="Bill Preview"]',
                    ) as HTMLIFrameElement;
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.focus();
                      iframe.contentWindow.print();
                    }
                  }}
                  variant="contained"
                  size="small"
                >
                  Reprint
                </CustomButton>
                <CustomButton
                  onClick={() => setShowBillModal(false)}
                  variant="outlined"
                  size="small"
                  className="border-gray-300 text-gray-600"
                >
                  Close
                </CustomButton>
              </div>
            </DialogTitle>
            <DialogContent className="p-0 bg-gray-100 flex justify-center">
              {reduxBillHtml ? (
                <div
                  className={`w-full h-full flex justify-center ${invoiceType === "thermal" ? "p-4" : "p-8"}`}
                >
                  <iframe
                    srcDoc={reduxBillHtml}
                    className="shadow-2xl bg-white"
                    style={{
                      width: invoiceType === "thermal" ? "400px" : "100%",
                      height: "100%",
                      border: "none",
                      minHeight: "70vh",
                    }}
                    title="Bill Preview"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                  <CircularProgress size={40} />
                  <Typography
                    variant="body1"
                    className="text-gray-500 animate-pulse"
                  >
                    Preparing your bill...
                  </Typography>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={showDrafts}
            onClose={() => setShowDrafts(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Draft Bills ({drafts.length})</DialogTitle>
            <DialogContent>
              {drafts.length === 0 ? (
                <p>No drafts found. Create one first!</p>
              ) : (
                <List>
                  {drafts.slice(0, 10).map((draft) => (
                    <ListItem
                      key={draft.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                "Are you sure you want to delete this draft?",
                              )
                            ) {
                              dispatch(deleteInvoice(draft.id))
                                .unwrap()
                                .then(() =>
                                  showMessage("Draft deleted successfully"),
                                )
                                .catch((err) =>
                                  showMessage(
                                    `Failed to delete draft: ${err.message}`,
                                    "error",
                                  ),
                                );
                              if (currentDraftId === draft.id) {
                                handleReset();
                              }
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onClick={() => handleLoadDraft(draft)}
                    >
                      <ListItemText
                        primary={draft.invoiceNo}
                        secondary={`Created: ${dayjs(draft.createdAt).format("MMM DD, HH:mm")} | Items: ${draft.items.length} | Total: ${formatRupee(draft.totalAmount)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <CustomButton onClick={() => setShowDrafts(false)}>
                Close
              </CustomButton>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </form>
      </div>
    </div>
  );
};

export default POSPage;
