import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchStockMovements } from "../slices/stockMovementsSlice";

export const useStockMovements = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stockMovements, loading, error } = useSelector(
    (state: RootState) => state.stockMovements,
  );

  useEffect(() => {
    dispatch(fetchStockMovements());
  }, [dispatch]);

  return {
    stockMovements,
    loading,
    error,
    refetch: () => dispatch(fetchStockMovements()),
  };
};
