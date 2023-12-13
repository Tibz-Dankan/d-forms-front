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

let url: string;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  url = "http://localhost:8000/api/v1";
} else {
  url = "production backend url";
}

export { url };
