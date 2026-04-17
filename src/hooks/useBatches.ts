import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchBatches, clearError } from "../slices/batchesSlice";

export const useBatches = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { batches, loading, error } = useSelector(
    (state: RootState) => state.batches,
  );

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  return {
    batches,
    loading,
    error,
    refetch: () => dispatch(fetchBatches()),
    clearError,
  };
};
