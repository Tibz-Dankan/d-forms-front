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
  schoolOfRecommendation: string;
  recommendationMeeting: string;
  recommendationDate: string;
  recommendationMinute: string;
  superVisorName1: string;
  superVisorAddress1: string;
  superVisorName2: string;
  superVisorAddress2: string;
  approvalMeeting: string;
  approvalDate: string;
  approvalMinute: string;
  degreeApprovedFor: string;
  supervisorSignature: string;
  dateOfRegistration: string;
};

/**
 * Section1x component has section 2
 */
export const Section5: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 6,
    section: "5",
    nextPageURL: "/postgraduate/section6",
    prevPageURL: "/postgraduate/section4",
  });

  const initialValues: InitialValues = {
    schoolOfRecommendation: "",
    recommendationMeeting: "",
    recommendationDate: "",
    recommendationMinute: "",
    superVisorName1: "",
    superVisorAddress1: "",
    superVisorName2: "",
    superVisorAddress2: "",
    approvalMeeting: "",
    approvalDate: "",
    approvalMinute: "",
    degreeApprovedFor: "",
    supervisorSignature: "",
    dateOfRegistration: "",
  };

  const getInitialValues = (): InitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "postgraduate",
      category: "officialUseRecommendation",
    }) as InitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      // schoolOfRecommendation: Yup.string().max(255)("Reason for course of"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        //   Save info to storage
        saveFormDataToStorage({
          applicationForm: "postgraduate",
          category: "officialUseRecommendation",
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

  // Validating general fields
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

    // // check for empty field values
    // if (
    //   !formik.values.motherGuardianCountry
    // ) {
    //   dispatch(
    //     showCardNotification({
    //       type: "error",
    //       message: "Check form for errors",
    //     })
    //   );
    //   setTimeout(() => {
    //     dispatch(hideCardNotification());
    //   }, 5000);
    //   hasError = true;
    // }

    return hasError;
  };

  const page = searchParams.get("page");

  const moveToNextPageHandler = () => {
    if (formHasErrors()) return;
    recommendationSubmitHandler();
    nextPageHandler();
  };

  function recommendationSubmitHandler() {
    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "officialUseRecommendation",
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
                <span className="text-base font-normal">
                  OFFICE OF THE DEPUTY VICE CHANCELLOR FOR ACADEMIC AFFAIRS
                </span>
                <span className="text-base">
                  APPLICATION FOR ADMISSION TO POSTGRADUATE PROGRAMMES
                </span>
              </h1>
            </div>
          }
          section="section 5"
          footer="Employment footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            <div className="my-2 w-full">
              <p
                className="text-gray-50 font-semibold inline-block
                 bg-primaryDark px-4 py-2 rounded"
              >
                SECTION 5.0. FOR OFFICIAL USE ONLY
              </p>
            </div>
            <div className="my-2">
              <p className="text-gray-800 inline-block py-2 rounded">
                5.0 Recommendation by the School
              </p>
            </div>
            {/* ----- Recommendations fields  Start -----*/}
            <div>
              <div className="my-2">
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1 w-full sm:w-1/2"
                >
                  <label className="text-sm">School name</label>
                  <input
                    type="text"
                    name="schoolOfRecommendation"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.schoolOfRecommendation}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
              </div>

              {/* ---- Meeting Date  Minutes start   ----*/}
              <div className=" mt-8">
                <p
                  className="text-gray-800 inline-block py-2 rounded
                 bg-gray-400 px-4"
                >
                  (i) Meeting
                </p>
              </div>
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3 mt-2 mb-8">
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  <label className="text-sm">Meeting</label>
                  <input
                    type="text"
                    id="recommendationMeeting"
                    name={"recommendationMeeting"}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.recommendationMeeting}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  <label className="text-sm">Date</label>
                  <input
                    type="text"
                    id="recommendationDate"
                    name="recommendationDate"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.recommendationDate}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                       justify-center gap-1"
                >
                  <label className="text-sm">Minute</label>
                  <input
                    type="text"
                    id="recommendationMinute"
                    name="recommendationMinute"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.recommendationMinute}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
              </div>
              {/* ---- Meeting Date  Minutes End  ----*/}

              {/* ---- Supervisors start  ----*/}
              <div className=" mt-8">
                <p
                  className="text-gray-800 inline-block py-2 rounded
                 bg-gray-400 px-4"
                >
                  (ii) Supervisor(s)
                </p>
              </div>
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  <label className="text-sm">Name</label>
                  <input
                    type="text"
                    id="superVisorAddress1"
                    name="superVisorAddress1"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.superVisorAddress1}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                    justify-center gap-1"
                >
                  <label className="text-sm">Address</label>
                  <input
                    type="text"
                    id="superVisorAddress1"
                    name="superVisorAddress1"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.superVisorAddress1}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  <label className="text-sm">Name</label>
                  <input
                    type="text"
                    id="superVisorName2"
                    name="superVisorName2"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.superVisorName2}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  <label className="text-sm">Address</label>
                  <input
                    type="text"
                    id="superVisorAddress2"
                    name="superVisorAddress2"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.superVisorAddress2}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
              </div>
            </div>

            {/*----- super signature ----- */}
            <div className="mt-8">
              <p
                className="text-gray-800 inline-block py-2 rounded
                 bg-gray-400 px-4"
              >
                Signature
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
              >
                <label className="text-sm">Signature</label>
                <input
                  type="text"
                  id="supervisorSignature"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.supervisorSignature}
                  className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                />
              </div>
            </div>

            {/* ---- Supervisors End  ----*/}

            {/* ---- Approved by board Start  ----*/}
            <div className="mt-8">
              <p
                className="text-gray-800 inline-block py-2 rounded
                 bg-gray-400s px-4s"
              >
                5.1 Approved by the Admissions Board
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
              >
                <label className="text-sm">Meeting</label>
                <input
                  type="text"
                  id="approvalMeeting"
                  name="approvalMeeting"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.approvalMeeting}
                  className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
              >
                <label className="text-sm">Date</label>
                <input
                  type="text"
                  id="approvalDate"
                  name="approvalDate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.approvalDate}
                  className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                       justify-center gap-1"
              >
                <label className="text-sm">Minute</label>
                <input
                  type="text"
                  id="approvalMeeting"
                  name="approvalMeeting"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.approvalMeeting}
                  className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-2 mb-8 text-sm">
              <div className="flex items-end justify-start gap-2 text-base">
                <span>For the degree of</span>
                <div
                  className="relative  flex flex-col items-start 
                   justify-center"
                >
                  <input
                    type="text"
                    id="degreeApprovedFor"
                    name="degreeApprovedFor"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.degreeApprovedFor}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
                <span>by</span>
              </div>
              <ul className="">
                <li>(a) Thesis / research</li>
                <li>(b) Course-work and Dissertation/Project</li>
                <li>(c) Course-work alone</li>
              </ul>
            </div>
            {/* ---- Approved by board End  ----*/}

            {/*----- Date of registration Start ----- */}
            <div className="mt-8">
              <p className="text-gray-800 inline-block py-2 pb-0 rounded">
                5.2 Effective date of registration
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
              >
                <label className="text-sm">Date</label>
                <input
                  type="date"
                  id="dateOfRegistration"
                  name="dateOfRegistration"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.dateOfRegistration}
                  className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                />
              </div>
            </div>
            {/*----- Date of registration End ----- */}

            {/* ----- Recommendations fields  End -----*/}

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
                   place-items-center text-gray-50 font-semibolds text-lgs"
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
