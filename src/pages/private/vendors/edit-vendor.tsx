import { useEffect, useState } from "react";
import useForm from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Grid } from "@mui/material";
import { updateVendor, clearError } from "../../../slices/vendorsSlice";
import { useVendors } from "../../../hooks/useVendors";
import {
  updateVendorSchema,
} from "../../../validation/vendors";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import type { AppDispatch } from "../../../store";
import axios from "axios";
import { API_BASE } from "../../../utils/auth";

const EditVendorPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error: reduxError } = useVendors();
  const form = useForm({
    resolver: zodResolver(updateVendorSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    reset,
  } = form;

  const [apiError, setApiError] = useState("");

  // Clear redux error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Fetch vendor by ID and set form values
  useEffect(() => {
    if (!id) return;
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`/v1/vendors/${id}`, {
          baseURL: API_BASE,
        });
        const vendorData = response.data.vendor;
        reset({
          name: vendorData.name,
          phone: vendorData.phone,
          email: vendorData.email || "",
          address: vendorData.address || "",
          gstin: vendorData.gstin || "",
          companyName: vendorData.companyName,
          city: vendorData.city || "",
          state: vendorData.state || "",
          country: vendorData.country || "India",
        });
        setApiError("");
      } catch (err) {
        setApiError(err.response?.data?.error || "Vendor not found");
      }
    };
    fetchVendor();
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!id) return;
    try {
      await dispatch(updateVendor({ id, ...data })).unwrap();
      navigate("/vendors");
    } catch (err) {
      console.error("Update vendor failed:", err);
    }
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Edit Vendor</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(reduxError || apiError) && (
            <Alert severity="error" onClose={() => {
              dispatch(clearError());
              setApiError("");
            }}>
              {reduxError || apiError}
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-700">
                Vendor Details
              </h2>
              <p className="text-sm text-gray-500">
                Update vendor details below.
              </p>
            </div>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("name")}
                  label="Name"
                  placeholder="Enter vendor name"
                  hasError={!!formErrors.name}
                  errorText={formErrors.name?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("phone")}
                  label="Phone"
                  placeholder="Enter phone number"
                  hasError={!!formErrors.phone}
                  errorText={formErrors.phone?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("email")}
                  label="Email"
                  type="email"
                  placeholder="Enter email (optional)"
                  hasError={!!formErrors.email}
                  errorText={formErrors.email?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("companyName")}
                  label="Company Name *"
                  placeholder="Enter company name"
                  hasError={!!formErrors.companyName}
                  errorText={formErrors.companyName?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("gstin")}
                  label="GSTIN"
                  placeholder="Enter GSTIN"
                  hasError={!!formErrors.gstin}
                  errorText={formErrors.gstin?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("city")}
                  label="City"
                  placeholder="Enter city"
                  hasError={!!formErrors.city}
                  errorText={formErrors.city?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("state")}
                  label="State"
                  placeholder="Enter state"
                  hasError={!!formErrors.state}
                  errorText={formErrors.state?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  {...register("country")}
                  label="Country"
                  placeholder="India"
                  hasError={!!formErrors.country}
                  errorText={formErrors.country?.message as string}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <CustomInput
                  {...register("address")}
                  label="Address"
                  placeholder="Enter full address"
                  multiline
                  rows={3}
                  hasError={!!formErrors.address}
                  errorText={formErrors.address?.message as string}
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
              {isSubmitting ? "Updating..." : "Update Vendor"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVendorPage;
