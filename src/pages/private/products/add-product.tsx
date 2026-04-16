import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { addProduct, clearError } from "../../../slices/productsSlice";
import { useProducts } from "../../../hooks/useProducts";
import type {
  AddProductForm,
  ProductVariantInput,
} from "../../../types/product";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import type { AppDispatch } from "../../../store";

const AddProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useProducts();
  const [formData, setFormData] = useState<Partial<AddProductForm>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [variantErrors, setVariantErrors] = useState<
    Record<number, Record<string, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variants, setVariants] = useState<ProductVariantInput[]>([]);
  const [newVariant, setNewVariant] = useState<Partial<ProductVariantInput>>({
    size: "",
    color: "",
    barcode: "",
    costPrice: 0,
    sellingPrice: 0,
    mrp: 0,
  });

  // Clear redux error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const addVariant = () => {
    const variantErrorsList: Record<string, string> = {};
    if (!newVariant.size?.trim()) variantErrorsList.size = "Size required";
    if (!newVariant.color?.trim()) variantErrorsList.color = "Color required";
    if (!newVariant.barcode?.trim())
      variantErrorsList.barcode = "Barcode required";
    if (typeof newVariant.costPrice !== "number" || newVariant.costPrice! <= 0)
      variantErrorsList.costPrice = "Valid cost price required";
    if (
      typeof newVariant.sellingPrice !== "number" ||
      newVariant.sellingPrice! <= 0
    )
      variantErrorsList.sellingPrice = "Valid selling price required";
    if (typeof newVariant.mrp !== "number" || newVariant.mrp! <= 0)
      variantErrorsList.mrp = "Valid MRP required";

    if (Object.keys(variantErrorsList).length > 0) {
      setVariantErrors({ ...variantErrors, [-1]: variantErrorsList });
      return;
    }

    const completeVariant: ProductVariantInput = {
      size: newVariant.size!,
      color: newVariant.color!,
      barcode: newVariant.barcode!,
      sku: newVariant.sku || null,
      costPrice: newVariant.costPrice!,
      sellingPrice: newVariant.sellingPrice!,
      mrp: newVariant.mrp!,
    };
    setVariants([...variants, completeVariant]);
    setNewVariant({
      size: "",
      color: "",
      barcode: "",
      costPrice: 0,
      sellingPrice: 0,
      mrp: 0,
    });
    setVariantErrors({ ...variantErrors });
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
    const updatedErrors = { ...variantErrors };
    delete updatedErrors[index];
    setVariantErrors(updatedErrors);
  };

  const updateNewVariant = (
    field: keyof ProductVariantInput,
    value: string | number,
  ) => {
    setNewVariant({ ...newVariant, [field]: value });
    // Clear error
    const tempErrors = variantErrors[-1] || {};
    if (tempErrors[field as string]) {
      const updated = { ...variantErrors };
      const newTemp = { ...updated[-1] };
      delete newTemp[field as string];
      updated[-1] = newTemp;
      setVariantErrors(updated);
    }
  };

  const updateVariantField = (
    index: number,
    field: keyof ProductVariantInput,
    value: string | number,
  ) => {
    const updatedVariants = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v,
    );
    setVariants(updatedVariants);
    // Clear error
    const errorsForVariant = variantErrors[index] || {};
    if (errorsForVariant[field as string]) {
      const updatedErrors = { ...variantErrors };
      const newErrorsForVariant = { ...updatedErrors[index] };
      delete newErrorsForVariant[field as string];
      updatedErrors[index] = newErrorsForVariant;
      setVariantErrors(updatedErrors);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let valid = true;

    if (!formData.name?.trim()) {
      errors.name = "Product name is required";
      valid = false;
    }
    if (!formData.hsnCode?.trim()) {
      errors.hsnCode = "HSN code is required";
      valid = false;
    }
    if (!formData.categoryId?.trim()) {
      errors.categoryId = "Category is required";
      valid = false;
    }
    if (
      typeof formData.gstPercent !== "number" ||
      formData.gstPercent! < 0 ||
      formData.gstPercent! > 100
    ) {
      errors.gstPercent = "GST must be between 0-100";
      valid = false;
    }

    // Validate variants
    if (variants.length === 0) {
      valid = false;
      // Set a general error, perhaps via formErrors or handle separately
    } else {
      variants.forEach((variant, index) => {
        const vErrors: Record<string, string> = {};
        if (!variant.size.trim()) vErrors.size = "Size required";
        if (!variant.color.trim()) vErrors.color = "Color required";
        if (!variant.barcode.trim()) vErrors.barcode = "Barcode required";
        if (variant.costPrice <= 0)
          vErrors.costPrice = "Valid cost price required";
        if (variant.sellingPrice <= 0)
          vErrors.sellingPrice = "Valid selling price required";
        if (variant.mrp <= 0) vErrors.mrp = "Valid MRP required";
        if (Object.keys(vErrors).length > 0) {
          setVariantErrors((prev) => ({ ...prev, [index]: vErrors }));
          valid = false;
        }
      });
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: AddProductForm = {
      ...(formData as Omit<AddProductForm, "variants">),
      variants,
      taxInclusive: formData.taxInclusive || false,
    } as AddProductForm;

    setIsSubmitting(true);
    try {
      await dispatch(addProduct(submitData)).unwrap();
      navigate("/products");
    } catch (err) {
      console.error("Add product failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof Omit<AddProductForm, "variants">,
    value: string | number | boolean,
  ) => {
    setFormData({ ...formData, [field]: value });
    // Clear field error on change
    if (formErrors[field as string]) {
      setFormErrors({ ...formErrors, [field as string]: "" });
    }
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-700">
                Product Details
              </h2>
              <p className="text-sm text-gray-500">
                Fill in the details of the new product below.
              </p>
            </div>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="Product Name"
                  placeholder="Enter product name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  hasError={!!formErrors.name}
                  errorText={formErrors.name}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="Brand"
                  placeholder="Enter brand name"
                  value={formData.brand || ""}
                  onChange={(e) => handleChange("brand", e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="SKU"
                  placeholder="Enter SKU"
                  value={formData.sku || ""}
                  onChange={(e) => handleChange("sku", e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                <CustomInput
                  label="HSN Code"
                  placeholder="Enter HSN code"
                  value={formData.hsnCode || ""}
                  onChange={(e) => handleChange("hsnCode", e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="Category"
                  placeholder="e.g., cat1"
                  value={formData.categoryId || ""}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  hasError={!!formErrors.categoryId}
                  errorText={formErrors.categoryId}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                <CustomInput
                  label="GST %"
                  type="number"
                  placeholder="0"
                  value={formData.gstPercent || ""}
                  onChange={(e) =>
                    handleChange("gstPercent", parseFloat(e.target.value) || 0)
                  }
                  hasError={!!formErrors.gstPercent}
                  errorText={formErrors.gstPercent}
                  endIcon="%"
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, lg: 2 }}>
                <FormControlLabel
                  label="Tax Inclusive"
                  control={
                    <Checkbox
                      checked={formData.taxInclusive || false}
                      onChange={(e) =>
                        handleChange("taxInclusive", e.target.checked)
                      }
                    />
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  label="Description"
                  placeholder="Enter product description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-700">
                  Variants Details
                </h2>
                <p className="text-sm text-gray-500">Add variants</p>
              </div>
              <CustomButton
                variant="outlined"
                size="small"
                className="h-fit! py-2!"
                startIcon={<AddIcon />}
                onClick={addVariant}
              >
                Add Variant
              </CustomButton>
            </div>
            {/* New Variant Form */}
            <div className="border p-4 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600 mb-3 font-medium">
                New Variant Details:
              </p>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <CustomInput
                    label="Size"
                    placeholder="e.g., M"
                    value={newVariant.size || ""}
                    onChange={(e) => updateNewVariant("size", e.target.value)}
                    hasError={!!variantErrors[-1]?.size}
                    errorText={variantErrors[-1]?.size}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <CustomInput
                    label="Color"
                    placeholder="e.g., Blue"
                    value={newVariant.color || ""}
                    onChange={(e) => updateNewVariant("color", e.target.value)}
                    hasError={!!variantErrors[-1]?.color}
                    errorText={variantErrors[-1]?.color}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <CustomInput
                    label="Barcode"
                    placeholder="Enter barcode"
                    value={newVariant.barcode || ""}
                    onChange={(e) =>
                      updateNewVariant("barcode", e.target.value)
                    }
                    hasError={!!variantErrors[-1]?.barcode}
                    errorText={variantErrors[-1]?.barcode}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <CustomInput
                    label="SKU"
                    placeholder="Optional"
                    value={newVariant.sku || ""}
                    onChange={(e) => updateNewVariant("sku", e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <CustomInput
                    label="Cost Price"
                    type="number"
                    placeholder="0"
                    value={newVariant.costPrice || ""}
                    onChange={(e) =>
                      updateNewVariant(
                        "costPrice",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    startIcon="₹"
                    hasError={!!variantErrors[-1]?.costPrice}
                    errorText={variantErrors[-1]?.costPrice}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <CustomInput
                    label="MRP"
                    type="number"
                    placeholder="0"
                    value={newVariant.mrp || ""}
                    onChange={(e) =>
                      updateNewVariant("mrp", parseFloat(e.target.value) || 0)
                    }
                    startIcon="₹"
                    hasError={!!variantErrors[-1]?.mrp}
                    errorText={variantErrors[-1]?.mrp}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <CustomInput
                    label="Selling Price"
                    type="number"
                    placeholder="0"
                    value={newVariant.sellingPrice || ""}
                    onChange={(e) =>
                      updateNewVariant(
                        "sellingPrice",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    startIcon="₹"
                    hasError={!!variantErrors[-1]?.sellingPrice}
                    errorText={variantErrors[-1]?.sellingPrice}
                    required
                  />
                </Grid>
              </Grid>
            </div>

            {/* Existing Variants List */}
            {variants.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  Existing Variants ({variants.length}):
                </p>
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-md bg-white mb-3"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">
                          {variant.size} - {variant.color}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Barcode: {variant.barcode}
                        </p>
                      </div>
                      <IconButton
                        size="small"
                        onClick={() => removeVariant(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CustomInput
                          label="Size"
                          value={variant.size}
                          onChange={(e) =>
                            updateVariantField(index, "size", e.target.value)
                          }
                          hasError={!!variantErrors[index]?.size}
                          errorText={variantErrors[index]?.size}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CustomInput
                          label="Color"
                          value={variant.color}
                          onChange={(e) =>
                            updateVariantField(index, "color", e.target.value)
                          }
                          hasError={!!variantErrors[index]?.color}
                          errorText={variantErrors[index]?.color}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CustomInput
                          label="Barcode"
                          value={variant.barcode}
                          onChange={(e) =>
                            updateVariantField(index, "barcode", e.target.value)
                          }
                          hasError={!!variantErrors[index]?.barcode}
                          errorText={variantErrors[index]?.barcode}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CustomInput
                          label="SKU"
                          value={variant.sku || ""}
                          onChange={(e) =>
                            updateVariantField(index, "sku", e.target.value)
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <CustomInput
                          label="Cost Price"
                          type="number"
                          value={variant.costPrice}
                          onChange={(e) =>
                            updateVariantField(
                              index,
                              "costPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          startIcon="₹"
                          hasError={!!variantErrors[index]?.costPrice}
                          errorText={variantErrors[index]?.costPrice}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <CustomInput
                          label="Selling Price"
                          type="number"
                          value={variant.sellingPrice}
                          onChange={(e) =>
                            updateVariantField(
                              index,
                              "sellingPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          startIcon="₹"
                          hasError={!!variantErrors[index]?.sellingPrice}
                          errorText={variantErrors[index]?.sellingPrice}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <CustomInput
                          label="MRP"
                          type="number"
                          value={variant.mrp}
                          onChange={(e) =>
                            updateVariantField(
                              index,
                              "mrp",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          startIcon="₹"
                          hasError={!!variantErrors[index]?.mrp}
                          errorText={variantErrors[index]?.mrp}
                        />
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end w-full gap-4">
            <CustomButton
              variant="outlined"
              onClick={() => navigate("/products")}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              disabled={isSubmitting}
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
