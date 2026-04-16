import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchInventory } from "../slices/inventorySlice";

export const useInventory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { inventory, loading, error } = useSelector(
    (state: RootState) => state.inventory,
  );

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  return {
    inventory,
    loading,
    error,
    refetch: () => dispatch(fetchInventory()),
  };
};
