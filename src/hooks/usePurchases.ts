import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import type { AddPurchaseForm } from "../types/purchase";
import {
  fetchPurchases,
  fetchPurchaseById,
  addPurchase,
  updatePurchase,
  removePurchase,
} from "../slices/purchasesSlice";

export const usePurchases = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { purchases, loading, error } = useSelector(
    (state: RootState) => state.purchases,
  );

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  const createPurchase = useCallback(
    async (purchaseData: AddPurchaseForm) => {
      return await dispatch(addPurchase(purchaseData)).unwrap();
    },
    [dispatch],
  );

  const updatePurchase = useCallback(
    async (id: string, purchaseData) => {
      return await dispatch(updatePurchase({ id, ...purchaseData })).unwrap();
    },
    [dispatch],
  );

  const deletePurchase = useCallback(
    async (id: string) => {
      return await dispatch(removePurchase(id)).unwrap();
    },
    [dispatch],
  );

  return {
    purchases,
    loading,
    error,
    refetch: () => dispatch(fetchPurchases()),
    createPurchase,
    updatePurchase,
    deletePurchase,
  };
};

export const usePurchaseDetail = (id?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPurchase, loading, error } = useSelector(
    (state: RootState) => state.purchases,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPurchaseById(id));
    }
  }, [id, dispatch]);

  return {
    purchase: selectedPurchase,
    loading,
    error,
    refetch: () => id && dispatch(fetchPurchaseById(id)),
  };
};
