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
import type { AddCustomerForm } from "../../../types/customer";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store";
import { addCustomer } from "../../../slices/customersSlice";
import { isValidEmail, isValidPhone } from "../../../utils/validation";

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
}

const initialState: AddCustomerForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

const AddCustomerDialog = ({ open, onClose }: AddCustomerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<AddCustomerForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddCustomerForm>>({});

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
    const newErrors: Partial<AddCustomerForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Phone is required";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddCustomer = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await dispatch(addCustomer(formData)).unwrap();

      setFormData(initialState);
      setErrors({});
      onClose();
    } catch (err) {
      console.error("Add customer failed", err);
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
        Add New Customer
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
            label="Phone *"
            name="phone"
            className="w-80!"
            value={formData.phone}
            onChange={handleInputChange}
            hasError={!!errors.phone}
            errorText={errors.phone}
            fixedErrorSpace
          />

          <CustomInput
            label="Email"
            name="email"
            type="email"
            className="w-80!"
            value={formData.email}
            onChange={handleInputChange}
            hasError={!!errors.email}
            errorText={errors.email}
            fixedErrorSpace
          />

          <CustomInput
            multiline
            rows={4}
            className="w-100!"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
      </DialogContent>

      <Divider />

      <DialogActions className="px-6 py-4">
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <CustomButton onClick={handleAddCustomer} disabled={loading}>
          {loading ? "Saving..." : "Add Customer"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
