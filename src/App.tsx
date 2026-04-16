import { useEffect, useState } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { setAuthLoading, setAuthenticated, logout } from "./slices/appSlice";
import { verifyToken, getToken } from "./utils/auth";
import "./App.css";
import { privateRoutes, publicRoutes } from "./routes/routes";

const AppContent = () => {
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector(
  // (state: RootState) => state.app.isAuthenticated,
  // );
  const authLoading = useSelector((state: RootState) => state.app.authLoading);
  const [initialCheck, setInitialCheck] = useState(false);

  const routes = privateRoutes; // Always private - JWT disabled

  // useEffect(() => {
  // const checkAuth = async () => {
  //   if (getToken()) {
  //     dispatch(setAuthLoading(true));
  //     const valid = await verifyToken();
  //     if (valid) {
  //       dispatch(setAuthenticated({ isAuthenticated: true, user: null }));
  //     } else {
  //       dispatch(logout());
  //     }
  //     dispatch(setAuthLoading(false));
  //   }
  //   setInitialCheck(true);
  // };
  // checkAuth();
  // }, [dispatch]);
  //
  useEffect(() => {
    setInitialCheck(true);
  }, []);

  return (
    <>
      {useRoutes(routes)}
      {/* Auth loading overlay disabled - JWT disabled
        {(!initialCheck || authLoading) && (
          ...
        )}
        */}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
