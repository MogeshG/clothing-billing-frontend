import React, { useState } from "react";
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
import type { AddProductCategoryForm } from "../../../types/productCategory";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store";
import { addProductCategory } from "../../../slices/productCategoriesSlice";

interface AddProductCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialState: AddProductCategoryForm = {
  name: "",
  description: "",
};

const AddProductCategoryDialog = ({
  open,
  onClose,
}: AddProductCategoryDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] =
    useState<AddProductCategoryForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddProductCategoryForm>>({});

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

  const handleAddProductCategory = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await dispatch(addProductCategory(formData)).unwrap();

      setFormData(initialState);
      setErrors({});
      onClose();
    } catch (err) {
      console.error("Add product category failed", err);
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
      <DialogTitle className="text-lg p-3! font-semibold">
        Add New Product Category
      </DialogTitle>

      <Divider />

      <DialogContent>
        <div className="space-y-2 mt-2">
          <CustomInput
            label="Name *"
            name="name"
            value={formData.name}
            className="w-80!"
            onChange={handleInputChange}
            hasError={!!errors.name}
            errorText={errors.name}
            fixedErrorSpace
          />

          <CustomInput
            label="Description"
            name="description"
            multiline
            rows={3}
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

        <CustomButton onClick={handleAddProductCategory} disabled={loading}>
          {loading ? "Saving..." : "Add Category"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductCategoryDialog;
