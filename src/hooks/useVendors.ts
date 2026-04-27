import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchVendors, fetchVendorById } from "../slices/vendorsSlice";

export const useVendors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vendors, loading, error, selectedVendors, currentVendor } =
    useSelector((state: RootState) => state.vendors);

  const fetchWithParams = useCallback(
    (params?: { search?: string; page?: number; limit?: number }) => {
      dispatch(fetchVendors(params || {}));
    },
    [dispatch],
  );

  const getVendorById = useCallback(
    (id: string) => {
      dispatch(fetchVendorById(id));
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
    currentVendor,
    refetch: () => dispatch(fetchVendors({})),
    getVendorById,
  };
};
