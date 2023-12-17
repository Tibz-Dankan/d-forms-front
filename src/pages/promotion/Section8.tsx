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
  presentEmploymentFromDate: string;
  presentEmploymentToDate: string;
  presentEmploymentPost: string;
  presentEmploymentSupervisor: string;
  presentEmploymentEmployeesSupervisedBy: string;
  presentEmploymentStartingGross: string;
  presentEmploymentMostRecentGross: string;
  presentEmploymentTax: string;
  presentEmploymentNet: string;
  presentEmploymentNameAndAddressOfEmployer: string;
  presentEmploymentBusinessType: string;
  presentEmploymentDutyDescription: string;
  presentEmploymentReasonsForLeaving: string;
  previousEmploymentFromDate: string;
  previousEmploymentToDate: string;
  previousEmploymentPost: string;
  previousEmploymentSupervisor: string;
  previousEmploymentEmployeesSupervisedBy: string;
  previousEmploymentStartingGross: string;
  previousEmploymentMostRecentGross: string;
  previousEmploymentTax: string;
  previousEmploymentNet: string;
  previousEmploymentNameAndAddressOfEmployer: string;
  previousEmploymentBusinessType: string;
  previousEmploymentDutyDescription: string;
  previousEmploymentReasonsForLeaving: string;
};

