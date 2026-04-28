import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchProducts,
  clearError,
  setSelectedProducts,
  bulkCreateProducts,
} from "../slices/productsSlice";
import type { AddProductForm } from "../types/product";

export const useProducts = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, pagination, selectedProducts } =
    useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  return {
    products,
    loading,
    error,
    pagination,
    selectedProducts,
    refetch: () => dispatch(fetchProducts({ page, limit, search })),
    clearError: () => dispatch(clearError()),
    setSelectedProducts: (ids: string[]) => dispatch(setSelectedProducts(ids)),
    bulkCreateProducts: (products: AddProductForm[]) =>
      dispatch(bulkCreateProducts(products)),
  };
};
