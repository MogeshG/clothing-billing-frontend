import { useCallback } from "react";
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

  const loadBatches = useCallback(
    () => dispatch(fetchBatchesForAdjustment()),
    [dispatch],
  );

  const refetchAdjustments = useCallback(
    () => dispatch(fetchStockAdjustments()),
    [dispatch],
  );

  return {
    adjustments,
    batches,
    loading,
    error,
    loadBatches,
    refetchAdjustments,
  };
};
