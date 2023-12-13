import { progressActions } from "../index";
import { TProgress } from "../../types/progress";

export const updateProgress = ({ currentMaxPage }: TProgress) => {
  localStorage.setItem(
    "progress",
    JSON.stringify({ currentMaxPage: currentMaxPage })
  );
  return (dispatch: any) => {
    dispatch(
      progressActions.updateProgress({ currentMaxPage: currentMaxPage })
    );
  };
};

export const clearProgress = () => {
  localStorage.removeItem("progress");
  return (dispatch: any) => {
    dispatch(progressActions.clearProgress());
  };
};
