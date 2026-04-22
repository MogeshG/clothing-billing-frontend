import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "../store";
import { fetchUnits } from "../slices/unitsSlice";

export const useUnits = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { units, loading, error } = useSelector(
    (state: RootState) => state.units,
  );

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  return {
    units,
    loading,
    error,
    refetch: () => dispatch(fetchUnits()),
  };
};
