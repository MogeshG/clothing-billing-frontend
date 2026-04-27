import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setSideBarCollapsed, logout } from "../slices/appSlice";
import { removeToken } from "../utils/auth";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import type { RootState } from "../store";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const { companyName, sideBarCollapsed, user } = useSelector(
    (state: RootState) => state.app,
  );

  const toggleSidebar = () => {
    dispatch(setSideBarCollapsed(!sideBarCollapsed));
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    removeToken();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="h-[10vh] bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          {sideBarCollapsed ? <MenuOpenIcon /> : <MenuIcon />}
        </button>

        {/* App Title */}
        <h1 className="text-lg font-semibold text-gray-800">{companyName}</h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="text-right leading-tight hidden sm:block">
          <p className="text-sm text-gray-500">Welcome</p>
          <p className="text-sm font-semibold text-gray-800">
            {user?.name || "User"}
          </p>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
          {user?.name?.charAt(0) || "U"}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogoutClick}
          className="p-2 rounded-md hover:bg-red-50 text-red-500 transition"
        >
          <LogoutIcon />
        </button>
      </div>

      {/* Logout Confirm Dialog */}
      <Dialog open={openLogoutDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LogoutOutlined color="error" />
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to log out?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            color="error"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Header;
