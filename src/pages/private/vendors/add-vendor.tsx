import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Grid } from "@mui/material";
import { addVendor, clearError } from "../../../slices/vendorsSlice";
import { useVendors } from "../../../hooks/useVendors";
import {
  createVendorSchema,
  type VendorFormType,
} from "../../../validation/vendors";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import type { AppDispatch } from "../../../store";
import type { Vendor } from "../../../types/vendor";

const AddVendorPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useVendors();
  const form = useForm<VendorFormType>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      country: "India",
    },
  });
  const {
    register,
    formState: { errors: formErrors, isSubmitting },
    reset,
  } = form;

  // Clear redux error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: VendorFormType) => {
    try {
      await dispatch(addVendor(data as Vendor)).unwrap();
      navigate("/vendors");
      reset();
    } catch (err) {
      console.error("Add vendor failed:", err);
    }
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Add New Vendor</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-700">
                Vendor Details
              </h2>
              <p className="text-sm text-gray-500">
                Fill in the details of the new vendor below.
              </p>
            </div>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("name")}
                  label="Name"
                  placeholder="Enter vendor name"
                  hasError={!!formErrors.name}
                  errorText={formErrors.name?.message}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("phone")}
                  label="Phone"
                  placeholder="Enter phone number"
                  hasError={!!formErrors.phone}
                  errorText={formErrors.phone?.message}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("email")}
                  label="Email"
                  type="email"
                  placeholder="Enter email (optional)"
                  hasError={!!formErrors.email}
                  errorText={formErrors.email?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("companyName")}
                  label="Company Name"
                  placeholder="Enter company name"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("gstin")}
                  label="GSTIN"
                  placeholder="Enter GSTIN"
                  hasError={!!formErrors.gstin}
                  errorText={formErrors.gstin?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("city")}
                  label="City"
                  placeholder="Enter city"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("state")}
                  label="State"
                  placeholder="Enter state"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("country")}
                  label="Country"
                  placeholder="India"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  {...register("address")}
                  label="Address"
                  placeholder="Enter full address"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </div>

          <div className="flex justify-end w-full gap-4">
            <CustomButton
              variant="outlined"
              onClick={() => navigate("/vendors")}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>

            <CustomButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Vendor"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendorPage;
