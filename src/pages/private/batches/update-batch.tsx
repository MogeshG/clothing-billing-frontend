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
import Loader from "../../../components/CustomLoader";

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
      setFormData({
        status: batch.status,
        sellingPrice: batch.sellingPrice || batch.mrp || undefined,
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

    // We can add validation here if needed

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateForm()) return;

    // Send the payload in snake_case to match backend
    const isEpoch = (v?: string) =>
      !v || new Date(v).getFullYear() <= 1970;

    const submitData: any = {
      id,
      status: formData.status,
      selling_price: formData.sellingPrice,
      manufacture_date: isEpoch(formData.manufactureDate) ? null : formData.manufactureDate,
      expiry_date: isEpoch(formData.expiryDate) ? null : formData.expiryDate,
    };
    // Strip undefined fields (but keep explicit nulls for clearing dates)
    Object.keys(submitData).forEach(
      (k) => submitData[k] === undefined && delete submitData[k]
    );

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
    return <Loader />;
  }

  const totalGst = (Number(batch.cgstPercent) || 0) + (Number(batch.sgstPercent) || 0);

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Update Batch</h1>
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto max-w-6xl shadow-sm border border-gray-100">
        {error && (
          <Alert severity="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Batch No
              </label>
              <p className="font-semibold text-lg text-gray-800">{batch.batchNo}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Product
              </label>
              <p className="font-semibold text-gray-800">{batch.productName}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
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
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Barcode
              </label>
              <p className="font-semibold text-gray-800">{batch.barcode}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Quantity
              </label>
              <p className="font-semibold text-gray-800">{batch.quantity}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Remaining
              </label>
              <p className="font-semibold text-gray-800">{batch.remainingQuantity}</p>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                MRP
              </label>
              <p className="font-semibold text-gray-800">₹{batch.mrp}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Purchase Price
              </label>
              <p className="font-semibold text-gray-800">₹{batch.purchasePrice.toLocaleString()}</p>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Total GST
              </label>
              <p className="font-semibold text-gray-800">{totalGst}%</p>
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

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
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
