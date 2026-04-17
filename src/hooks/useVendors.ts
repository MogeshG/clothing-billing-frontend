import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchVendors } from "../slices/vendorsSlice";

export const useVendors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vendors, loading, error, selectedVendors } = useSelector(
    (state: RootState) => state.vendors,
  );

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  return {
    vendors,
    loading,
    error,
    selectedVendors,
    refetch: () => dispatch(fetchVendors()),
  };
};
