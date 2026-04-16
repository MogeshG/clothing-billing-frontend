import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slices/appSlice";
import customersSlice from "./slices/customersSlice";
import inventorySlice from "./slices/inventorySlice";
import productsSlice from "./slices/productsSlice";
import productCategoriesSlice from "./slices/productCategoriesSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    customers: customersSlice,
    inventory: inventorySlice,
    products: productsSlice,
    productCategories: productCategoriesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
