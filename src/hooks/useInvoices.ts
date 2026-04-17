import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchInvoices, addInvoice, clearError } from "../slices/invoicesSlice";
// import type { AddInvoiceForm } from "../types/invoice"; // exposed via addInvoice

export const useInvoices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, loading, error } = useSelector(
    (state: RootState) => state.invoices,
  );

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return {
    invoices,
    loading,
    error,
    refetch: () => dispatch(fetchInvoices()),
    addInvoice,
    clearError,
  };
};
