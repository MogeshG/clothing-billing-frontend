import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchVendors } from "../slices/vendorsSlice";

export const useVendors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vendors, loading, error, selectedVendors } = useSelector(
    (state: RootState) => state.vendors,
  );

  const fetchWithParams = useCallback(
    (params: Parameters<typeof fetchVendors>[0] = {}) => {
      dispatch(fetchVendors(params));
    },
    [dispatch],
  );

  useEffect(() => {
    fetchWithParams();
  }, [fetchWithParams]);

  return {
    vendors,
    loading,
    error,
    selectedVendors,
    refetch: () => dispatch(fetchVendors()),
  };
};
