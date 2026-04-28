import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import type { AddSalesReturnForm } from "../types/salesReturn";
import {
  fetchSalesReturns,
  fetchSalesReturnById,
  addSalesReturn,
  updateSalesReturn,
  approveSalesReturn,
  deleteSalesReturn,
  generateSalesReturnBill,
  clearError,
  clearSelectedSalesReturn,
  clearBillHtml,
} from "../slices/salesReturnSlice";

export const useSalesReturn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { salesReturns, loading, billHtml, error } = useSelector(
    (state: RootState) => state.salesReturn,
  );

  useEffect(() => {
    dispatch(fetchSalesReturns());
  }, [dispatch]);

  return {
    salesReturns,
    loading,
    billHtml,
    error,
    refetch: () => dispatch(fetchSalesReturns()),
    clearError: () => dispatch(clearError()),
    clearBillHtml: () => dispatch(clearBillHtml()),
  };
};

export const useSalesReturnDetail = (id?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSalesReturn, loading, error } = useSelector(
    (state: RootState) => state.salesReturn,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSalesReturnById(id));
    }
  }, [id, dispatch]);

  return {
    salesReturn: selectedSalesReturn,
    loading,
    error,
    refetch: () => id && dispatch(fetchSalesReturnById(id)),
    clearSelected: () => dispatch(clearSelectedSalesReturn()),
  };
};

export const useSalesReturnActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const createSalesReturn = useCallback(
    async (data: AddSalesReturnForm) => {
      return await dispatch(addSalesReturn(data)).unwrap();
    },
    [dispatch],
  );

  const editSalesReturn = useCallback(
    async (id: string, data: Partial<AddSalesReturnForm>) => {
      return await dispatch(updateSalesReturn({ id, data })).unwrap();
    },
    [dispatch],
  );

  const approve = useCallback(
    async (id: string) => {
      return await dispatch(approveSalesReturn(id)).unwrap();
    },
    [dispatch],
  );

  const remove = useCallback(
    async (id: string) => {
      return await dispatch(deleteSalesReturn(id)).unwrap();
    },
    [dispatch],
  );

  const generateBill = useCallback(
    async (id: string) => {
      return await dispatch(generateSalesReturnBill({ id })).unwrap();
    },
    [dispatch],
  );

  return { createSalesReturn, editSalesReturn, approve, remove, generateBill };
};
