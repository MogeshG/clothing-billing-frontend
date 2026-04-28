import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  permissions: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
}    

interface AppState {
  companyName: string;
  sideBarCollapsed: boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  user: User | null;
  openMenus: string[];
}

const initialState: AppState = {
  companyName: "Billing",
  sideBarCollapsed: false,
  isAuthenticated: false,
  authLoading: false,
  user: null,
  openMenus: [],
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
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    toggleOpenMenu: (state, action) => {
      const href = action.payload;
      const index = state.openMenus.indexOf(href);
      if (index >= 0) {
        state.openMenus.splice(index, 1);
      } else {
        state.openMenus.push(href);
      }
    },
    setOpenMenus: (state, action) => {
      state.openMenus = action.payload;
    },
  },
});

export const {
  setSideBarCollapsed,
  setAuthLoading,
  setAuthenticated,
  setUser,
  logout,
  toggleOpenMenu,
  setOpenMenus,
} = appSlice.actions;

export default appSlice.reducer;
