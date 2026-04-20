import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchInvoices,
  addInvoice,
  clearError,
  createDraftInvoice,
  finalizeDraft,
} from "../slices/invoicesSlice";
// import type { AddInvoiceForm } from "../types/invoice"; // exposed via addInvoice

export const useInvoices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { invoices, loading, error } = useSelector(
    (state: RootState) => state.invoices,
  );

  const drafts = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "DRAFT")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [invoices],
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
    finalizeDraft,
    addInvoice,
    clearError,
  };
};
