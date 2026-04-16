import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import { setAuthLoading, setAuthenticated, logout } from "../slices/appSlice";
import { verifyToken } from "../utils/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, authLoading, user } = useSelector(
    (state: RootState) => state.app,
  );

  // useEffect(() => {
  // const checkAuth = async () => {
  //   dispatch(setAuthLoading(true));
  //   const valid = await verifyToken();
  //   if (valid) {
  //     // Fetch user info if needed
  //     dispatch(setAuthenticated({ isAuthenticated: true, user: null }));
  //   } else {
  //     dispatch(logout());
  //   }
  //   dispatch(setAuthLoading(false));
  // };
  // checkAuth();
  // }, [dispatch]); // JWT auth disabled

  return { isAuthenticated, authLoading, user };
};
