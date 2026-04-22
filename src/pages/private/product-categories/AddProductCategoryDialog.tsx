import React, { useState, useEffect } from "react";
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
  createCategorySchema,
  type CreateCategoryForm,
} from "../../../validation/categories";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../../store";
import {
  addProductCategory,
  clearError,
} from "../../../slices/productCategoriesSlice";

interface AddProductCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialState: CreateCategoryForm = {
  name: "",

  description: "",
};

const AddProductCategoryDialog = ({
  open,
  onClose,
}: AddProductCategoryDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.productCategories);

  const [formData, setFormData] = useState<CreateCategoryForm>(initialState);
  const [errors, setErrors] = useState<Partial<CreateCategoryForm>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open) {
      setFormData(initialState);
      setErrors({});
      setSubmitError("");
      dispatch(clearError());
    }
  }, [open, dispatch]);

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

  const validate = (data: CreateCategoryForm) => {
    const result = createCategorySchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<CreateCategoryForm> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          fieldErrors[issue.path[0] as keyof CreateCategoryForm] =
            issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleAddProductCategory = async () => {
    if (!validate(formData)) return;

    setLoading(true);
    setSubmitError("");

    try {
      await dispatch(addProductCategory(formData)).unwrap();
      onClose();
    } catch (err) {
      setSubmitError((err as Error).message || "Failed to create category");
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

        <CustomButton
          onClick={handleAddProductCategory}
          disabled={loading || !formData.name}
        >
          {loading ? "Saving..." : "Add Category"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductCategoryDialog;
