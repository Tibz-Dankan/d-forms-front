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
  campus: string;
  faculty: string;
  department: string;
  currentPosition: string;
  promotionPosition: string;
  contractExpiryDate: string;
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
    campus: "",
    faculty: "",
    department: "",
    currentPosition: "",
    promotionPosition: "",
    contractExpiryDate: "",
  };

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "campus",
    }) as TInitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      campus: Yup.string().max(255).required("Campus name is required"),
      faculty: Yup.string().max(255).required("Faculty name is required"),
      department: Yup.string()
        .max(255)
        .required("Department of birth is required"),
      currentPosition: Yup.string()
        .max(255)
        .required("current position is required"),
      contractExpiryDate: Yup.string()
        .max(255)
        .required("Contract expiry date name is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // Save Personal Information
        saveFormDataToStorage({
          applicationForm: "promotion",
          category: "campus",
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
    if (
      !formik.values.campus ||
      !formik.values.faculty ||
      !formik.values.department ||
      !formik.values.currentPosition ||
      !formik.values.promotionPosition ||
      !formik.values.contractExpiryDate
    ) {
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
      category: "campus",
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
          section="section 2"
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
                {formik.errors.faculty && formik.touched.faculty && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.faculty}
                  </p>
                )}
                <label className="text-sm">From</label>
                <input
                  type="text"
                  id="faculty"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.faculty}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.faculty && formik.touched.faculty && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.faculty}
                  </p>
                )}
                <label className="text-sm">To</label>
                <input
                  type="text"
                  id="faculty"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.faculty}
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
                {formik.errors.faculty && formik.touched.faculty && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.faculty}
                  </p>
                )}
                <label className="text-sm">Exact title of your post</label>
                <input
                  type="text"
                  id="faculty"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.faculty}
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
                {formik.errors.department && formik.touched.department && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.department}
                  </p>
                )}
                <label className="text-sm">Name of supervisor</label>
                <input
                  type="text"
                  required
                  id="department"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.department}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.contractExpiryDate &&
                  formik.touched.contractExpiryDate && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.contractExpiryDate}
                    </p>
                  )}
                <label className="text-sm">
                  Number and kind of employees supervised by you
                </label>
                <input
                  type="text"
                  required
                  id="contractExpiryDate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contractExpiryDate}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>

            {/*----- Gross Start ------*/}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.currentPosition &&
                  formik.touched.currentPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.currentPosition}
                    </p>
                  )}
                <label className="text-sm">Start gross</label>
                <input
                  type="number"
                  required
                  id="currentPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPosition}
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
                {formik.errors.currentPosition &&
                  formik.touched.currentPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.currentPosition}
                    </p>
                  )}
                <label className="text-sm">Most recent gross</label>
                <input
                  type="number"
                  required
                  id="currentPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPosition}
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
                  {formik.errors.promotionPosition &&
                    formik.touched.promotionPosition && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.promotionPosition}
                      </p>
                    )}
                  <label className="text-sm">Tax</label>
                  <input
                    type="number"
                    required
                    id="promotionPosition"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.promotionPosition}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  {formik.errors.promotionPosition &&
                    formik.touched.promotionPosition && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.promotionPosition}
                      </p>
                    )}
                  <label className="text-sm">Net</label>
                  <input
                    type="number"
                    required
                    id="promotionPosition"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.promotionPosition}
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
                {formik.errors.currentPosition &&
                  formik.touched.currentPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.currentPosition}
                    </p>
                  )}
                <label className="text-sm">
                  Name and address of your employer
                </label>
                <input
                  type="text"
                  required
                  id="currentPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPosition}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.promotionPosition &&
                  formik.touched.promotionPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.promotionPosition}
                    </p>
                  )}
                <label className="text-sm">Type of business</label>
                <input
                  type="text"
                  required
                  id="promotionPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.promotionPosition}
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
                {formik.errors.promotionPosition &&
                  formik.touched.promotionPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.promotionPosition}
                    </p>
                  )}
                <label className="text-sm">Description of your duties</label>
                <textarea
                  required
                  id="promotionPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.promotionPosition}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full h-28"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.promotionPosition &&
                  formik.touched.promotionPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.promotionPosition}
                    </p>
                  )}
                <label className="text-sm">
                  Reasons for having or wishing to leave
                </label>
                <textarea
                  required
                  id="promotionPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.promotionPosition}
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
                {formik.errors.faculty && formik.touched.faculty && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.faculty}
                  </p>
                )}
                <label className="text-sm">From</label>
                <input
                  type="text"
                  id="faculty"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.faculty}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.faculty && formik.touched.faculty && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.faculty}
                  </p>
                )}
                <label className="text-sm">To</label>
                <input
                  type="text"
                  id="faculty"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.faculty}
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
                {formik.errors.faculty && formik.touched.faculty && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.faculty}
                  </p>
                )}
                <label className="text-sm">Exact title of your post</label>
                <input
                  type="text"
                  id="faculty"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.faculty}
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
                {formik.errors.department && formik.touched.department && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.department}
                  </p>
                )}
                <label className="text-sm">Name of supervisor</label>
                <input
                  type="text"
                  required
                  id="department"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.department}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.contractExpiryDate &&
                  formik.touched.contractExpiryDate && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.contractExpiryDate}
                    </p>
                  )}
                <label className="text-sm">
                  Number and kind of employees supervised by you
                </label>
                <input
                  type="text"
                  required
                  id="contractExpiryDate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contractExpiryDate}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>

            {/*----- Gross Start ------*/}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.currentPosition &&
                  formik.touched.currentPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.currentPosition}
                    </p>
                  )}
                <label className="text-sm">Start gross</label>
                <input
                  type="number"
                  required
                  id="currentPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPosition}
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
                {formik.errors.currentPosition &&
                  formik.touched.currentPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.currentPosition}
                    </p>
                  )}
                <label className="text-sm">Most recent gross</label>
                <input
                  type="number"
                  required
                  id="currentPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPosition}
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
                  {formik.errors.promotionPosition &&
                    formik.touched.promotionPosition && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.promotionPosition}
                      </p>
                    )}
                  <label className="text-sm">Tax</label>
                  <input
                    type="number"
                    required
                    id="promotionPosition"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.promotionPosition}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
                <div
                  className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                >
                  {formik.errors.promotionPosition &&
                    formik.touched.promotionPosition && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.promotionPosition}
                      </p>
                    )}
                  <label className="text-sm">Net</label>
                  <input
                    type="number"
                    required
                    id="promotionPosition"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.promotionPosition}
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
                {formik.errors.currentPosition &&
                  formik.touched.currentPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.currentPosition}
                    </p>
                  )}
                <label className="text-sm">
                  Name and address of your employer
                </label>
                <input
                  type="text"
                  required
                  id="currentPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPosition}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.promotionPosition &&
                  formik.touched.promotionPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.promotionPosition}
                    </p>
                  )}
                <label className="text-sm">Type of business</label>
                <input
                  type="text"
                  required
                  id="promotionPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.promotionPosition}
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
                {formik.errors.promotionPosition &&
                  formik.touched.promotionPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.promotionPosition}
                    </p>
                  )}
                <label className="text-sm">Description of your duties</label>
                <textarea
                  required
                  id="promotionPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.promotionPosition}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full h-28"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.promotionPosition &&
                  formik.touched.promotionPosition && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.promotionPosition}
                    </p>
                  )}
                <label className="text-sm">
                  Reasons for having or wishing to leave
                </label>
                <textarea
                  required
                  id="promotionPosition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.promotionPosition}
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
