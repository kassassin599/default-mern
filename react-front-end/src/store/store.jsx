import { configureStore, isImmutableDefault } from "@reduxjs/toolkit";

import adminReducer from "./slices/adminSlice";
import counterReducer from "./slices/counterSlice";

export const store = configureStore({
  reducer: {
    adminAuth: adminReducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      isImmutableDefault: false,
    }),
});

const { dispatch } = store;

export { dispatch };
