/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Grid, IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  updateBatch,
  fetchBatches,
  clearError,
  generateBatchNo,
  generateBarcode,
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingBatchNo, setGeneratingBatchNo] = useState(false);
  const [generatingBarcode, setGeneratingBarcode] = useState(false);

  useEffect(() => {
    if (!batch) {
      dispatch(fetchBatches());
    } else {
      setFormData({
        status: batch.status,
        sellingPrice: batch.sellingPrice || batch.mrp || undefined,
        manufactureDate: batch.manufactureDate,
        expiryDate: batch.expiryDate,
        batchNo: batch.batchNo,
        barcode: batch.barcode,
      });
    }
  }, [batch, dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-generate batchNo and barcode when status changes to ACTIVE and they are empty
  const handleStatusChange = useCallback(
    async (newStatus: "PENDING" | "ACTIVE" | "BLOCKED") => {
      setFormData((prev) => ({ ...prev, status: newStatus }));

      if (newStatus === "ACTIVE") {
        const updates: Partial<UpdateBatchForm> = { status: newStatus };

        if (!formData.batchNo) {
          setGeneratingBatchNo(true);
          try {
            const newBatchNo = await dispatch(generateBatchNo()).unwrap();
            updates.batchNo = newBatchNo;
          } catch {
            // silent fail
          } finally {
            setGeneratingBatchNo(false);
          }
        }

        if (!formData.barcode) {
          setGeneratingBarcode(true);
          try {
            const newBarcode = await dispatch(generateBarcode()).unwrap();
            updates.barcode = newBarcode;
          } catch {
            // silent fail
          } finally {
            setGeneratingBarcode(false);
          }
        }

        setFormData((prev) => ({ ...prev, ...updates }));
      }
    },
    [dispatch, formData.batchNo, formData.barcode],
  );

  const handleGenerateBatchNo = async () => {
    setGeneratingBatchNo(true);
    try {
      const newBatchNo = await dispatch(generateBatchNo()).unwrap();
      setFormData((prev) => ({ ...prev, batchNo: newBatchNo }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.batchNo;
        return next;
      });
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, batchNo: err || "Failed to generate" }));
    } finally {
      setGeneratingBatchNo(false);
    }
  };

  const handleGenerateBarcode = async () => {
    setGeneratingBarcode(true);
    try {
      const newBarcode = await dispatch(generateBarcode()).unwrap();
      setFormData((prev) => ({ ...prev, barcode: newBarcode }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.barcode;
        return next;
      });
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, barcode: err || "Failed to generate" }));
    } finally {
      setGeneratingBarcode(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.batchNo !== undefined && !formData.batchNo.trim()) {
      newErrors.batchNo = "Batch number is required";
    }
    if (formData.barcode !== undefined && !formData.barcode.trim()) {
      newErrors.barcode = "Barcode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !validateForm()) return;

    const isEpoch = (v?: string) => !v || new Date(v).getFullYear() <= 1970;

    const submitData: any = {
      id,
      status: formData.status,
      selling_price: formData.sellingPrice,
      manufacture_date: isEpoch(formData.manufactureDate)
        ? null
        : formData.manufactureDate,
      expiry_date: isEpoch(formData.expiryDate) ? null : formData.expiryDate,
    };

    // Only include batch_no and barcode if they were changed from original
    if (formData.batchNo !== undefined && formData.batchNo !== batch?.batchNo) {
      submitData.batch_no = formData.batchNo;
    }
    if (formData.barcode !== undefined && formData.barcode !== batch?.barcode) {
      submitData.barcode = formData.barcode;
    }

    // Strip undefined fields
    Object.keys(submitData).forEach(
      (k) => submitData[k] === undefined && delete submitData[k],
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

  const totalGst =
    (Number(batch.cgstPercent) || 0) + (Number(batch.sgstPercent) || 0);

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
              <CustomInput
                label="Batch No"
                value={formData.batchNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, batchNo: e.target.value })
                }
                placeholder="Enter or generate batch no"
                endIcon={
                  <Tooltip title="Auto-generate unique batch no">
                    <IconButton
                      size="small"
                      onClick={handleGenerateBatchNo}
                      disabled={generatingBatchNo || batch.isActivated}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                hasError={!!errors.batchNo}
                errorText={errors.batchNo}
                fixedErrorSpace
                disabled={batch.isActivated}
              />
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
                  handleStatusChange(
                    e.target.value as "PENDING" | "ACTIVE" | "BLOCKED",
                  )
                }
                options={[
                  { label: "Pending", value: "PENDING" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Blocked", value: "BLOCKED" },
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInput
                label="Barcode"
                value={formData.barcode || ""}
                onChange={(e) =>
                  setFormData({ ...formData, barcode: e.target.value })
                }
                placeholder="Enter or generate barcode"
                endIcon={
                  <Tooltip title="Auto-generate unique barcode">
                    <IconButton
                      size="small"
                      onClick={handleGenerateBarcode}
                      disabled={generatingBarcode || batch.isActivated}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                hasError={!!errors.barcode}
                errorText={errors.barcode}
                fixedErrorSpace
                disabled={batch.isActivated}
              />
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
              <p className="font-semibold text-gray-800">
                {batch.remainingQuantity}
              </p>
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
              <p className="font-semibold text-gray-800">
                ₹{batch.purchasePrice.toLocaleString()}
              </p>
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
