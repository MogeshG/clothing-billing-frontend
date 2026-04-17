import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchPurchases } from "../slices/purchasesSlice";

export const usePurchases = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { purchases, loading, error } = useSelector(
    (state: RootState) => state.purchases,
  );

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  return {
    purchases,
    loading,
    error,
    refetch: () => dispatch(fetchPurchases()),
  };
};
