import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchInvoices,
  addInvoice,
  clearError,
  clearBillHtml,
  createDraftInvoice,
  finalizeInvoice,
  updateDraftInvoice,
  deleteInvoice,
  generateBill,
} from "../slices/invoicesSlice";

export const useInvoices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, drafts, loading, billHtml, error } = useSelector(
    (state: RootState) => state.invoices,
  );

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return {
    invoices,
    drafts,
    loading,
    billHtml,
    error,
    refetch: () => dispatch(fetchInvoices()),
    addInvoice,
    createDraftInvoice,
    finalizeInvoice,
    updateDraftInvoice,
    deleteInvoice,
    generateBill,
    clearError,
    clearBillHtml,
  };
};
