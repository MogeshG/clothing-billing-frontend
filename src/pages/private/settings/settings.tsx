import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { usePreferences } from "../../../hooks/usePreferences";
import CustomSelect from "../../../components/CustomSelect";
import CustomButton from "../../../components/CustomButton";
import { Save as SaveIcon } from "@mui/icons-material";
import CustomInput from "../../../components/CustomInput";
import { isValidGST, isValidPhone } from "../../../utils/validation";
import { SectionLoader } from "../../../components/CustomLoader";

const SettingsPage: React.FC = () => {
  const {
    preferences,
    loading: hookLoading,
    setMultiplePreferences,
    refetch,
  } = usePreferences();
  const [localPrefs, setLocalPrefs] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [gstError, setGstError] = useState(false);
  const [phone1Error, setPhone1Error] = useState(false);
  const [phone2Error, setPhone2Error] = useState(false);

  useEffect(() => {
    if (preferences && Object.keys(preferences).length > 0) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    // Validations
    if (localPrefs.companyGSTIN && !isValidGST(localPrefs.companyGSTIN)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid GSTIN number.",
        severity: "error",
      });
      setGstError(true);
      return;
    }
    if (localPrefs.companyMobile1 && !isValidPhone(localPrefs.companyMobile1)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid primary mobile number.",
        severity: "error",
      });
      setPhone1Error(true);
      return;
    }
    if (localPrefs.companyMobile2 && !isValidPhone(localPrefs.companyMobile2)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid secondary mobile number.",
        severity: "error",
      });
      setPhone2Error(true);
      return;
    }

    setIsSaving(true);
    try {
      await setMultiplePreferences(localPrefs);
      await refetch();
      setSnackbar({
        open: true,
        message: "Settings saved successfully!",
        severity: "success",
      });
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Failed to save settings.",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    if (key === "companyAddress" && value.length > 120) return;

    setLocalPrefs((prev) => ({ ...prev, [key]: value }));

    // Real-time validation
    if (key === "companyGSTIN") {
      setGstError(value ? !isValidGST(value) : false);
    }
    if (key === "companyMobile1") {
      setPhone1Error(value ? !isValidPhone(value) : false);
    }
    if (key === "companyMobile2") {
      setPhone2Error(value ? !isValidPhone(value) : false);
    }
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(localPrefs) !== JSON.stringify(preferences);
  }, [localPrefs, preferences]);

  if (hookLoading && Object.keys(localPrefs).length === 0) {
    return <SectionLoader label="Loading settings..." />;
  }

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <Box className="flex items-center justify-between mb-6">
        <Box className="flex items-center gap-3">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Settings
          </Typography>
        </Box>
        <CustomButton
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="shadow-md"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </CustomButton>
      </Box>

      <Box className="w-full space-y-6">
        <Grid container spacing={4}>
          {/* Business Info */}
          <Grid size={{ xs: 12 }}>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col gap-2">
                <Typography
                  variant="h6"
                  className="font-semibold text-blue-600"
                >
                  Business Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <CustomInput
                      label="Company Name"
                      value={localPrefs.companyName || ""}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                      placeholder="e.g. My Clothing Store"
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <CustomInput
                      label="Mobile Number 1"
                      value={localPrefs.companyMobile1 || ""}
                      onChange={(e) =>
                        handleChange("companyMobile1", e.target.value)
                      }
                      placeholder="Primary contact"
                      error={phone1Error}
                      errorText={phone1Error ? "Invalid mobile number" : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <CustomInput
                      label="Mobile Number 2"
                      value={localPrefs.companyMobile2 || ""}
                      onChange={(e) =>
                        handleChange("companyMobile2", e.target.value)
                      }
                      placeholder="Secondary contact"
                      error={phone2Error}
                      errorText={phone2Error ? "Invalid mobile number" : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <CustomInput
                      label="GSTIN"
                      value={localPrefs.companyGSTIN || ""}
                      onChange={(e) =>
                        handleChange("companyGSTIN", e.target.value)
                      }
                      placeholder="Goods and Services Tax Identification Number"
                      error={gstError}
                      errorText={gstError ? "Invalid GSTIN format" : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8, lg: 8 }}>
                    <CustomInput
                      label="Address"
                      value={localPrefs.companyAddress || ""}
                      onChange={(e) =>
                        handleChange("companyAddress", e.target.value)
                      }
                      placeholder="Full Business Address"
                      multiline
                      rows={2}
                      errorText={`${(localPrefs.companyAddress || "").length}/120 characters`}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* General Settings */}
          <Grid size={{ xs: 12 }}>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col gap-2">
                <Typography
                  variant="h6"
                  className="font-semibold text-blue-600"
                >
                  General Settings
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <CustomSelect
                      label="Default Invoice Type"
                      value={localPrefs.invoiceType || "a4"}
                      onChange={(e) =>
                        handleChange("invoiceType", e.target.value)
                      }
                      options={[
                        { value: "a4", label: "A4 Size" },
                        { value: "thermal", label: "Thermal (80mm)" },
                      ]}
                    />
                    <Typography variant="body2" className="mt-2 text-gray-500">
                      This setting controls the default print format for new
                      invoices in the POS.
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <CustomInput
                      label="Low stock threshold"
                      type="number"
                      value={localPrefs.lowStockLimit || 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        const num = Number(val);
                        if (num < 0) return;
                        handleChange("lowStockLimit", String(num));
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SettingsPage;
