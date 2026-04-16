import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companyName: "Billing",
  sideBarCollapsed: false,
  isAuthenticated: false,
  authLoading: false,
  user: null,
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setSideBarCollapsed: (state, action) => {
      state.sideBarCollapsed = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setSideBarCollapsed, setAuthLoading, setAuthenticated, logout } =
  appSlice.actions;

export default appSlice.reducer;
