import React, { Fragment, useState, ChangeEvent } from "react";
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
  receiveDate: string;
  receiveTime: string;
  receiveDateTime: string;
  familyname: string;
  firstname: string;
  maidenname: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  telephone: string;
  email: string;
};

export const Section1: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 1,
    section: "1",
    nextPageURL: "/promotion/section2",
    prevPageURL: "/promotion/section1",
  });

  const initialValues: TInitialValues = {
    receiveDate: "",
    receiveTime: "",
    receiveDateTime: "",
    familyname: "",
    firstname: "",
    maidenname: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    telephone: "",
    email: "",
  };

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "personalInfo",
    }) as TInitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      familyname: Yup.string().max(255).required("Family name is required"),
      firstname: Yup.string().max(255).required("First name is required"),
      dateOfBirth: Yup.string().max(255).required("Date of birth is required"),
      nationality: Yup.string().max(255).required("Nationality is required"),
      telephone: Yup.string().max(255).required("Telephone name is required"),
      email: Yup.string().max(255).required("Email name is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // Save Personal Information
        saveFormDataToStorage({
          applicationForm: "promotion",
          category: "personalInfo",
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

  const [gender, setGender] = useState<string>(formik.values.gender);

  const genderChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const sex: string = event.target.value;
    console.log("sex", sex);
    setGender(() => event.target.value);
  };

  const genderSubmitHandler = () => {
    if (!gender) {
      throw new Error("Gender is required");
    }
    formik.values.gender = gender;
  };

  const extractItemKey = (item: any) => {
    const key = Object.keys(item)[0];
    return key;
  };

  const formHasErrors = () => {
    let hasError = false;
    delete formik.errors.gender;

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
      !formik.values.receiveDate ||
      !formik.values.receiveTime ||
      !formik.values.familyname ||
      !formik.values.maidenname ||
      !formik.values.dateOfBirth ||
      !formik.values.nationality ||
      !formik.values.telephone ||
      !formik.values.email
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
    genderSubmitHandler();
    saveFormDataToStorage({
      applicationForm: "promotion",
      category: "personalInfo",
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
          section="section 1"
          footer="Employment footer"
        >
          {/*----- Notice Start ----- */}
          <div className="text-sm italic space-y-2 mb-16">
            <p className="text-center">
              <span className="text-base font-semibold">
                To be filled in duplicate
              </span>
            </p>
            <p className="text-center not-italic">
              <span className="text-base font-semibold">
                INSTRUCTIONS: Please read carefully and complete all sections
              </span>
            </p>
          </div>
          {/*----- Notice End ----- */}

          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/*----- Received by Human Resource Department Start -----*/}
            <div className="mb-2 mt-8">
              <p className="text-gray-800  inline-block rounded text-base">
                Received by Human Resource Department on date and time:
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.receiveDate && formik.touched.receiveDate && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.receiveDate}
                  </p>
                )}
                <label className="text-sm">Date</label>
                <input
                  type="date"
                  required
                  id="receiveDate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.receiveDate}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.receiveTime && formik.touched.receiveTime && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.receiveTime}
                  </p>
                )}
                <label className="text-sm">Time</label>
                <input
                  type="time"
                  id="receiveTime"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.receiveTime}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            {/*----- Received by Human Resource Department End -----*/}

            {/*----- Personal Information Start -----*/}
            <div className="mb-4 mt-8">
              <p
                className="text-gray-50 font-semibold inline-block
               bg-primaryDark px-4 py-2 rounded"
              >
                PERSONAL INFORMATION
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.familyname && formik.touched.familyname && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.familyname}
                  </p>
                )}
                <label className="text-sm">Family name(Last name)</label>
                <input
                  type="text"
                  required
                  id="familyname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.familyname}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.firstname && formik.touched.firstname && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.firstname}
                  </p>
                )}
                <label className="text-sm">First name</label>
                <input
                  type="text"
                  id="firstname"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.maidenname && formik.touched.maidenname && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.maidenname}
                  </p>
                )}
                <label className="text-sm">Maiden name, if application</label>
                <input
                  type="text"
                  required
                  id="maidenname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.maidenname}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.dateOfBirth}
                  </p>
                )}
                <label className="text-sm">Date of birth</label>
                <input
                  type="date"
                  required
                  id="dateOfBirth"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.dateOfBirth}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.telephone && formik.touched.telephone && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.telephone}
                  </p>
                )}
                <label className="text-sm">Telephone no</label>
                <input
                  type="number"
                  required
                  id="telephone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.telephone}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.email && formik.touched.email && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
                <label className="text-sm">Email Address</label>
                <input
                  type="email"
                  required
                  id="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.nationality && formik.touched.nationality && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.nationality}
                  </p>
                )}
                <label className="text-sm">Nationality</label>
                <input
                  type="text"
                  required
                  id="nationality"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.nationality}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div className="flex items-end pb-2 justify-start gap-3 bg-green-500s">
                <label className="text-sm">Gender</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="genderFemale"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={genderChangeHandler}
                    className="mr-2"
                  />
                  <label htmlFor="disabilityYes" className="mr-4">
                    Female
                  </label>
                  <input
                    type="radio"
                    id="genderMale"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={genderChangeHandler}
                    className="mr-2"
                  />
                  <label htmlFor="disabilityNo">Male</label>
                </div>
              </div>
            </div>
            {/*----- Personal Information End -----*/}

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
            {/*----- Page Navigate buttons End -----*/}
          </form>
        </FormLayout>
      </div>
    </Fragment>
  );
};
