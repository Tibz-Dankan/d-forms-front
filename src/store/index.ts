import { configureStore } from "@reduxjs/toolkit";
import { notificationSlice } from "./reducers/notification";
import { progressSlice } from "./reducers/progress";

export const store = configureStore({
  reducer: {
    notification: notificationSlice.reducer,
    progress: progressSlice.reducer,
  },
});

export const notificationActions = notificationSlice.actions;
export const progressActions = progressSlice.actions;
