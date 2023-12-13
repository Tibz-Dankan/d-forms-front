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

type InitialValues = {
  declarationDate: string;
  declarationSignature: string;
};

/**
 * Section3 component has section 3 content
 */
export const Section4: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 5,
    section: "4",
    nextPageURL: "/postgraduate/section5",
    prevPageURL: "/postgraduate/section3",
  });

  const initialValues: InitialValues = {
    declarationDate: "",
    declarationSignature: "",
  };

  const getInitialValues = (): InitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "postgraduate",
      category: "declaration",
    }) as InitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      declarationDate: Yup.string().max(255).required("Date is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        //   Save info to storage
        saveFormDataToStorage({
          applicationForm: "postgraduate",
          category: "declaration",
          data: formik.values,
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

    console.log("formik.values", formik.values);
    // check for empty field values
    if (!formik.values.declarationDate) {
      dispatch(
        showCardNotification({
          type: "error",
          message: "Check form for errors",
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
    nextPageHandler();
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
                <span className="text-base font-normal">
                  OFFICE OF THE DEPUTY VICE CHANCELLOR FOR ACADEMIC AFFAIRS
                </span>
                <span className="text-base">
                  APPLICATION FOR ADMISSION TO POSTGRADUATE PROGRAMMES
                </span>
              </h1>
            </div>
          }
          section="section 4"
          footer="Employment footer"
        >
          <div className="w-full">
            <div className="my-2">
              <p
                className="text-gray-50 font-semibold inline-block
                    bg-primaryDark px-4 py-2 rounded"
              >
                SECTION 4.0: DECLARATION
              </p>
            </div>

            <div className="my-2 text-sm">
              <p className="text-gray-800 text-sm inline-block py-2 rounded">
                4.1. It should be noted by all applicants that:
              </p>
              <ul className="pl-4 space-y-2">
                <li>
                  1. Pursuing two or more academic programmes simultaneously is
                  only acceptable with permission from University senate
                </li>
                <li>
                  2. All cases of Impersonation, Falsification of Documents or
                  giving False/Incomplete information whenever discovered either
                  at registration or afterwards will lead to automatic
                  CANCELLATION OF ADMISSION and prosecution in the Uganda Courts
                  of Law.
                </li>
              </ul>
            </div>
          </div>

          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/*----- Declaration fields Start -----*/}
            <div
              className="flex flex-col items-start justify-center 
                sm:flex-row sm:items-center sm:justify-start gap-2"
            >
              <div
                className=" relative pt-4 flex flex-col items-start 
                  justify-center gap-1 w-full"
              >
                {formik.errors.declarationSignature &&
                  formik.touched.declarationSignature && (
                    <p className="absolute top-0 left-4 text-sm text-red-600">
                      {formik.errors.declarationSignature}
                    </p>
                  )}
                <label className="text-sm">Signature of Applicant</label>
                <input
                  // required
                  type="text"
                  id="declarationSignature"
                  name="declarationSignature"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.declarationSignature}
                  className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className=" relative pt-4 flex flex-col items-start 
                  justify-center gap-1 w-full"
              >
                {formik.errors.declarationDate &&
                  formik.touched.declarationDate && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.declarationDate}
                    </p>
                  )}
                <label className="text-sm">Date:</label>
                <input
                  required
                  type="date"
                  id="declarationDate"
                  name="declarationDate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.declarationDate}
                  className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                />
              </div>
            </div>
            {/*----- Declaration fields End -----*/}

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
                   place-items-center text-gray-50 text-lgs"
              >
                <span>{page}</span>
              </p>
              <button
                className="flex items-center justify-center bg-primary
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
            {/*----- Page Navigate buttons End -----*/}
          </form>
        </FormLayout>
      </div>
    </Fragment>
  );
};
