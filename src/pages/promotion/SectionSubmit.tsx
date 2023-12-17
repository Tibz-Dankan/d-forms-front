import React, { Fragment } from "react";
import { FormLayout } from "../../layout/FormLayout";
import { useDispatch } from "react-redux";
import { IconContext } from "react-icons";
import { useMutation } from "@tanstack/react-query";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { useProgress } from "../../hooks/useProgress";
import {
  showCardNotification,
  hideCardNotification,
} from "../../store/actions/notification";
import { Loader } from "../../UI/shared/Loader";
import { submitPromotionApplication } from "../../API/promotion";

/**
 * SectionSubmit make an api call to save applicants data in the db
 */
export const SectionSubmit: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 8,
    section: "submit",
    nextPageURL: "/promotion/section-submit",
    prevPageURL: "/promotion/section9",
  });

  const page = searchParams.get("page");

  const { isLoading, mutate } = useMutation({
    mutationFn: submitPromotionApplication,
    onSuccess: (response) => {
      console.log("response", response);
      dispatch(
        showCardNotification({
          type: "success",
          message: "Application successfully submitted!",
        })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 7000);
    },
    onError: (error: any) => {
      dispatch(showCardNotification({ type: "error", message: error.message }));
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    },
  });

  const applicationSubmitHandler = () => {
    const stringifiedData = localStorage.getItem("promotion");
    if (!stringifiedData) {
      dispatch(
        showCardNotification({
          type: "error",
          message: "Can not submit empty values",
        })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    }

    mutate({
      data: stringifiedData,
    });
  };

  return (
    <Fragment>
      <div className="relative full grid place-items-center h-auto">
        <FormLayout
          totalNumPages={7}
          headerTitleClassName="bg-primaryDark"
          headerTitle={
            <div className="w-full">
              <h1 className="flex flex-col items-center justify-center">
                <span className="text-base">APPLICATION FOR PROMOTION</span>
                <span className="text-base font-normal">
                  (This application will be governed by Statute 2007 of the
                  Promotion of Academic Staff)
                </span>
              </h1>
            </div>
          }
          section="Submit Data"
          footer="Employment footer"
        >
          <div className="w-full">
            {/* ----- submit start ---- */}
            <div
              className="bg-green-500s flex flex-col gap-8 items-center 
              justify-center min-h-[50vh] mb-16"
            >
              <p className="text-gray-800 bg-gray-400 text-center p-4 rounded">
                To complete the registration process submit your data
              </p>
              {!isLoading && (
                <button
                  disabled={isLoading}
                  className="bg-primaryDark text-gray-50 p-3 w-48 py-1s rounded-md"
                  onClick={() => applicationSubmitHandler()}
                >
                  <span className="uppercase font-semibold">Submit</span>
                </button>
              )}
              {isLoading && (
                <div
                  className="bg-primaryDark text-gray-50 px-3 py-1 w-48 rounded-md
                  flex justify-start items-center"
                >
                  <Loader className="left-0" label="submitting" />
                </div>
              )}
            </div>
            {/* ----- submit end ---- */}

            {/*----- Page Navigate buttons Start -----*/}
            <div className="mt-16 flex items-center justify-between">
              <button
                className="flex items-center justify-center bg-primary
                  rounded-md gap-2 px-4 py-2 text-gray-50"
                onClick={() => prevPageHandler()}
                disabled={page === "1"}
              >
                <span>
                  <IconContext.Provider
                    value={{
                      size: "1.8rem",
                      color: "#fff",
                    }}
                  >
                    <IoIosArrowRoundBack />
                  </IconContext.Provider>
                </span>
                <span>Prev</span>
              </button>
              <p
                className="w-10 h-10 rounded-[50%] bg-primary grid
                 place-items-center text-gray-50"
              >
                <span>{page}</span>
              </p>
              <button
                className="flex items-center justify-center bg-primary
                  rounded-md gap-2 px-4 py-2 text-gray-50 disabled:opacity-60
                  disabled:cursor-not-allowed"
                onClick={() => nextPageHandler()}
                disabled={true}
              >
                <span>Next</span>
                <span>
                  <IconContext.Provider
                    value={{
                      size: "1.8rem",
                      color: "#fff",
                    }}
                  >
                    <IoIosArrowRoundForward />
                  </IconContext.Provider>
                </span>
              </button>
            </div>
            {/*----- Page Navigate buttons End -----*/}
          </div>
        </FormLayout>
      </div>
    </Fragment>
  );
};
