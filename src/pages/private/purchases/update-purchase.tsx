import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Grid } from "@mui/material";
import {
  updatePurchase,
  fetchPurchases,
  clearError,
} from "../../../slices/purchasesSlice";
import { usePurchases } from "../../../hooks/usePurchases";
import type { Purchase, UpdatePurchaseForm } from "../../../types/purchase";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import type { RootState, AppDispatch } from "../../../store";
import CustomSelect from "../../../components/CustomSelect";

const UpdatePurchasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = usePurchases();

  const purchase = useSelector((state: RootState) =>
    state.purchases.purchases.find((p) => p.id === id),
  ) as Purchase | undefined;

  const [formData, setFormData] = useState<Partial<UpdatePurchaseForm>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (!purchase) {
      dispatch(fetchPurchases());
    } else {
      setFormData({
        purchaseNo: purchase.purchaseNo,
        status: purchase.status,
        vendorName: purchase.vendorName,
        vendorPhone: purchase.vendorPhone,
        vendorGstin: purchase.vendorGstin,
        purchaseDate: new Date(purchase.purchaseDate)
          .toISOString()
          .split("T")[0],
      });
      setIsReadOnly(purchase.status === "COMPLETED");
    }
  }, [purchase, dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (isReadOnly) return true; // Skip validation for read-only

    if (!formData.purchaseNo?.trim()) {
      newErrors.purchaseNo = "Purchase No required";
      valid = false;
    }
    if (!formData.vendorName?.trim()) {
      newErrors.vendorName = "Vendor name required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateForm()) return;

    if (isReadOnly) {
      alert("Cannot update completed purchases");
      return;
    }

    const updateData: UpdatePurchaseForm & { id: string } = {
      id: id!,
      purchaseNo: formData.purchaseNo?.trim(),
      status: (formData.status || purchase.status!) as
        | "DRAFT"
        | "COMPLETED"
        | "CANCELLED",
      vendorName: formData.vendorName?.trim(),
      vendorPhone: formData.vendorPhone?.trim(),
      vendorGstin: formData.vendorGstin?.trim(),
      purchaseDate: formData.purchaseDate,
    };

    setIsSubmitting(true);
    try {
      await dispatch(updatePurchase(updateData)).unwrap();
      navigate("/purchases");
    } catch (err) {
      console.error("Update purchase failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!purchase && !loading) {
    return <div>Purchase not found</div>;
  }

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">
        {isReadOnly ? "View Purchase" : "Update Purchase"}
      </h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {isReadOnly && (
            <Alert severity="info">
              <strong>Read-only:</strong> Completed purchases cannot be edited.
            </Alert>
          )}

          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Purchase Details
            </h2>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Purchase No *"
                  placeholder="PURCHASE-001"
                  value={formData.purchaseNo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseNo: e.target.value })
                  }
                  disabled={isReadOnly}
                  hasError={!!errors.purchaseNo}
                  errorText={errors.purchaseNo}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Purchase Date"
                  type="date"
                  value={formData.purchaseDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomSelect
                  label="Status"
                  value={formData.status || purchase?.status || "DRAFT"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "DRAFT"
                        | "COMPLETED"
                        | "CANCELLED",
                    })
                  }
                  disabled={isReadOnly}
                  options={[
                    { label: "Draft", value: "DRAFT" },
                    { label: "Completed", value: "COMPLETED" },
                    { label: "Cancelled", value: "CANCELLED" },
                  ]}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor Name *"
                  placeholder="ABC Vendor"
                  value={formData.vendorName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendorName: e.target.value })
                  }
                  disabled={isReadOnly}
                  hasError={!!errors.vendorName}
                  errorText={errors.vendorName}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor Phone"
                  placeholder="9876543210"
                  value={formData.vendorPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendorPhone: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomInput
                  label="Vendor GSTIN"
                  placeholder="27ABCDE1234F1Z5"
                  value={formData.vendorGstin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vendorGstin: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </Grid>
            </Grid>
          </div>

          {/* Totals (Read-only) */}
          {purchase && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Sub Total:</span>
                  <div>₹{Number(purchase.subTotal).toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Discount:</span>
                  <div>₹{Number(purchase.discount).toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-500">Tax:</span>
                  <div>₹{Number(purchase.taxAmount).toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-semibold">
                    Total: ₹{Number(purchase.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <CustomButton
              variant="outlined"
              onClick={() => navigate("/purchases")}
              disabled={isSubmitting}
            >
              Back
            </CustomButton>
            {!isReadOnly && (
              <CustomButton
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Purchase"}
              </CustomButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePurchasePage;
