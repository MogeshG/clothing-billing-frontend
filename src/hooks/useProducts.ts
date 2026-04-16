import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchProducts,
  bulkCreateProducts,
  clearError,
} from "../slices/productsSlice";

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return {
    products,
    loading,
    error,
    refetch: () => dispatch(fetchProducts()),
    bulkCreateProducts,
    clearError,
  };
};
