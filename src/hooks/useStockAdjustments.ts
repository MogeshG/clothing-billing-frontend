import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchStockAdjustments,
  fetchBatchesForAdjustment,
} from "../slices/stockAdjustmentsSlice";

export const useStockAdjustments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adjustments, batches, loading, error } = useSelector(
    (state: RootState) => state.stockAdjustments,
  );

  useEffect(() => {
    dispatch(fetchStockAdjustments());
  }, [dispatch]);

  const loadBatches = () => dispatch(fetchBatchesForAdjustment());

  return {
    adjustments,
    batches,
    loading,
    error,
    loadBatches,
    refetchAdjustments: () => dispatch(fetchStockAdjustments()),
  };
};
