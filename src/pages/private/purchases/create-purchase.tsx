import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Grid, IconButton } from "@mui/material";
import { addPurchase, clearError } from "../../../slices/purchasesSlice";
import { usePurchases } from "../../../hooks/usePurchases";
import { useProducts } from "../../../hooks/useProducts";
import type { AddPurchaseForm } from "../../../types/purchase";
import CustomInput from "../../../components/CustomInput";
import CustomSelect from "../../../components/CustomSelect";
import CustomButton from "../../../components/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AppDispatch } from "../../../store";
import type { Product, ProductVariant } from "../../../types/product";
import { isValidGST, isValidPhone } from "../../../utils/validation";
import CustomDatePicker from "../../../components/CustomDatePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

type ItemForm = {
  item_name: string;
  item_type: string;
  hsn_code: string;
  quantity: number;
  price: number;
  cgst_percent: number;
  sgst_percent: number;
  igst_percent: number;
  sku?: string;
  size?: string;
  color?: string;
  product_variant_id?: string;
};

const CreatePurchasePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = usePurchases();
  const { products } = useProducts();
  const [formData, setFormData] = useState<Partial<AddPurchaseForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<ItemForm[]>([]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!formData.purchase_no?.trim()) {
      newErrors.purchase_no = "Purchase No required";
      valid = false;
    }
    if (!formData.vendor_name?.trim()) {
      newErrors.vendor_name = "Vendor name required";
      valid = false;
    }
    if (formData.vendor_phone && !isValidPhone(formData.vendor_phone)) {
      newErrors.vendor_phone = "Invalid Phone number";
      valid = false;
    }
    if (formData.vendor_gstin && !isValidGST(formData.vendor_gstin)) {
      newErrors.vendor_gstin = "Invalid GSTIN";
      valid = false;
    }

    // Validate items
    items.forEach((item, index) => {
      if (!item.item_type) {
        newErrors[`item_type_${index}`] = "Item type required";
        valid = false;
      }
      if (!item.item_name.trim()) {
        newErrors[`item_name_${index}`] = "Item name required";
        valid = false;
      }
      if (!item.hsn_code.trim()) {
        newErrors[`hsn_code_${index}`] = "HSN code required";
        valid = false;
      }
      if (item.quantity <= 0) {
        newErrors[`quantity_${index}`] = "Quantity must be > 0";
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
    if (!formData.purchase_no?.trim() || items.length === 0) {
      alert("Purchase No and at least one item required for draft");
      return;
    }

    const submitData: AddPurchaseForm = {
      purchase_no: formData.purchase_no!.trim(),
      vendor_name: formData.vendor_name?.trim() || undefined,
      vendor_phone: formData.vendor_phone?.trim() || undefined,
      vendor_gstin: formData.vendor_gstin?.trim() || undefined,
      purchase_date:
        formData.purchase_date || new Date().toISOString().split("T")[0],
      items,
    };

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
    if (!validateForm()) return;

    const submitData: AddPurchaseForm = {
      purchase_no: formData.purchase_no!.trim(),
      vendor_name: formData.vendor_name?.trim() || undefined,
      vendor_phone: formData.vendor_phone?.trim() || undefined,
      vendor_gstin: formData.vendor_gstin?.trim() || undefined,
      purchase_date:
        formData.purchase_date || new Date().toISOString().split("T")[0],
      items,
    };

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
    console.log("products:", products);
    const options: { label: string; value: string; variant: ProductVariant }[] =
      [];
    products.forEach((product: Product) => {
      product.variant.forEach((v) => {
        options.push({
          label: `${product.name} - ${v.sku || v.size}/${v.color}`,
          value: v.id,
          variant: v,
        });
      });
    });
    console.log("variantOptions:", options);
    return options;
  }, [products]);

  const handleVariantSelect = (index: number, variantId: string) => {
    const option = variantOptions.find((opt) => opt.value === variantId);
    if (option && option.variant) {
      const v = option.variant;
      console.log("variant data:", v);
      const productName =
        products.find((p) => p.variant.some((vv) => vv.id === v.id))?.name ||
        "";
      updateItem(
        index,
        "item_name",
        `${productName} - ${v.sku || v.size}/${v.color}`,
      );
      updateItem(index, "sku", v.sku || "");
      updateItem(index, "size", v.size);
      updateItem(index, "color", v.color);
      updateItem(index, "price", v.costPrice);
      updateItem(index, "cgst_percent", 9);
      updateItem(index, "sgst_percent", 9);
      updateItem(index, "item_type", "FINISHED");
    } else {
      console.log("no option found for variantId:", variantId);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item_name: "",
        item_type: "RAW",
        hsn_code: "",
        quantity: 1,
        price: 0,
        cgst_percent: 0,
        sgst_percent: 0,
        igst_percent: 0,
        sku: "",
        size: "",
        color: "",
        product_variant_id: "",
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof ItemForm,
    value: ItemForm[keyof ItemForm],
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Create Purchase</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Purchase Header
            </h2>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Purchase No *"
                  placeholder="PURCHASE-001"
                  value={formData.purchase_no || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, purchase_no: e.target.value })
                  }
                  hasError={!!errors.purchase_no}
                  errorText={errors.purchase_no}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomDatePicker
                  label="Purchase Date"
                  value={
                    formData.purchase_date
                      ? dayjs(formData.purchase_date)
                      : null
                  }
                  onChange={(val: Dayjs | null) =>
                    setFormData({
                      ...formData,
                      purchase_date: val ? val.toISOString() : "",
                    })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor Name *"
                  placeholder="ABC Vendor"
                  value={formData.vendor_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_name: e.target.value })
                  }
                  hasError={!!errors.vendor_name}
                  errorText={errors.vendor_name}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor Phone"
                  placeholder="9876543210"
                  value={formData.vendor_phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_phone: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor GSTIN"
                  placeholder="27ABCDE1234F1Z5"
                  value={formData.vendor_gstin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_gstin: e.target.value })
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
                    <Grid size={2}>
                      <CustomSelect
                        label="Item Type *"
                        value={item.item_type}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "item_type",
                            e.target.value as string,
                          )
                        }
                        options={[
                          { label: "Raw Material", value: "RAW" },
                          { label: "Finished Goods", value: "FINISHED" },
                        ]}
                      />
                    </Grid>
                    <Grid size={3}>
                      {item.item_type === "RAW" ? (
                        <CustomInput
                          label="Item Name *"
                          value={item.item_name}
                          onChange={(e) =>
                            updateItem(index, "item_name", e.target.value)
                          }
                          hasError={!!errors[`item_name_${index}`]}
                          errorText={errors[`item_name_${index}`]}
                        />
                      ) : (
                        <CustomSelect
                          label="Select Product Variant *"
                          value={item.product_variant_id || ""}
                          onChange={(e) => {
                            const val = e.target.value as string;
                            updateItem(index, "product_variant_id", val);
                            handleVariantSelect(index, val);
                          }}
                          options={variantOptions.map((opt) => ({
                            label: opt.label,
                            value: opt.value,
                          }))}
                          hasError={!!errors[`item_name_${index}`]}
                          errorText={errors[`item_name_${index}`]}
                        />
                      )}
                    </Grid>
                    <Grid size={2}>
                      <CustomInput
                        label="HSN Code *"
                        value={item.hsn_code}
                        onChange={(e) =>
                          updateItem(index, "hsn_code", e.target.value)
                        }
                        hasError={!!errors[`hsn_code_${index}`]}
                        errorText={errors[`hsn_code_${index}`]}
                      />
                    </Grid>
                    <Grid size={2}>
                      <CustomInput
                        label="Quantity *"
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
                        errorText={errors[`quantity_${index}`]}
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
                        label="CGST %"
                        type="number"
                        value={item.cgst_percent}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "cgst_percent",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </Grid>
                    <Grid size={1.5}>
                      <CustomInput
                        label="SGST %"
                        type="number"
                        value={item.sgst_percent}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "sgst_percent",
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
