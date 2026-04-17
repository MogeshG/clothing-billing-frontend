import React, { useState, useEffect } from "react";
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
import { Alert } from "@mui/material";

interface FormData {
  productVariantId: string;
  productName: string;
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
    batchNo: "",
    type: "+",
    quantity: 1,
    reason: "",
    createdBy: "admin",
  });

  const [selectedBatch, setSelectedBatch] = useState<BatchForAdjustment | null>(
    null,
  );

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
        batchNo: batch.batchNo,
      }));
    } else {
      setSelectedBatch(null);
      setFormData((prev) => ({
        ...prev,
        productVariantId: "",
        productName: "",
        batchNo: "",
      }));
    }
  };

  const handleTypeChange = (value: string | number) => {
    setFormData((prev) => ({ ...prev, type: value as "+" | "-" }));
  };

  const handleReasonChange = (value: string | number) => {
    setFormData((prev) => ({ ...prev, reason: String(value) }));
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
      alert("Please select batch and valid quantity");
      return;
    }

    if (
      formData.type === "-" &&
      formData.quantity > selectedBatch.remainingQuantity
    ) {
      alert(
        `Cannot reduce more than remaining quantity: ${selectedBatch.remainingQuantity}`,
      );
      return;
    }

    if (selectedBatch.status === "EXPIRED") {
      if (!confirm("This batch is expired. Continue?")) return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await dispatch(createStockAdjustment(formData as any)).unwrap();
      navigate("/stock-adjustments");
    } catch (err) {
      console.error("Adjustment failed", err);
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
            data={stockAdjustments.batches}
            value={selectedBatch}
            getLabel={(batch) => `${batch.batchNo} - ${batch.productName}`}
            className="h-full flex-1"
            onSelect={handleBatchSelect}
            placeholder="Search batch..."
          />

          <CustomInput label="Product" value={formData.productName} disabled />

          <CustomInput label="Batch No" value={formData.batchNo} disabled />

          <CustomSelect
            label="Type"
            value={formData.type}
            onChange={handleTypeChange}
            options={[
              { value: "+", label: "Increase (+)" },
              { value: "-", label: "Decrease (-)" },
            ]}
            required
          />

          <CustomInput
            label="Quantity"
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
    </div>
  );
};

export default AdjustmentPage;
