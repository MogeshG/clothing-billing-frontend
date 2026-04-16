import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchProductCategories,
  bulkCreateProductCategories,
} from "../slices/productCategoriesSlice";

export const useProductCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productCategories, loading, error, selectedProductCategories } =
    useSelector((state: RootState) => state.productCategories);

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, [dispatch]);

  return {
    productCategories,
    loading,
    error,
    selectedProductCategories,
    refetch: () => dispatch(fetchProductCategories()),
    bulkCreateProductCategories,
  };
};
