import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
} from "@mui/material";
import { addPurchase, clearError } from "../../../slices/purchasesSlice";
import { usePurchases } from "../../../hooks/usePurchases";
import { useProducts } from "../../../hooks/useProducts";
import type { AddPurchaseForm, ItemForm } from "../../../types/purchase";
import CustomInput from "../../../components/CustomInput";
import CustomSelect from "../../../components/CustomSelect";
import CustomButton from "../../../components/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AppDispatch } from "../../../store";
import type { Product, ProductVariant } from "../../../types/product";
import { isValidGST, isValidPhone } from "../../../utils/validation";
import CustomDatePicker from "../../../components/CustomDatePicker";
import CustomSearch from "../../../components/CustomSearch";
import { useVendors } from "../../../hooks/useVendors";
import type { Vendor } from "../../../types/vendor";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useUnits } from "../../../hooks/useUnits";
import { useMemo } from "react";
import type { Unit } from "../../../types/unit";
import { camelToSnake } from "../../../utils/caseConvert";

const CreatePurchasePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = usePurchases();
  const { products } = useProducts();
  const { vendors } = useVendors();
  const { units } = useUnits();
  const unitOptions = useMemo(
    () =>
      units.map((unit: Unit) => ({
        label: `${unit.unitName} (${unit.symbol})`,
        value: unit.id,
      })),
    [units],
  );
  const [formData, setFormData] = useState<Partial<AddPurchaseForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<ItemForm[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!formData.purchaseNo?.trim()) {
      newErrors.purchaseNo = "Purchase No required";
      valid = false;
    }
    if (!formData.vendorName?.trim()) {
      newErrors.vendorName = "Vendor name required";
      valid = false;
    }
    if (formData.vendorPhone && !isValidPhone(formData.vendorPhone)) {
      newErrors.vendorPhone = "Invalid Phone number";
      valid = false;
    }
    if (formData.vendorGstin && !isValidGST(formData.vendorGstin)) {
      newErrors.vendorGstin = "Invalid GSTIN";
      valid = false;
    }

    // Validate items (match backend required)
    items.forEach((item, index) => {
      if (!item.itemType) {
        newErrors[`itemType_${index}`] = "Item type required";
        valid = false;
      }
      if (!item.itemName.trim()) {
        newErrors[`itemName_${index}`] = "Item name required";
        valid = false;
      }
      if (!item.unitId) {
        newErrors[`unitId_${index}`] = "Unit required";
        valid = false;
      }
      if (item.quantity <= 0) {
        newErrors[`quantity_${index}`] = "Quantity must be > 0";
        valid = false;
      }
      if (item.costPrice <= 0) {
        newErrors[`costPrice_${index}`] = "Price must be > 0";
        valid = false;
      }
    });

    if (items.length === 0) {
      newErrors.items = "At least one item required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleDraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Minimal validation for draft
    if (!formData.purchaseNo?.trim() || items.length === 0) {
      setErrors({
        draftError: "Purchase No and at least one item required for draft",
      });
      return;
    }

    const camelData = {
      purchaseNo: formData.purchaseNo!.trim(),
      vendorName: formData.vendorName?.trim(),
      vendorPhone: formData.vendorPhone?.trim(),
      vendorGstin: formData.vendorGstin?.trim(),
      status: "DRAFT",
      purchaseDate:
        formData.purchaseDate || new Date().toISOString().split("T")[0],
      items: items.map((item) => ({
        ...item,
        total: Number(item.total),
      })),
    };
    const submitData = camelToSnake(camelData);

    setIsSubmitting(true);
    try {
      await dispatch(addPurchase(submitData)).unwrap();
      navigate("/purchases");
    } catch (err) {
      console.error("Save draft failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const camelData = {
      purchaseNo: formData.purchaseNo!.trim(),
      vendorName: formData.vendorName?.trim(),
      vendorPhone: formData.vendorPhone?.trim(),
      vendorGstin: formData.vendorGstin?.trim(),
      discount: formData.discount,
      status: "COMPLETED",
      purchaseDate:
        formData.purchaseDate || new Date().toISOString().split("T")[0],
      items: items.map((item) => ({
        ...item,
        total: Number(item.total),
      })),
    };
    const submitData = camelToSnake(camelData);

    setIsSubmitting(true);
    try {
      await dispatch(addPurchase(submitData)).unwrap();

      navigate("/purchases");
    } catch (err) {
      console.error("Create purchase failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variantOptions = useMemo(() => {
    const options: { label: string; value: string; variant: ProductVariant }[] =
      [];
    products.forEach((product: Product) => {
      product.variant.forEach((v) => {
        options.push({
          label: `${product.name}/${v.color} - ${v.size}`,
          value: v.id,
          variant: v,
        });
      });
    });
    return options;
  }, [products]) as Array<{
    label: string;
    value: string;
    variant: ProductVariant;
  }>;

  const handleVariantSelect = (index: number, variantId: string) => {
    const option = variantOptions.find((opt) => opt.value === variantId);
    if (option && option.variant) {
      const v = option.variant;
      const product = products.find((p) =>
        p.variant.some((vv) => vv.id === v.id),
      );
      const generatedName = `${product.name}/${v.color} - ${v.size}`;
      updateItem(index, "itemName", generatedName);
      updateItem(index, "sku", v.sku || "");
      updateItem(index, "size", v.size);
      updateItem(index, "color", v.color);
      updateItem(index, "productVariantId", v.id);
      updateItem(index, "costPrice", Number(v.costPrice));
      updateItem(index, "hsnCode", "uasghduish");
      updateItem(index, "cgstPercent", Number(product.cgstPercent));
      updateItem(index, "sgstPercent", Number(product.sgstPercent));
      updateItem(index, "igstPercent", Number(product.igstPercent));
      updateItem(index, "itemType", "FINISHED");
      updateItem(index, "taxInclusive", product.taxInclusive);
      updateItem(index, "sellingPrice", v.sellingPrice);
      updateItem(index, "mrp", Number(v.mrp));
      const taxRate = product.taxInclusive
        ? 0
        : (Number(product.cgstPercent) + Number(product.sgstPercent)) / 100;
      updateItem(
        index,
        "total",
        Number(v.costPrice * 1 * (1 + taxRate)).toFixed(2),
      );
    }
  };

  const resetItemDataOnTypeChange = (
    index: number,
    newType: "RAW" | "FINISHED",
  ) => {
    if (newType === "RAW") {
      // Reset finished product fields
      updateItem(index, "productVariantId", "");
      updateItem(index, "sku", "");
      updateItem(index, "size", "");
      updateItem(index, "color", "");
      updateItem(index, "mrp", 0);
      updateItem(index, "sellingPrice", 0);
      updateItem(index, "hsnCode", "");
      updateItem(index, "cgstPercent", 0);
      updateItem(index, "sgstPercent", 0);
      updateItem(index, "igstPercent", 0);
      // Clear derived name if any
      updateItem(index, "itemName", "");
    } else if (newType === "FINISHED") {
      // Reset manual input name for finished
      updateItem(index, "itemName", "");
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        itemType: "RAW",
        hsnCode: "",
        quantity: 1,
        costPrice: 0,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0,
        total: 0,
        sku: "",
        size: "",
        color: "",
        productVariantId: "",
        unitId: "",
        unitName: "",
        unitSymbol: "",
        mrp: 0,
        sellingPrice: 0,
        taxInclusive: false,
      },
    ]);
  };

  const subtotal = items.reduce((sum, item) => {
    const {
      quantity,
      costPrice,
      cgstPercent = 0,
      sgstPercent = 0,
      taxInclusive,
    } = item;

    const totalTaxPercent = cgstPercent + sgstPercent;
    const lineAmount = quantity * costPrice;

    let baseAmount;

    if (taxInclusive) {
      // Remove tax from inclusive price
      baseAmount = lineAmount / (1 + totalTaxPercent / 100);
    } else {
      // Price is already exclusive of tax
      baseAmount = lineAmount;
    }
    return sum + baseAmount;
  }, 0);

  const discount = formData.discount || 0;

  // Approximate CGST/SGST display (based on item contributions)
  const cgstTotal = items.reduce((sum, item) => {
    const qty = item.quantity || 1;
    const price = item.costPrice || 0;

    const cgstPercent = item.cgstPercent || 0;
    const sgstPercent = item.sgstPercent || 0;
    const totalPercent = cgstPercent + sgstPercent;

    const lineTotal = qty * price;

    let cgst;

    if (item.taxInclusive) {
      const base = lineTotal / (1 + totalPercent / 100);
      cgst = base * (cgstPercent / 100);
    } else {
      cgst = lineTotal * (cgstPercent / 100);
    }

    return sum + cgst;
  }, 0);

  const sgstTotal = items.reduce((sum, item) => {
    const qty = item.quantity || 1;
    const price = item.costPrice || 0;

    const cgstPercent = item.cgstPercent || 0;
    const sgstPercent = item.sgstPercent || 0;
    const totalPercent = cgstPercent + sgstPercent;

    const lineTotal = qty * price;

    let sgst;

    if (item.taxInclusive) {
      const base = lineTotal / (1 + totalPercent / 100);
      sgst = base * (sgstPercent / 100);
    } else {
      sgst = lineTotal * (sgstPercent / 100);
    }

    return sum + sgst;
  }, 0);

  const grandTotal = subtotal - discount + cgstTotal + sgstTotal;
  const updateItem = (index: number, field: keyof ItemForm, value) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];

      const updatedItem = {
        ...newItems[index],
        [field]: value,
      } as ItemForm;

      // Recalculate total if costPrice/tax/quantity/taxInclusive changes
      const priceFields = ["costPrice"];
      const taxFields = ["cgstPercent", "sgstPercent", "igstPercent"];
      if (
        priceFields.includes(field) ||
        taxFields.includes(field) ||
        field === "quantity" ||
        field === "taxInclusive"
      ) {
        const quantity = Number(updatedItem.quantity) || 0;
        const price = Number(updatedItem.costPrice) || 0;
        const cgst = Number(updatedItem.cgstPercent) || 0;
        const sgst = Number(updatedItem.sgstPercent) || 0;
        const totalTaxPercent = cgst + sgst;
        const taxInclusive = Boolean(updatedItem.taxInclusive);

        let subtotal;
        if (taxInclusive) {
          const exclusivePrice = price / (1 + totalTaxPercent / 100);
          subtotal = exclusivePrice * quantity;
        } else {
          subtotal = price * quantity;
        }
        const newTotal = subtotal * (1 + totalTaxPercent / 100);
        updatedItem.total = Number(newTotal.toFixed(2));
      }

      newItems[index] = updatedItem;
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Create Purchase</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Purchase Info
            </h2>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Purchase No"
                  placeholder="PURCHASE-001"
                  value={formData.purchaseNo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseNo: e.target.value })
                  }
                  required
                  hasError={!!errors.purchaseNo}
                  errorText={errors.purchaseNo}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomDatePicker
                  label="Purchase Date"
                  value={
                    formData.purchaseDate ? dayjs(formData.purchaseDate) : null
                  }
                  onChange={(val: Dayjs | null) =>
                    setFormData({
                      ...formData,
                      purchaseDate: val ? val.toISOString() : "",
                    })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomSearch
                  data={vendors}
                  label="Vendor Name"
                  value={selectedVendor}
                  placeholder="Search vendors or type new..."
                  hasError={!!errors.vendorName}
                  errorText={errors.vendorName}
                  getLabel={(vendor: Vendor) => vendor.name}
                  onChange={(input) =>
                    setFormData({ ...formData, vendorName: input })
                  }
                  onSelect={(vendor) => {
                    setSelectedVendor(vendor);
                    setFormData({
                      ...formData,
                      vendorName: vendor?.name || "",
                      vendorPhone: vendor?.phone || formData.vendorPhone || "",
                      vendorGstin: vendor?.gstin || formData.vendorGstin || "",
                    });
                  }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor Phone"
                  placeholder="9876543210"
                  value={formData.vendorPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendorPhone: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor GSTIN"
                  placeholder="27ABCDE1234F1Z5"
                  value={formData.vendorGstin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendorGstin: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </div>

          {/* Items Section */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Purchase Items
              </h2>
              <CustomButton variant="outlined" onClick={addItem}>
                Add Item
              </CustomButton>
            </div>
            {errors.items && <Alert severity="error">{errors.items}</Alert>}
            {errors.draftError && (
              <Alert severity="error">{errors.draftError}</Alert>
            )}
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <IconButton
                      size="small"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <Grid container spacing={2}>
                    <Grid size={2.5}>
                      <CustomSelect
                        label="Item Type"
                        value={item.itemType || ""}
                        onChange={(e) => {
                          const newType = e.target.value as "RAW" | "FINISHED";
                          updateItem(index, "itemType", newType);
                          resetItemDataOnTypeChange(index, newType);
                        }}
                        // getLabel={}
                        options={[
                          { label: "Raw Material", value: "RAW" },
                          { label: "Finished Goods", value: "FINISHED" },
                        ]}
                      />
                    </Grid>
                    <Grid size={3}>
                      {item.itemType === "RAW" ? (
                        <CustomInput
                          label="Item Name"
                          value={item.itemName || ""}
                          onChange={(e) =>
                            updateItem(index, "itemName", e.target.value)
                          }
                          hasError={!!errors[`itemName_${index}`]}
                          errorText={errors[`itemName_${index}`]}
                        />
                      ) : (
                        <CustomSearch
                          data={variantOptions}
                          label="Select Product Variant"
                          value={
                            variantOptions.find(
                              (opt) => opt.value === item.productVariantId,
                            ) || null
                          }
                          placeholder="Search product variants..."
                          hasError={!!errors[`itemName_${index}`]}
                          required
                          errorText={errors[`itemName_${index}`]}
                          getLabel={(option) =>
                            typeof option === "string" ? option : option.label
                          }
                          onChange={() => {}} // No input change needed
                          onSelect={(opt) => {
                            if (opt && typeof opt !== "string") {
                              const val = opt.value;
                              updateItem(index, "productVariantId", val);
                              handleVariantSelect(index, val);
                            }
                          }}
                          // renderOption handled internally or customize differently if needed
                        />
                      )}
                    </Grid>
                    <Grid size={2}>
                      <CustomInput
                        label="HSN Code"
                        value={item.hsnCode || ""}
                        onChange={(e) =>
                          updateItem(index, "hsnCode", e.target.value)
                        }
                        hasError={!!errors[`hsnCode_${index}`]}
                        errorText={errors[`hsnCode_${index}`]}
                        required
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <CustomInput
                        label="CGST %"
                        type="number"
                        value={item.cgstPercent || item.cgstPercent || 0}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "cgstPercent",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <CustomInput
                        label="SGST %"
                        type="number"
                        value={item.sgstPercent || item.sgstPercent || 0}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "sgstPercent",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <CustomInput
                        label="IGST %"
                        type="number"
                        value={item.igstPercent || item.igstPercent || 0}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "igstPercent",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              item.taxInclusive || item.taxInclusive || false
                            }
                            onChange={(e) =>
                              updateItem(
                                index,
                                "taxInclusive",
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Tax Inclusive"
                      />
                    </Grid>
                    <Grid size={2}>
                      <CustomInput
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        required
                        hasError={!!errors[`quantity_${index}`]}
                        errorText={errors[`quantity_${index}`]}
                      />
                    </Grid>
                    <Grid size={2}>
                      <CustomSelect
                        label="Unit"
                        value={item.unitId || ""}
                        onChange={(e) => {
                          const unitId = e.target.value as string;
                          updateItem(index, "unitId", unitId);
                          const selectedUnit = units.find(
                            (u: Unit) => u.id === unitId,
                          );
                          if (selectedUnit) {
                            updateItem(
                              index,
                              "unitName",
                              selectedUnit.unitName,
                            );
                            updateItem(
                              index,
                              "unitSymbol",
                              selectedUnit.symbol,
                            );
                          }
                        }}
                        options={unitOptions}
                        required
                        hasError={!!errors[`unit_id_${index}`]}
                        errorText={errors[`unit_id_${index}`]}
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <CustomInput
                        label="Cost Price"
                        type="number"
                        value={item.costPrice || 0}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "costPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={3.5}>
                      <CustomInput
                        label="Total"
                        type="number"
                        value={item.total}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          {items.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Purchase Summary
              </h2>
              <div className="bg-blue-50 border rounded-lg p-6">
                <Grid container spacing={2}>
                  <Grid size={5}>
                    <CustomInput
                      label="Discount Amount (₹)"
                      type="number"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </Grid>
                  <Grid size={12}>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">
                          ₹
                          {subtotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>CGST:</span>
                        <span className="font-semibold">
                          ₹
                          {cgstTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>SGST:</span>
                        <span className="font-semibold">
                          ₹
                          {sgstTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-red-600 font-semibold">
                        <span>Discount:</span>
                        <span>
                          -₹
                          {discount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-2xl font-bold text-gray-900">
                          <span>Total:</span>
                          <span>
                            ₹
                            {grandTotal.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <CustomButton
              variant="outlined"
              onClick={() => navigate("/purchases")}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              className="bg-gray-600!"
              onClick={handleDraftSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Purchase"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchasePage;
