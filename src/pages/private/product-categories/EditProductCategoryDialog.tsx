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
import type {
  AddProductCategoryForm,
  ProductCategory,
} from "../../../types/productCategory";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store";
import { updateProductCategory } from "../../../slices/productCategoriesSlice";
import { useProductCategories } from "../../../hooks/useProductCategories";

interface EditProductCategoryDialogProps {
  open: boolean;
  categoryId: string | null;
  onClose: () => void;
}

const initialState: AddProductCategoryForm = {
  name: "",
  description: "",
};

const EditProductCategoryDialog = ({
  open,
  categoryId,
  onClose,
}: EditProductCategoryDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productCategories } = useProductCategories();

  const [formData, setFormData] =
    useState<AddProductCategoryForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddProductCategoryForm>>({});

  useEffect(() => {
    if (!categoryId) return;

    const category = productCategories.find(
      (c: ProductCategory) => c.id === categoryId,
    );

    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [categoryId, productCategories]);

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
  };

  const validate = () => {
    const newErrors: Partial<AddProductCategoryForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProductCategory = async () => {
    if (!categoryId) return;
    if (!validate()) return;

    const updatedCategory: Partial<ProductCategory> = {
      id: categoryId,
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
    };

    try {
      setLoading(true);

      await dispatch(
        updateProductCategory(updatedCategory as ProductCategory),
      ).unwrap();

      onClose();
      setFormData(initialState);
      setErrors({});
    } catch (err) {
      console.error("Update product category failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setFormData(initialState);
    setErrors({});
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
            label="Name *"
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
          />
        </div>
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