export const Section8: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 8,
    section: "8",
    nextPageURL: "/promotion/section9",
    prevPageURL: "/promotion/section7",
  });

  const initialValues: TInitialValues = {
    presentEmploymentFromDate: "",
    presentEmploymentToDate: "",
    presentEmploymentPost: "",
    presentEmploymentSupervisor: "",
    presentEmploymentEmployeesSupervisedBy: "",
    presentEmploymentStartingGross: "",
    presentEmploymentMostRecentGross: "",
    presentEmploymentTax: "",
    presentEmploymentNet: "",
    presentEmploymentNameAndAddressOfEmployer: "",
    presentEmploymentBusinessType: "",
    presentEmploymentDutyDescription: "",
    presentEmploymentReasonsForLeaving: "",
    previousEmploymentFromDate: "",
    previousEmploymentToDate: "",
    previousEmploymentPost: "",
    previousEmploymentSupervisor: "",
    previousEmploymentEmployeesSupervisedBy: "",
    previousEmploymentStartingGross: "",
    previousEmploymentMostRecentGross: "",
    previousEmploymentTax: "",
    previousEmploymentNet: "",
    previousEmploymentNameAndAddressOfEmployer: "",
    previousEmploymentBusinessType: "",
    previousEmploymentDutyDescription: "",
    previousEmploymentReasonsForLeaving: "",
  };

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "employmentRecord",
    }) as TInitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      presentEmploymentFromDate: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentToDate: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentPost: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentSupervisor: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentEmployeesSupervisedBy: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentStartingGross: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentMostRecentGross: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentTax: Yup.string().max(255).required("Field is required"),
      presentEmploymentNet: Yup.string().max(255).required("Field is required"),
      presentEmploymentNameAndAddressOfEmployer: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentBusinessType: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentDutyDescription: Yup.string()
        .max(255)
        .required("Field is required"),
      presentEmploymentReasonsForLeaving: Yup.string()
        .max(255)
        .required("Field is required"),
      // previous employer start
      previousEmploymentFromDate: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentToDate: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentPost: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentSupervisor: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentEmployeesSupervisedBy: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentStartingGross: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentMostRecentGross: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentTax: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentNet: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentNameAndAddressOfEmployer: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentBusinessType: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentDutyDescription: Yup.string()
        .max(255)
        .required("Field is required"),
      previousEmploymentReasonsForLeaving: Yup.string()
        .max(255)
        .required("Field is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // Save Personal Information
        saveFormDataToStorage({
          applicationForm: "promotion",
          category: "employmentRecord",
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
    const values: any[] = transformToArrayOfObjects(formik.values);

    for (let i = 0; i < values.length; i++) {
      const key: string = extractItemKey(values[i]);
      console.log("key of the value ->", key);
      if (!values[i][key]) {
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
        break;
      }
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
      category: "employmentRecord",
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
          section="section 8"
          footer="Promotion footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            <div className="mb-4 mt-8">
              <p
                className="text-gray-50 font-semibold inline-block
                bg-primaryDark px-4 py-2 rounded"
              >
                EMPLOYMENT RECORD
              </p>
            </div>

            {/*-----Present employment Start -----*/}
            <div className="mb-0 mt-8">
              <p
                className="text-gray-800 font-semibold inline-block
                 bg-gray-400  px-4 py-2 rounded"
              >
                PRESENT EMPLOYMENT
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentFromDate &&
                  formik.touched.presentEmploymentFromDate && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentFromDate}
                    </p>
                  )}
                <label className="text-sm">From</label>
                <input
                  type="month"
                  id="presentEmploymentFromDate"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentFromDate}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentToDate &&
                  formik.touched.presentEmploymentToDate && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentToDate}
                    </p>
                  )}
                <label className="text-sm">To</label>
                <input
                  type="month"
                  id="presentEmploymentToDate"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentToDate}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentPost &&
                  formik.touched.presentEmploymentPost && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentPost}
                    </p>
                  )}
                <label className="text-sm">Exact title of your post</label>
                <input
                  type="text"
                  id="presentEmploymentPost"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentPost}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentSupervisor &&
                  formik.touched.presentEmploymentSupervisor && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentSupervisor}
                    </p>
                  )}
                <label className="text-sm">Name of supervisor</label>
                <input
                  type="text"
                  required
                  id="presentEmploymentSupervisor"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentSupervisor}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentEmployeesSupervisedBy &&
                  formik.touched.presentEmploymentEmployeesSupervisedBy && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentEmployeesSupervisedBy}
                    </p>
                  )}
                <label className="text-sm">
                  Number and kind of employees supervised by you
                </label>
                <input
                  type="text"
                  required
                  id="presentEmploymentEmployeesSupervisedBy"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentEmployeesSupervisedBy}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>

            {/*----- Gross Start ------*/}
            <div className="mb-0 mt-8">
              <p
                className="text-gray-800 font-semibolds inline-block
                 bg-gray-400  px-4 py-2 rounded"
              >
                Total annual remuneration
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentStartingGross &&
                  formik.touched.presentEmploymentStartingGross && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentStartingGross}
                    </p>
                  )}
                <label className="text-sm">Starting (gross)</label>
                <input
                  type="number"
                  required
                  id="presentEmploymentStartingGross"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentStartingGross}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentMostRecentGross &&
                  formik.touched.presentEmploymentMostRecentGross && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentMostRecentGross}
                    </p>
                  )}
                <label className="text-sm">Most recent (gross)</label>
                <input
                  type="number"
                  required
                  id="presentEmploymentMostRecentGross"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentMostRecentGross}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <div
                  className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                >
                  {formik.errors.presentEmploymentTax &&
                    formik.touched.presentEmploymentTax && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.presentEmploymentTax}
                      </p>
                    )}
                  <label className="text-sm">Tax</label>
                  <input
                    type="number"
                    required
                    id="presentEmploymentTax"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.presentEmploymentTax}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  {formik.errors.presentEmploymentNet &&
                    formik.touched.presentEmploymentNet && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.presentEmploymentNet}
                      </p>
                    )}
                  <label className="text-sm">Net</label>
                  <input
                    type="number"
                    required
                    id="presentEmploymentNet"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.presentEmploymentNet}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
              </div>
            </div>
            {/*----- Gross End ------*/}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentNameAndAddressOfEmployer &&
                  formik.touched.presentEmploymentNameAndAddressOfEmployer && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentNameAndAddressOfEmployer}
                    </p>
                  )}
                <label className="text-sm">
                  Name and address of your employer
                </label>
                <input
                  type="text"
                  required
                  id="presentEmploymentNameAndAddressOfEmployer"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={
                    formik.values.presentEmploymentNameAndAddressOfEmployer
                  }
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentBusinessType &&
                  formik.touched.presentEmploymentBusinessType && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentBusinessType}
                    </p>
                  )}
                <label className="text-sm">Type of business</label>
                <input
                  type="text"
                  required
                  id="presentEmploymentBusinessType"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentBusinessType}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentDutyDescription &&
                  formik.touched.presentEmploymentDutyDescription && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentDutyDescription}
                    </p>
                  )}
                <label className="text-sm">Description of your duties</label>
                <textarea
                  required
                  id="presentEmploymentDutyDescription"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentDutyDescription}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full h-28"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.presentEmploymentReasonsForLeaving &&
                  formik.touched.presentEmploymentReasonsForLeaving && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.presentEmploymentReasonsForLeaving}
                    </p>
                  )}
                <label className="text-sm">
                  Reasons for having or wishing to leave
                </label>
                <textarea
                  required
                  id="presentEmploymentReasonsForLeaving"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.presentEmploymentReasonsForLeaving}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full h-28"
                />
              </div>
            </div>
            {/*-----Present employment End -----*/}

            {/*-----Previous employment Start -----*/}
            <div className="mb-0 mt-12">
              <p
                className="text-gray-800 font-semibold inline-block
                 bg-gray-400  px-4 py-2 rounded"
              >
                PREVIOUS EMPLOYMENT
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentFromDate &&
                  formik.touched.previousEmploymentFromDate && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentFromDate}
                    </p>
                  )}
                <label className="text-sm">From</label>
                <input
                  type="month"
                  id="previousEmploymentFromDate"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentFromDate}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentToDate &&
                  formik.touched.previousEmploymentToDate && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentToDate}
                    </p>
                  )}
                <label className="text-sm">To</label>
                <input
                  type="month"
                  id="previousEmploymentToDate"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentToDate}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentPost &&
                  formik.touched.previousEmploymentPost && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentPost}
                    </p>
                  )}
                <label className="text-sm">Exact title of your post</label>
                <input
                  type="text"
                  id="previousEmploymentPost"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentPost}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentSupervisor &&
                  formik.touched.previousEmploymentSupervisor && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentSupervisor}
                    </p>
                  )}
                <label className="text-sm">Name of supervisor</label>
                <input
                  type="text"
                  required
                  id="previousEmploymentSupervisor"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentSupervisor}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentEmployeesSupervisedBy &&
                  formik.touched.previousEmploymentEmployeesSupervisedBy && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentEmployeesSupervisedBy}
                    </p>
                  )}
                <label className="text-sm">
                  Number and kind of employees supervised by you
                </label>
                <input
                  type="text"
                  required
                  id="previousEmploymentEmployeesSupervisedBy"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentEmployeesSupervisedBy}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>

            {/*----- Gross Start ------*/}
            <div className="mb-0 mt-8">
              <p
                className="text-gray-800 font-semibolds inline-block
                 bg-gray-400  px-4 py-2 rounded"
              >
                Total annual remuneration
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentStartingGross &&
                  formik.touched.previousEmploymentStartingGross && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentStartingGross}
                    </p>
                  )}
                <label className="text-sm">Starting (gross)</label>
                <input
                  type="number"
                  required
                  id="previousEmploymentStartingGross"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentStartingGross}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentMostRecentGross &&
                  formik.touched.previousEmploymentMostRecentGross && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentMostRecentGross}
                    </p>
                  )}
                <label className="text-sm">Most recent (gross)</label>
                <input
                  type="number"
                  required
                  id="previousEmploymentMostRecentGross"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentMostRecentGross}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <div
                  className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                >
                  {formik.errors.previousEmploymentTax &&
                    formik.touched.previousEmploymentTax && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.previousEmploymentTax}
                      </p>
                    )}
                  <label className="text-sm">Tax</label>
                  <input
                    type="number"
                    required
                    id="previousEmploymentTax"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.previousEmploymentTax}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  {formik.errors.previousEmploymentNet &&
                    formik.touched.previousEmploymentNet && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.previousEmploymentNet}
                      </p>
                    )}
                  <label className="text-sm">Net</label>
                  <input
                    type="number"
                    required
                    id="previousEmploymentNet"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.previousEmploymentNet}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
              </div>
            </div>
            {/*----- Gross End ------*/}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentNameAndAddressOfEmployer &&
                  formik.touched.previousEmploymentNameAndAddressOfEmployer && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentNameAndAddressOfEmployer}
                    </p>
                  )}
                <label className="text-sm">
                  Name and address of your employer
                </label>
                <input
                  type="text"
                  required
                  id="previousEmploymentNameAndAddressOfEmployer"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={
                    formik.values.previousEmploymentNameAndAddressOfEmployer
                  }
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentBusinessType &&
                  formik.touched.previousEmploymentBusinessType && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentBusinessType}
                    </p>
                  )}
                <label className="text-sm">Type of business</label>
                <input
                  type="text"
                  required
                  id="previousEmploymentBusinessType"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentBusinessType}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentDutyDescription &&
                  formik.touched.previousEmploymentDutyDescription && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentDutyDescription}
                    </p>
                  )}
                <label className="text-sm">Description of your duties</label>
                <textarea
                  required
                  id="previousEmploymentDutyDescription"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentDutyDescription}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full h-28"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.previousEmploymentReasonsForLeaving &&
                  formik.touched.previousEmploymentReasonsForLeaving && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.previousEmploymentReasonsForLeaving}
                    </p>
                  )}
                <label className="text-sm">
                  Reasons for having or wishing to leave
                </label>
                <textarea
                  required
                  id="previousEmploymentReasonsForLeaving"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.previousEmploymentReasonsForLeaving}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full h-28"
                />
              </div>
            </div>
            {/*-----Previous employment End -----*/}

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
