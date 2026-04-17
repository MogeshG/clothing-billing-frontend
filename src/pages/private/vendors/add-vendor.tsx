import { useEffect, useState } from "react";
// Phone validation placeholder - implement isValidPhone if needed
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Grid } from "@mui/material";
import { addVendor, clearError } from "../../../slices/vendorsSlice";
import { useVendors } from "../../../hooks/useVendors";
import type { AddVendorForm } from "../../../types/vendor";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import type { AppDispatch } from "../../../store";
import { isValidEmail } from "../../../utils/validation";

const AddVendorPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useVendors();
  const [formData, setFormData] = useState<Partial<AddVendorForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear redux error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
      valid = false;
    }
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Invalid email";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: AddVendorForm = {
      name: formData.name!.trim(),
      phone: formData.phone!.trim(),
      email: formData.email?.trim() || undefined,
      address: formData.address?.trim() || undefined,
      gstin: formData.gstin?.trim() || undefined,
      company_name: formData.company_name?.trim() || undefined,
      city: formData.city?.trim() || undefined,
      state: formData.state?.trim() || undefined,
      country: formData.country || "India",
    };

    setIsSubmitting(true);
    try {
      await dispatch(addVendor(submitData)).unwrap();
      navigate("/vendors");
    } catch (err) {
      console.error("Add vendor failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof AddVendorForm, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Add New Vendor</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  label="Name"
                  placeholder="Enter vendor name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  hasError={!!errors.name}
                  errorText={errors.name}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="Phone"
                  placeholder="Enter phone number"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  hasError={!!errors.phone}
                  errorText={errors.phone}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="Email"
                  type="email"
                  placeholder="Enter email (optional)"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  hasError={!!errors.email}
                  errorText={errors.email}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="Company Name"
                  placeholder="Enter company name"
                  value={formData.company_name || ""}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="GSTIN"
                  placeholder="Enter GSTIN"
                  value={formData.gstin || ""}
                  onChange={(e) => handleChange("gstin", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="City"
                  placeholder="Enter city"
                  value={formData.city || ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="State"
                  placeholder="Enter state"
                  value={formData.state || ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <CustomInput
                  label="Country"
                  placeholder="India"
                  value={formData.country || "India"}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  label="Address"
                  placeholder="Enter full address"
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
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
              variant="contained"
              onClick={handleSubmit}
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
