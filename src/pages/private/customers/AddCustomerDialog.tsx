import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store";
import { addCustomer } from "../../../slices/customersSlice";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import {
  createCustomerSchema,
  type CreateCustomerForm,
} from "../../../validation/customers";
import { useCustomers } from "../../../hooks/useCustomers";

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (customer: any) => void;
}

const AddCustomerDialog = ({
  open,
  onClose,
  onSuccess,
}: AddCustomerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { refetch } = useCustomers();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCustomerForm>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateCustomerForm) => {
    try {
      const result = await dispatch(addCustomer(data)).unwrap();
      if (onSuccess) {
        const created = result.find((c: any) => c.phone === data.phone);
        if (created) onSuccess(created);
      }
      onClose();
      refetch();
      reset();
    } catch (error) {
      console.error("Add customer failed", error);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="text-lg p-3 font-semibold">
          Add New Customer
        </DialogTitle>

        <Divider />

        <DialogContent>
          <div className="space-y-4 mt-2">
            <CustomInput
              label="Name *"
              {...register("name")}
              className="w-80!"
              hasError={!!errors.name}
              errorText={errors.name?.message}
              fixedErrorSpace
            />

            <CustomInput
              label="Phone *"
              {...register("phone")}
              className="w-80!"
              hasError={!!errors.phone}
              errorText={errors.phone?.message}
              fixedErrorSpace
            />

            <CustomInput
              label="Email"
              type="email"
              {...register("email")}
              className="w-80!"
              hasError={!!errors.email}
              errorText={errors.email?.message}
              fixedErrorSpace
            />

            <CustomInput
              label="Address"
              multiline
              rows={3}
              className="w-full"
              {...register("address")}
            />
          </div>
        </DialogContent>

        <Divider />

        <DialogActions className="px-6 py-4">
          <Button onClick={handleClose} disabled={isSubmitting} type="button">
            Cancel
          </Button>

          <CustomButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Customer"}
          </CustomButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCustomerDialog;
