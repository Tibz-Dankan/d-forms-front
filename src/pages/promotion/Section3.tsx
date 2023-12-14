import React, { Fragment } from "react";
import { FormLayout } from "../../layout/FormLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  showCardNotification,
  hideCardNotification,
} from "../../store/actions/notification";
import { useDispatch } from "react-redux";
import { IconContext } from "react-icons";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { transformToArrayOfObjects } from "../../utils/transformToArrayOfObject";
import {
  saveFormDataToStorage,
  getDataFromStorage,
} from "../../utils/saveFormDataToStorage";
import { useProgress } from "../../hooks/useProgress";

type TInitialValues = {
  statementOfFaithAndUnderstandingChristian: string;
};

export const Section3: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 3,
    section: "3",
    nextPageURL: "/promotion/section4",
    prevPageURL: "/promotion/section2",
  });

  const initialValues: TInitialValues = {
    statementOfFaithAndUnderstandingChristian: "",
  };

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "faithAndUnderstandingChristianity",
    }) as TInitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      campus: Yup.string().max(1000).required("Campus name is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // Save Personal Information
        saveFormDataToStorage({
          applicationForm: "promotion",
          category: "faithAndUnderstandingChristianity",
          data: values,
          updateAt: new Date().toISOString(),
        });
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
        dispatch(showCardNotification({ type: "error", message: err.message }));
        setTimeout(() => {
          dispatch(hideCardNotification());
        }, 5000);
      }
    },
  });

  const extractItemKey = (item: any) => {
    const key = Object.keys(item)[0];
    return key;
  };

  const formHasErrors = () => {
    let hasError = false;

    const errors: any[] = transformToArrayOfObjects(formik.errors);

    errors?.map((error) => {
      const key = extractItemKey(error);
      console.log("key", key);
      if (error[key]) {
        dispatch(showCardNotification({ type: "error", message: error[key] }));
        setTimeout(() => {
          dispatch(hideCardNotification());
        }, 5000);
        hasError = true;
      }
    });

    // Validate for empty field values
    if (!formik.values.statementOfFaithAndUnderstandingChristian) {
      dispatch(
        showCardNotification({
          type: "error",
          message: "Please check form for errors",
        })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
      hasError = true;
    }

    return hasError;
  };

  const page = searchParams.get("page");

  const moveToNextPageHandler = () => {
    if (formHasErrors()) return;
    allCategorySubmitHandler();
    nextPageHandler();
  };

  function allCategorySubmitHandler() {
    saveFormDataToStorage({
      applicationForm: "promotion",
      category: "faithAndUnderstandingChristianity",
      data: formik.values,
      updateAt: new Date().toISOString(),
    });
  }

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
          section="section 3"
          footer="Promotion footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/*-----faith and understanding field Start -----*/}
            <div className="mb-4 mt-8">
              <p
                className="text-gray-50 font-semibold inline-block
               bg-primaryDark px-4 py-2 rounded uppercase"
              >
                Statement of Faith and Understanding Christian
              </p>
            </div>
            <div
              className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1 mt-4"
            >
              {formik.errors.statementOfFaithAndUnderstandingChristian &&
                formik.touched.statementOfFaithAndUnderstandingChristian && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.statementOfFaithAndUnderstandingChristian}
                  </p>
                )}
              <label className="text-sm">
                Statement of Faith and Understanding Christian Indentity in the
                university
              </label>
              <textarea
                id="statementOfFaithAndUnderstandingChristian"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.statementOfFaithAndUnderstandingChristian}
                className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full h-52"
              />
            </div>
            {/*-----faith and understanding field End -----*/}

            {/*----- Page Navigate buttons Start -----*/}
            <div className="mt-32 flex items-center justify-between">
              <button
                className="flex items-center justify-center bg-primaryDark
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
                className="w-10 h-10 rounded-[50%] bg-primaryDark grid
                 place-items-center text-gray-50"
              >
                <span>{page}</span>
              </p>
              <button
                className="flex items-center justify-center bg-primaryDark
                rounded-md gap-2 px-4 py-2 text-gray-50"
                onClick={() => moveToNextPageHandler()}
                type="submit"
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
            {/*-----Faculty field End -----*/}
            {/*----- Page Navigate buttons End -----*/}
          </form>
        </FormLayout>
      </div>
    </Fragment>
  );
};
