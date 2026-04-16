import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchCustomers } from "../slices/customersSlice";

export const useCustomers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, error, selectedCustomers } = useSelector(
    (state: RootState) => state.customers,
  );

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  return {
    customers,
    loading,
    error,
    selectedCustomers,
    refetch: () => dispatch(fetchCustomers()),
  };
};
