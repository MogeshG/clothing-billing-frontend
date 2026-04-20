/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Grid, IconButton } from "@mui/material";
import { addInvoice, clearError } from "../../../slices/invoicesSlice";
import { useInvoices } from "../../../hooks/useInvoices";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";
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

const POSPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, drafts } = useInvoices();

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
  const [showDrafts, setShowDrafts] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billHtml, setBillHtml] = useState("");

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

  const handleAddBatch = useCallback((batch: Batch, qty: number) => {
    if (qty <= 0 || batch.remainingQuantity <= 0 || !Number.isFinite(qty))
      return;

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
      total: 0,
    };
    // Recalc total
    // Safe recalc total
    const subtotal = newItem.price * newItem.quantity - newItem.discount;
    const taxRate =
      (newItem.cgstPercent + newItem.sgstPercent + newItem.igstPercent) / 100;
    newItem.total = isFinite(subtotal) ? subtotal * (1 + taxRate) : 0;

    setItems((prevItems) => {
      const idx = prevItems.findIndex((item) => item.batchNo === batch.batchNo);
      if (idx >= 0) {
        const updated = [...prevItems];
        updated[idx] = newItem;
        return updated;
      }
      return [...prevItems, newItem];
    });
  }, []);

  const [billDiscount, setBillDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);

  const calculateTotals = useMemo(() => {
    const subTotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity - item.discount),
      0,
    );
    const taxTotal = items.reduce(
      (sum, item) =>
        sum +
        (item.price *
          item.quantity *
          (item.cgstPercent + item.sgstPercent + item.igstPercent)) /
          100,
      0,
    );
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
      draft.items.map((invItem) => ({
        productName: invItem.productName,
        variantSku: invItem.variantSku || "",
        barcode: "",
        hsnCode: invItem.hsnCode,
        batchNo: "",
        expiryDate: "",
        quantity: invItem.quantity,
        price: invItem.price,
        discount: invItem.discount,
        cgstPercent: invItem.cgstPercent,
        sgstPercent: invItem.sgstPercent,
        igstPercent: invItem.igstPercent,
        total: invItem.total,
      })),
    );
    setSelectedCustomer(null);
    setShowDrafts(false);
    setCurrentDraftId(draft.id);
  };

  const handleGenerateBill = async () => {
    setIsSubmitting(true);
    try {
      if (!validateForm()) return;

      const customerData = {
        name:
          selectedCustomer?.name || formData.customerName?.trim() || "Walk-in",
        phone: selectedCustomer?.phone || formData.customerPhone?.trim() || "",
        email: selectedCustomer?.email || formData.customerEmail?.trim() || "",
        address:
          selectedCustomer?.address || formData.customerAddress?.trim() || "",
      };

      const totals = calculateTotals;

      const billData = {
        invoiceNo: formData.invoiceNo!,
        invoiceDate: formData.invoiceDate || dayjs().format("YYYY-MM-DD"),
        customer: customerData,
        paymentMethod,
        ...totals,
        items: items.map((item) => ({
          productName: item.productName,
          variantSku: item.variantSku || item.batchNo || "",
          hsnCode: item.hsnCode,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          cgstPercent: item.cgstPercent,
          sgstPercent: item.sgstPercent,
          igstPercent: item.igstPercent,
          total: item.total,
        })),
      };

      const response = await fetch("/api/generate-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      if (result.html) {
        setBillHtml(result.html);
        setShowBillModal(true);
      } else {
        alert("No bill HTML received from server");
      }
    } catch (err) {
      console.error("Generate bill failed:", err);
      alert("Failed to generate bill. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: AddInvoiceForm = {
      invoiceNo: formData.invoiceNo!,
      customerName:
        selectedCustomer?.name || formData.customerName?.trim() || undefined,
      customerPhone:
        selectedCustomer?.phone || formData.customerPhone?.trim() || undefined,
      customerEmail:
        selectedCustomer?.email || formData.customerEmail?.trim() || undefined,
      customerAddress:
        selectedCustomer?.address ||
        formData.customerAddress?.trim() ||
        undefined,
      invoiceDate: formData.invoiceDate || dayjs().format("YYYY-MM-DD"),
      items: items.map((item) => ({
        productName: item.productName,
        variantSku: item.variantSku,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        cgstPercent: item.cgstPercent,
        sgstPercent: item.sgstPercent,
        igstPercent: item.igstPercent,
      })),
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

  const updateItem = useCallback(
    (index: number, field: keyof ItemForm, value: unknown) => {
      setItems((prevItems) => {
        if (index < 0 || index >= prevItems.length) return prevItems;
        const newItems = [...prevItems];
        const item = { ...newItems[index], [field]: value as any };
        const subtotal = item.price * item.quantity - item.discount;
        const taxRate =
          (item.cgstPercent + item.sgstPercent + item.igstPercent) / 100;
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
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceNo: e.target.value })
                  }
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
              <h2 className="text-xl font-semibold text-gray-700">
                Items ({items.length})
              </h2>
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
                          {formatRupee(item.price)}
                        </Grid>
                        <Grid size={3} className="flex justify-center">
                          <Stepper
                            value={item.quantity}
                            min={1}
                            max={
                              batches.find((bt) => bt.batchNo === item.batchNo)
                                .remainingQuantity
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
              {/* Discount - Left */}
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
                    { value: "", label: "Cash" },
                    { value: "card", label: "Card" },
                    { value: "upi", label: "UPI" },
                    { value: "bank", label: "Bank Transfer" },
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
            <CustomButton variant="outlined" onClick={() => navigate("/sales")}>
              Cancel
            </CustomButton>
            <CustomButton
              onClick={() => setShowDrafts(true)}
              variant="outlined"
              disabled={drafts.length === 0}
            >
              Load Draft ({drafts.length})
            </CustomButton>
            <CustomButton
              onClick={handleGenerateBill}
              variant="contained"
              disabled={items.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate Bill"}
            </CustomButton>
          </div>
          {/* Bill Preview Modal */}
          <Dialog
            open={showBillModal}
            onClose={() => {
              setShowBillModal(false);
              setBillHtml("");
            }}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              Bill Preview
              <div className="float-right flex gap-2">
                <CustomButton
                  onClick={() => window.print()}
                  variant="outlined"
                  size="small"
                >
                  Print
                </CustomButton>
                <CustomButton
                  onClick={() => setShowBillModal(false)}
                  variant="outlined"
                  size="small"
                >
                  Close
                </CustomButton>
              </div>
            </DialogTitle>
            <DialogContent style={{ padding: 0, height: "100%" }}>
              {billHtml ? (
                <iframe
                  srcDoc={billHtml}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    minHeight: "500px",
                  }}
                  title="Bill Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  Loading bill...
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
              <MuiButton onClick={() => setShowDrafts(false)}>Close</MuiButton>
            </DialogActions>
          </Dialog>
        </form>
      </div>
    </div>
  );
};

export default POSPage;
