import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import customersReducer from "./slices/customersSlice";
import inventoryReducer from "./slices/inventorySlice";
import productCategoriesReducer from "./slices/productCategoriesSlice";
import productsReducer from "./slices/productsSlice";
import purchasesReducer from "./slices/purchasesSlice";
import vendorsReducer from "./slices/vendorsSlice";
import batchesReducer from "./slices/batchesSlice";
import stockMovementsReducer from "./slices/stockMovementsSlice";
import stockAdjustmentsReducer from "./slices/stockAdjustmentsSlice";
import invoicesReducer from "./slices/invoicesSlice";
import unitsReducer from "./slices/unitsSlice";
import preferencesReducer from "./slices/preferenceSlice";
import usersReducer from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    customers: customersReducer,
    inventory: inventoryReducer,
    productCategories: productCategoriesReducer,
    products: productsReducer,
    purchases: purchasesReducer,
    vendors: vendorsReducer,
    batches: batchesReducer,
    stockMovements: stockMovementsReducer,
    stockAdjustments: stockAdjustmentsReducer,
    invoices: invoicesReducer,
    units: unitsReducer,
    preferences: preferencesReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
