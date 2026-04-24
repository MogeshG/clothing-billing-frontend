import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchPreferences, updatePreferences } from "../slices/preferenceSlice";

export const usePreferences = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { preferences, loading, error } = useSelector(
    (state: RootState) => state.preferences
  );

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  const setPreference = (key: string, value: string) => {
    dispatch(updatePreferences({ ...preferences, [key]: value }));
  };

  const setMultiplePreferences = (prefs: Record<string, string>) => {
    dispatch(updatePreferences({ ...preferences, ...prefs }));
  };

  return {
    preferences,
    loading,
    error,
    setPreference,
    setMultiplePreferences,
    refetch: () => dispatch(fetchPreferences()),
  };
};
