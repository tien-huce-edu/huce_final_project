"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

const initializeApp = async () => {
  await store.dispatch<any>(
    apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }),
  );

  await store.dispatch<any>(
    apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }),
  );
};

initializeApp();
