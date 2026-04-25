import { useEffect, useState } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { setAuthLoading, setAuthenticated, logout } from "./slices/appSlice";
import { verifyToken, getToken } from "./utils/auth";
import "./App.css";
import { privateRoutes, publicRoutes } from "./routes/routes";
import Loader from "./components/CustomLoader";

const AppContent = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.app.isAuthenticated,
  );
  const authLoading = useSelector((state: RootState) => state.app.authLoading);
  const [initialCheck, setInitialCheck] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (getToken()) {
        dispatch(setAuthLoading(true));
        const result = await verifyToken();
        if (result.valid) {
          dispatch(
            setAuthenticated({ isAuthenticated: true, user: result.user }),
          );
        } else {
          dispatch(logout());
        }
        dispatch(setAuthLoading(false));
      }
      setInitialCheck(true);
    };
    checkAuth();
  }, [dispatch]);

  const allRoutes = isAuthenticated ? privateRoutes : publicRoutes;
  const routeElement = useRoutes(allRoutes);

  if (!initialCheck || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{routeElement}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
