import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Grid, IconButton } from "@mui/material";
import { addInvoice, clearError } from "../../../slices/invoicesSlice";
import { useInvoices } from "../../../hooks/useInvoices";
import { useProducts } from "../../../hooks/useProducts";
import { useCustomers } from "../../../hooks/useCustomers";
// import { useInventory } from "../../../hooks/useInventory";
import type { AddInvoiceForm } from "../../../types/invoice";
import CustomInput from "../../../components/CustomInput";
import CustomSelect from "../../../components/CustomSelect";
import CustomButton from "../../../components/CustomButton";
import CustomSearch from "../../../components/CustomSearch";
import CustomDatePicker from "../../../components/CustomDatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AppDispatch } from "../../../store";
import type { Product, ProductVariant } from "../../../types/product";
import type { Customer } from "../../../types/customer";
const formatRupee = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";

type ItemForm = {
  productName: string;
  productSku?: string;
  variantId?: string;
  variantSku?: string;
  hsnCode: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  discount: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  total: number;
};

const POSPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useInvoices();
  const { products } = useProducts();
  const { customers } = useCustomers();
  // const { inventory } = useInventory();
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
  const [productSearch, setProductSearch] = useState("");

  // Auto generate invoiceNo
  useEffect(() => {
    const dateStr = dayjs().format("YYYYMMDD");
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      invoiceNo: `INV-${dateStr}-${randomStr}`,
    }));
  }, []);

  const variantOptions = useMemo(() => {
    const options: {
      label: string;
      value: string;
      variant: ProductVariant;
      product: Product;
    }[] = [];
    products.forEach((product: Product) => {
      product.variant.forEach((v) => {
        options.push({
          label: `${product.name} (${v.size}/${v.color || "N/A"}) - ₹${v.sellingPrice}`,
          value: v.id,
          variant: v,
          product,
        });
      });
    });
    return options.filter(
      (opt) =>
        opt.product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        opt.variant.size?.toLowerCase().includes(productSearch.toLowerCase()) ||
        opt.variant.color?.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [products, productSearch]);

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

  const handleVariantSelect = useCallback(
    (index: number, variantId: string) => {
      const option = variantOptions.find((opt) => opt.value === variantId);
      if (option) {
        const v = option.variant;
        const p = option.product;
        updateItem(index, "productName", p.name);
        updateItem(index, "productSku", p.sku || "");
        updateItem(index, "variantId", v.id);
        updateItem(index, "variantSku", v.sku || "");
        updateItem(index, "hsnCode", p.hsnCode);
        updateItem(index, "size", v.size);
        updateItem(index, "color", v.color);
        updateItem(index, "price", v.sellingPrice);
        updateItem(index, "cgstPercent", p.gstPercent / 2);
        updateItem(index, "sgstPercent", p.gstPercent / 2);
        updateItem(index, "igstPercent", 0);
        updateItem(index, "discount", 0);
      }
    },
    [variantOptions],
  );

  const addItem = () => {
    setItems([
      ...items,
      {
        productName: "",
        hsnCode: "",
        quantity: 1,
        price: 0,
        discount: 0,
        cgstPercent: 9,
        sgstPercent: 9,
        igstPercent: 0,
        total: 0,
      },
    ]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateItem = (index: number, field: keyof ItemForm, value: any) => {
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
            <h2 className="text-xl font-semibold text-gray-700">Bill Header</h2>
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
                  data={customers}
                  getLabel={(c: Customer) => `${c.name} (${c.phone})`}
                  onSelect={handleCustomerSelect}
                  placeholder="Search customer by name/phone..."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  label="Customer Name"
                  value={formData.customerName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <CustomInput
                  label="Phone"
                  value={formData.customerPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <CustomInput
                  label="Email"
                  value={formData.customerEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CustomInput
                  label="Address"
                  multiline
                  value={formData.customerAddress || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerAddress: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Items</h2>
              <CustomButton
                variant="outlined"
                onClick={addItem}
                startIcon={<AddIcon />}
              >
                Add Item
              </CustomButton>
            </div>
            {errors.items && <Alert severity="error">{errors.items}</Alert>}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">
                      Item {index + 1} - Total: {formatRupee(item.total)}
                    </h4>
                    <IconButton
                      onClick={() => removeItem(index)}
                      className="text-red-500"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <CustomInput
                        label="Product Search"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                      <CustomSelect
                        label="Select Variant"
                        value={item.variantId || ""}
                        onChange={(e) =>
                          handleVariantSelect(index, e.target.value)
                        }
                        options={variantOptions.map((opt) => ({
                          label: opt.label,
                          value: opt.value,
                        }))}
                      />
                    </Grid>
                    <Grid size={2}>
                      <CustomInput
                        label="HSN"
                        value={item.hsnCode}
                        onChange={(e) =>
                          updateItem(index, "hsnCode", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <CustomInput
                        label="Qty"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        hasError={!!errors[`quantity_${index}`]}
                      />
                    </Grid>
                    <Grid size={2}>
                      <CustomInput
                        label="Price"
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <CustomInput
                        label="Disc"
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "discount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={1}>
                      <CustomInput
                        label="CGST%"
                        type="number"
                        value={item.cgstPercent}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "cgstPercent",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={1}>
                      <CustomInput
                        label="SGST%"
                        type="number"
                        value={item.sgstPercent}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "sgstPercent",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-end space-x-4 text-lg font-semibold">
              <div>
                Subtotal: {formatRupee(Number(calculateTotals.subTotal))}
              </div>
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
            <CustomButton
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Finalize Bill"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default POSPage;
