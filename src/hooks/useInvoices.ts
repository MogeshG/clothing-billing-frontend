import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchInvoices,
  addInvoice,
  clearError,
  createDraftInvoice,
  finalizeInvoice,
  updateDraftInvoice,
  deleteInvoice
} from "../slices/invoicesSlice";

export const useInvoices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, drafts, loading, error } = useSelector(
    (state: RootState) => state.invoices,
  );

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return {
    invoices,
    drafts,
    loading,
    error,
    refetch: () => dispatch(fetchInvoices()),
    createDraftInvoice,
    addInvoice,
    clearError,
    finalizeInvoice,
    updateDraftInvoice,
    deleteInvoice
  };
};
