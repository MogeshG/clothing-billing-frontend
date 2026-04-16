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
import type { AddCustomerForm, Customer } from "../../../types/customer";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store";
import { updateCustomer } from "../../../slices/customersSlice";
import { useCustomers } from "../../../hooks/useCustomers";
import { isValidEmail, isValidPhone } from "../../../utils/validation";

interface EditCustomerDialogProps {
  open: boolean;
  customerId: string | null;
  onClose: () => void;
}

const initialState: AddCustomerForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

const EditCustomerDialog = ({
  open,
  customerId,
  onClose,
}: EditCustomerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers } = useCustomers();

  const [formData, setFormData] = useState<AddCustomerForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddCustomerForm>>({});

  useEffect(() => {
    if (!customerId) return;

    const customer = customers.find((c: Customer) => c.id === customerId);

    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
      });
    }
  }, [customerId, customers]);

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
      newErrors.phone = "Enter a valid phone number";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateCustomer = async () => {
    if (!customerId) return;
    if (!validate()) return;

    const updatedCustomer: Partial<Customer> = {
      id: customerId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || undefined,
      address: formData.address?.trim() || undefined,
    };

    try {
      setLoading(true);

      await dispatch(updateCustomer(updatedCustomer as Customer)).unwrap();

      onClose();
      setFormData(initialState);
      setErrors({});
    } catch (err) {
      console.error("Update customer failed", err);
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
      <DialogTitle className="text-lg font-semibold">Edit Customer</DialogTitle>

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
            label="Address"
            name="address"
            multiline
            rows={4}
            className="w-100!"
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

        <CustomButton onClick={handleUpdateCustomer} disabled={loading}>
          {loading ? "Updating..." : "Update Customer"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomerDialog;
