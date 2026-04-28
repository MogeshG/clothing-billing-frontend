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
import { updateCustomer } from "../../../slices/customersSlice";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import {
  updateCustomerSchema,
  type UpdateCustomerForm,
} from "../../../validation/customers";
import type { Customer } from "../../../types/customer";
import { useCustomers } from "../../../hooks/useCustomers";

interface EditCustomerDialogProps {
  open: boolean;
  customerId: string | null;
  onClose: () => void;
}

const EditCustomerDialog = ({
  open,
  customerId,
  onClose,
}: EditCustomerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, refetch } = useCustomers();

  const customer = React.useMemo(
    () => customers.find((c) => c.id === customerId) || null,
    [customers, customerId],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateCustomerForm>({
    resolver: zodResolver(updateCustomerSchema),
  });

  React.useEffect(() => {
    if (open && customer) {
      reset({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address || "",
      });
    } else if (!open) {
      reset();
    }
  }, [customer, open, reset]);

  const onSubmit = async (data: UpdateCustomerForm) => {
    if (!customerId) return;

    const updateData = {
      ...data,
      id: customerId,
    };

    try {
      await dispatch(updateCustomer(updateData as Customer)).unwrap();
      onClose();
      refetch();
    } catch (error) {
      console.error("Update customer failed", error);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  if (!customer || !open) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle className="text-lg font-semibold">
          Edit Customer
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
              rows={4}
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
            {isSubmitting ? "Updating..." : "Update Customer"}
          </CustomButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCustomerDialog;
