import { configureStore } from "@reduxjs/toolkit";
import { notificationSlice } from "./reducers/notification";

export const store = configureStore({
  reducer: {
    notification: notificationSlice.reducer,
  },
});

export const notificationActions = notificationSlice.actions;
