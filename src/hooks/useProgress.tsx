import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TProgressState } from "../types/progress";
import { updateProgress } from "../store/actions/progress";

interface UseProgressProps {
  page: number;
  section: string;
  nextPageURL: string;
  prevPageURL: string;
}

export const useProgress = (props: UseProgressProps) => {
  const [_, setSearchParams] = useSearchParams({
    page: "",
    section: "",
    currMaxPage: "",
  });
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const progress = useSelector((state: TProgressState) => state.progress);
  console.log("progress", progress);
  const currentMaxPage = progress.currentMaxPage;

  useEffect(() => {
    const setDefaultSearchParams = () => {
      setSearchParams(
        (prev) => {
          prev.set("page", `${props.page}`);
          prev.set("section", `${props.section}`);
          prev.set("currMaxPage", `${currentMaxPage}`);
          return prev;
        },
        { replace: false }
      );
    };
    setDefaultSearchParams();
  }, []);

  const currentMaxPageHandler = () => {
    const currPage = props.page;
    const currMaxPage = progress.currentMaxPage;
    if (currPage < currMaxPage) return;

    const nextMaxPage = props.page + 1;

    dispatch(updateProgress({ currentMaxPage: nextMaxPage }));
  };

  const nextPageHandler = () => {
    currentMaxPageHandler();
    navigate(props.nextPageURL, { replace: false });
  };

  const prevPageHandler = () => {
    navigate(props.prevPageURL, { replace: false });
  };
  return { nextPageHandler, prevPageHandler };
};
