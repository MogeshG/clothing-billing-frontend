import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useStockAdjustments } from "../../../hooks/useStockAdjustments";
import { createStockAdjustment } from "../../../slices/stockAdjustmentsSlice";
import { clearError } from "../../../slices/stockAdjustmentsSlice";
import CustomButton from "../../../components/CustomButton";
import CustomSearch from "../../../components/CustomSearch";
import CustomSelect from "../../../components/CustomSelect";
import CustomInput from "../../../components/CustomInput";
import type { RootState, AppDispatch } from "../../../store";
import type { BatchForAdjustment } from "../../../types/stockAdjustment";
import { Alert, Snackbar } from "@mui/material";

interface FormData {
  productVariantId: string;
  productName: string;
  variantSku: string;
  batchNo: string;
  type: "+" | "-";
  quantity: number;
  reason: string;
  createdBy: string;
}

const AdjustmentPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const stockAdjustments = useSelector(
    (state: RootState) => state.stockAdjustments,
  );
  const { loadBatches } = useStockAdjustments();

  const [formData, setFormData] = useState<FormData>({
    productVariantId: "",
    productName: "",
    variantSku: "",
    batchNo: "",
    type: "+",
    quantity: 1,
    reason: "",
    createdBy: "admin",
  });

  const [selectedBatch, setSelectedBatch] = useState<BatchForAdjustment | null>(
    null,
  );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = useCallback((
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const handleBatchSelect = (batch: BatchForAdjustment | null) => {
    if (batch) {
      setSelectedBatch(batch);
      setFormData((prev) => ({
        ...prev,
        productVariantId: batch.id,
        productName: batch.productName,
        variantSku: batch.variantSku,
        batchNo: batch.batchNo,
      }));
    } else {
      setSelectedBatch(null);
      setFormData((prev) => ({
        ...prev,
        productVariantId: "",
        productName: "",
        variantSku: "",
        batchNo: "",
      }));
    }
  };

  const handleTypeChange = (e: any) => {
    setFormData((prev) => ({ ...prev, type: e.target.value as "+" | "-" }));
  };

  const handleReasonChange = (e: any) => {
    setFormData((prev) => ({ ...prev, reason: String(e.target.value) }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      quantity: isNaN(num) ? 1 : Math.max(1, num),
    }));
  };

  const handleSubmit = async () => {
    if (!selectedBatch || formData.quantity <= 0) {
      showMessage("Please select batch and valid quantity", "error");
      return;
    }

    if (
      formData.type === "-" &&
      formData.quantity > selectedBatch.remainingQuantity
    ) {
      showMessage(
        `Cannot reduce more than remaining quantity: ${selectedBatch.remainingQuantity}`,
        "error",
      );
      return;
    }

    if (selectedBatch.status === "EXPIRED") {
      if (!window.confirm("This batch is expired. Continue?")) return;
    }

    try {
      await dispatch(createStockAdjustment(formData as any)).unwrap();
      showMessage("Adjustment created successfully!");
      setTimeout(() => navigate("/stock-adjustments"), 1500);
    } catch (err: any) {
      console.error("Adjustment failed", err);
      showMessage(err.message || "Adjustment failed", "error");
    }
  };

  return (
    <div className="flex flex-col m-2 w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">New Stock Adjustment</h1>

      {stockAdjustments.error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {stockAdjustments.error}
        </Alert>
      )}
      <div className="flex flex-col w-full bg-white space-y-6 p-6 rounded-md mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          <CustomSearch
            label=""
            data={stockAdjustments.batches}
            value={selectedBatch}
            getLabel={(batch) =>
              `${batch.batchNo} ${batch.variantSku ? `(${batch.variantSku})` : ""} - ${batch.productName}`
            }
            className="h-full flex-1"
            onSelect={handleBatchSelect}
            placeholder="Search batch by no, sku or name..."
          />

          <CustomInput label="Product" value={formData.productName} disabled />

          <CustomInput label="SKU" value={selectedBatch?.variantSku || ""} disabled />

          <CustomInput label="Batch No" value={formData.batchNo} disabled />

          <CustomInput
            label="Current Quantity"
            value={selectedBatch?.remainingQuantity ?? ""}
            disabled
          />

          <CustomInput label="Batch Status" value={selectedBatch?.status || ""} disabled />

          <CustomSelect
            label="Adjustment Type"
            value={formData.type}
            onChange={handleTypeChange}
            options={[
              { value: "+", label: "Increase (+)" },
              { value: "-", label: "Decrease (-)" },
            ]}
            required
          />

          <CustomInput
            label="Adjustment Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleQuantityChange}
            required
          />

          <CustomSelect
            label="Reason"
            value={formData.reason}
            onChange={handleReasonChange}
            options={[
              { value: "Damaged", label: "Damaged" },
              { value: "Expired", label: "Expired" },
              { value: "Lost", label: "Lost" },
              { value: "Manual correction", label: "Manual correction" },
              { value: "Stock count mismatch", label: "Stock count mismatch" },
              { value: "Other", label: "Other" },
            ]}
            required
          />

          <CustomInput
            label="Updated Stock quantity"
            value={
              selectedBatch
                ? `${selectedBatch.remainingQuantity} ➜ ${formData.type === "+"
                  ? selectedBatch.remainingQuantity + formData.quantity
                  : selectedBatch.remainingQuantity - formData.quantity
                }`
                : "N/A"
            }
            disabled
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <CustomButton
            variant="outlined"
            onClick={() => navigate("/stock-adjustments")}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="contained"
            disabled={
              stockAdjustments.creating ||
              !selectedBatch ||
              formData.quantity <= 0
            }
            onClick={handleSubmit}
          >
            {stockAdjustments.creating ? "Creating..." : "Create Adjustment"}
          </CustomButton>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdjustmentPage;
