import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import customersSlice from "./slices/customersSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    customers: customersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
