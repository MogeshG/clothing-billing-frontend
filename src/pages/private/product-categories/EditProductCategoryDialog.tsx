import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import {
  updateCategorySchema,
  type UpdateCategoryForm,
} from "../../../validation/categories";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store";
import {
  updateProductCategory,
  clearError,
} from "../../../slices/productCategoriesSlice";
import { useProductCategories } from "../../../hooks/useProductCategories";
import type { ProductCategory } from "../../../types/productCategory";

interface EditProductCategoryDialogProps {
  open: boolean;
  categoryId: string | null;
  onClose: () => void;
}

const initialState: UpdateCategoryForm = {
  name: "",
  description: "",
};

const EditProductCategoryDialog = ({
  open,
  categoryId,
  onClose,
}: EditProductCategoryDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productCategories, error } = useSelector(
    (state: RootState) => state.productCategories,
  );
  const { refetch } = useProductCategories();

  const [formData, setFormData] = useState<UpdateCategoryForm>(initialState);
  const [errors, setErrors] = useState<Partial<UpdateCategoryForm>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!categoryId || !open) return;

    const category = productCategories.find((c) => c.id === categoryId);
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
      setErrors({});
      setSubmitError("");
      dispatch(clearError());
    }
  }, [categoryId, productCategories, open, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setSubmitError("");
  };

  const validate = (data: UpdateCategoryForm) => {
    const result = updateCategorySchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<UpdateCategoryForm> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          fieldErrors[issue.path[0] as keyof UpdateCategoryForm] =
            issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleUpdateProductCategory = async () => {
    if (!categoryId) return;
    if (!validate(formData)) return;

    const updatedCategory: Partial<ProductCategory> & { id: string } = {
      id: categoryId,
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
    };

    setLoading(true);
    setSubmitError("");

    try {
      await dispatch(updateProductCategory(updatedCategory)).unwrap();
      refetch();
      onClose();
    } catch (err) {
      setSubmitError((err as Error).message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle className="text-lg font-semibold">
        Edit Product Category
      </DialogTitle>

      <Divider />

      <DialogContent>
        <div className="space-y-3 mt-2">
          <CustomInput
            label="Name"
            name="name"
            className="w-80!"
            value={formData.name}
            onChange={handleInputChange}
            hasError={!!errors.name}
            errorText={errors.name}
            fixedErrorSpace
          />

          <CustomInput
            label="Description"
            name="description"
            multiline
            rows={4}
            className="w-100!"
            value={formData.description}
            onChange={handleInputChange}
            hasError={!!errors.description}
            errorText={errors.description}
            fixedErrorSpace
          />
        </div>
        {(error || submitError) && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error || submitError}</p>
          </div>
        )}
      </DialogContent>

      <Divider />

      <DialogActions className="px-6 py-4">
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <CustomButton onClick={handleUpdateProductCategory} disabled={loading}>
          {loading ? "Updating..." : "Update Category"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductCategoryDialog;
