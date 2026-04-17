/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Grid } from "@mui/material";
import {
  updateBatch,
  fetchBatches,
  clearError,
} from "../../../slices/batchesSlice";
import { useBatches } from "../../../hooks/useBatches";
import CustomInput from "../../../components/CustomInput";
import CustomDatePicker from "../../../components/CustomDatePicker";
import CustomButton from "../../../components/CustomButton";
import type { UpdateBatchForm } from "../../../types/batch";
import type { AppDispatch } from "../../../store";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import CustomSelect from "../../../components/CustomSelect";

const UpdateBatchPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { batches, error } = useBatches();
  const batch = batches.find((b) => b.id === id);

  const [formData, setFormData] = useState<UpdateBatchForm>({
    status: "PENDING",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!batch) {
      dispatch(fetchBatches());
    } else {
      // Only editable fields for PENDING status
      setFormData({
        status: batch.status,
        sellingPrice: batch.sellingPrice,
        manufactureDate: batch.manufactureDate,
        expiryDate: batch.expiryDate,
      });
    }
  }, [batch, dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    // Basic validation
    if (batch?.status !== "PENDING") {
      newErrors.status = "Only PENDING batches can be edited";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateForm()) return;

    const submitData: UpdateBatchForm & { id: string } = {
      id,
      ...formData,
    };

    setIsSubmitting(true);
    try {
      await dispatch(updateBatch(submitData)).unwrap();
      navigate("/batches");
    } catch (err: any) {
      console.error("Update batch failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!batch) {
    return <div>Loading batch...</div>;
  }

  const statusColor =
    batch.status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : batch.status === "PENDING"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Update Batch</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto max-w-6xl">
        {error && (
          <Alert severity="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}
        {batch.status !== "PENDING" && (
          <Alert severity="warning">
            <span className={`font-semibold ${statusColor}`}>
              Status: {batch.status}
            </span>
            <br />
            Only PENDING batches can be edited. For ACTIVE batches use Stock
            Adjustment or Block option from list.
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Read-only Info */}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch No
              </label>
              <p className="font-semibold">{batch.batchNo}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <p>{batch.productName}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <CustomSelect
                value={formData.status || batch.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "PENDING" | "ACTIVE" | "BLOCKED",
                  })
                }
                options={[
                  { label: "Pending", value: "PENDING" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Blocked", value: "BLOCKED" },
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <p>{batch.quantity}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remaining
              </label>
              <p>{batch.remainingQuantity}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <p>₹{batch.purchasePrice.toLocaleString()}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Selling Price"
                type="number"
                placeholder="Enter selling price"
                value={formData.sellingPrice?.toString() || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellingPrice: parseFloat(e.target.value) || undefined,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomDatePicker
                label="Manufacture Date"
                value={
                  formData.manufactureDate
                    ? dayjs(formData.manufactureDate)
                    : null
                }
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    manufactureDate: val ? val.toISOString() : undefined,
                  })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomDatePicker
                label="Expiry Date"
                value={formData.expiryDate ? dayjs(formData.expiryDate) : null}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    expiryDate: val ? val.toISOString() : undefined,
                  })
                }
              />
            </Grid>
          </Grid>

          <div className="flex justify-end gap-4 pt-4">
            <CustomButton
              variant="outlined"
              onClick={() => navigate("/batches")}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Batch"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBatchPage;
