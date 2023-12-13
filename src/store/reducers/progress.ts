import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TProgress } from "../../types/progress";

const initialState: TProgress = {
  currentMaxPage: 1,
};

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    updateProgress(state, action: PayloadAction<TProgress>) {
      state.currentMaxPage = action.payload.currentMaxPage;
    },
    clearProgress(state) {
      state.currentMaxPage = 1;
    },
  },
});
