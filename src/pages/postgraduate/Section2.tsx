import React, { Fragment, useEffect, useState } from "react";
import { FormLayout } from "../../layout/FormLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  showCardNotification,
  hideCardNotification,
} from "../../store/actions/notification";
import { useDispatch } from "react-redux";
import { IconContext } from "react-icons";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useSearchParams, useNavigate } from "react-router-dom";
import { transformToArrayOfObjects } from "../../utils/transformToArrayOfObject";
import {
  saveFormDataToStorage,
  getDataFromStorage,
} from "../../utils/saveFormDataToStorage";

type TMaritalStatus = {};

type TInitialValues = {
  intake: string;
  program: string;
  campus: string;
  givenname: string;
  surname: string;
  othername: string;
  title: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  countyOfResidence: string;
  homeDistrict: string;
  homeDiocese: string;
  religiousAffiliation: string;
  maritalStatus: TMaritalStatus;
};

export const Section2: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const initialValues: TInitialValues = {
    intake: "",
    program: "",
    campus: "",
    givenname: "",
    surname: "",
    othername: "",
    title: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    countyOfResidence: "",
    homeDistrict: "",
    homeDiocese: "",
    religiousAffiliation: "",
    maritalStatus: {},
  };

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "postgraduate",
      category: "personalInfo",
    }) as TInitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      intake: Yup.string().max(255).required("Intake number is required"),
      program: Yup.string().max(255).required("Program is required"),
      campus: Yup.string().max(255).required("Campus is required"),
      givenname: Yup.string().max(255).required("Given name is required"),
      surname: Yup.string().max(255).required("Surname is required"),
      othername: Yup.string().max(255).required("Other name is required"),
      title: Yup.string().max(255).required("Title is required"),
      gender: Yup.string().max(255).required("Gender is required"),
      dateOfBirth: Yup.string().max(50).required("Date of birth is required"),
      nationality: Yup.string().max(50).required("Nationality is required"),
      countyOfResidence: Yup.string()
        .max(50)
        .required("country of residence is required"),
      homeDistrict: Yup.string().max(50).required("Home district  is required"),
      homeDiocese: Yup.string().max(50).required("Home diocese  is required"),
      religiousAffiliation: Yup.string()
        .max(50)
        .required("Religious affiliation is required"),
      maritalStatus: Yup.string()
        .max(50)
        .required("MaritalStatus diocese  is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // Save Personal Information
        saveFormDataToStorage({
          applicationForm: "postgraduate",
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

  const extractItemKey = (item: any) => {
    const key = Object.keys(item)[0];
    return key;
  };

  const formHasErrors = () => {
    let hasError = false;
    delete formik.errors?.maritalStatus;

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

    // check for empty field values
    if (
      !formik.values.intake ||
      !formik.values.program ||
      !formik.values.campus ||
      !formik.values.givenname ||
      !formik.values.surname ||
      !formik.values.othername ||
      !formik.values.title ||
      !formik.values.gender ||
      !formik.values.dateOfBirth ||
      !formik.values.nationality ||
      !formik.values.countyOfResidence ||
      !formik.values.homeDistrict ||
      !formik.values.homeDiocese
    ) {
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

  useEffect(() => {
    const setDefaultSearchParams = () => {
      setSearchParams(
        (prev) => {
          prev.set("page", "1");
          prev.set("section", "1");
          return prev;
        },
        { replace: true }
      );
      currentMaxPageHandler();
    };
    setDefaultSearchParams();
  }, []);

  const page = searchParams.get("page");
  const section = searchParams.get("section");
  const currentMaxPage = searchParams.get("currMaxPage");

  function currentMaxPageHandler() {
    // if current max page is defined
    if (!currentMaxPage) {
      setSearchParams(
        (prev) => {
          prev.set("currMaxPage", "1");
          return prev;
        },
        { replace: true }
      );
      return;
    }

    if (!page || !currentMaxPage) return;

    const currPage = parseInt(page);
    const currMaxPage = parseInt(currentMaxPage);
    if (currPage === currMaxPage || currPage < currMaxPage) return;

    const nextMaxPage = parseInt(page) + 1;
    setSearchParams(
      (prev) => {
        prev.set("currMaxPage", `${nextMaxPage}`);
        return prev;
      },
      { replace: true }
    );
  }

  const nextPageHandler = () => {
    if (!page || !section) return;
    if (formHasErrors()) return;
    const nextPage = parseInt(page) + 1;
    const nextSection = parseInt(section) + 1;
    console.log("nextPage", nextPage);
    console.log("nextSection", nextSection);

    setSearchParams(
      (prev) => {
        prev.set("page", `${nextPage}`);
        prev.set("section", `${nextSection}`);
        return prev;
      },
      { replace: true }
    );
    currentMaxPageHandler();
    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "personalInfo",
      data: formik.values,
      updateAt: new Date().toISOString(),
    });
    navigate(`/postgraduate/section${nextPage}`, { replace: false });
  };

  const prevPageHandler = () => {
    if (!page || !section) return;
    if (parseInt(page) === 1) return;
    const nextPage = parseInt(page) - 1;
    const nextSection = parseInt(section) - 1;

    setSearchParams(
      (prev) => {
        prev.set("page", `${nextPage}`);
        prev.set("section", `${nextSection}`);
        return prev;
      },
      { replace: true }
    );
    navigate(`/postgraduate/section${nextPage}`, { replace: false });
  };

  const [disability, setDisability] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const disabilityChangeHandler = (event: any) => {
    const disabled: string = event.target.value;
    console.log("disabled", disabled);
    setDisability(() => event.target.value);

    if (disabled === "no") setIsDisabled(() => false);
    if (disabled === "yes") setIsDisabled(() => true);
  };

  const [disabilities, setDisabilities] = useState<any>({
    chronicIllness: false,
    physicalDisability: false,
    impairment: false,
    others: false,
  });

  const disabilitiesCheckboxChangeHandler = (disability: any) => {
    setDisabilities((prevDisabilities: any) => ({
      ...prevDisabilities,
      [disability]: !prevDisabilities[disability],
    }));
  };

  return (
    <Fragment>
      <div className="relative full grid place-items-center h-auto">
        <FormLayout
          totalNumPages={6}
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
          section="section 1.2-1.4"
          footer="Employment footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/* ----- Disability  Start----- */}
            <div className="mb-8">
              <p
                className="text-gray-50 font-semibold inline-block
                bg-primaryDark px-4 py-2 rounded mb-4"
              >
                1.2: DISABILITY
              </p>

              <div className="mb-4 flex items-center justify-start gap-3">
                <label className="text-sm">Do you have any disability?</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="disabilityYes"
                    name="disability"
                    value="yes"
                    checked={disability === "yes"}
                    onChange={disabilityChangeHandler}
                    className="mr-2"
                  />
                  <label htmlFor="disabilityYes" className="mr-4">
                    Yes
                  </label>

                  <input
                    type="radio"
                    id="disabilityNo"
                    name="disability"
                    value="no"
                    checked={disability === "no"}
                    onChange={disabilityChangeHandler}
                    className="mr-2"
                  />
                  <label htmlFor="disabilityNo">No</label>
                </div>
              </div>

              {isDisabled && (
                <div className="mb-2 text-sm">
                  <div>
                    <input
                      type="checkbox"
                      id="chronicIllness"
                      checked={disabilities.chronicIllness}
                      onChange={() =>
                        disabilitiesCheckboxChangeHandler("chronicIllness")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="chronicIllness" className="mr-4">
                      Chronic Illness
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="physicalDisability"
                      checked={disabilities.physicalDisability}
                      onChange={() =>
                        disabilitiesCheckboxChangeHandler("physicalDisability")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="physicalDisability" className="mr-4">
                      Physical Disability
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="impairment"
                      checked={disabilities.impairment}
                      onChange={() =>
                        disabilitiesCheckboxChangeHandler("impairment")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="impairment" className="mr-4">
                      Impairment
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="others"
                      checked={disabilities.others}
                      onChange={() =>
                        disabilitiesCheckboxChangeHandler("others")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="others">Others</label>
                  </div>
                </div>
              )}
              {isDisabled && (
                <div
                  className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                >
                  {formik.errors.program && formik.touched.program && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.program}
                    </p>
                  )}
                  <label className="text-sm">
                    Briefly state nature of disability
                  </label>
                  <textarea
                    required
                    id="program"
                    name="program"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.program}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none h-28"
                  />
                </div>
              )}
            </div>
            {/* ----- Disability  End----- */}

            {/* ----- Applicant Contact  Start -----*/}
            <div className="my-2">
              <p
                className="text-gray-50 font-semibold inline-block
                bg-primaryDark px-4 py-2 rounded"
              >
                1.3: APPLICANT’S CONTACT
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
            </div>
            {/* ----- Applicant Contact   End----- */}

            {/* ----- Parent/Guardian  Start -----*/}
            <div className="my-2">
              <p
                className="text-gray-50 font-semibold inline-block
                bg-primaryDark px-4 py-2 rounded"
              >
                1.3: PARENTS/GUARDIANS
              </p>
            </div>

            {/* ----- Father/Legal guardian -----*/}
            <div className="mb-2 mt-4">
              <p
                className="text-gray-800 font-semibold inline-block
                bg-gray-400 px-4 py-2 rounded"
              >
                Father/Legal guardian
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
            </div>

            {/* ----- Mother/Legal guardian -----*/}
            <div className="mb-2 mt-4">
              <p
                className="text-gray-800 font-semibold inline-block
                bg-gray-400 px-4 py-2 rounded"
              >
                Mother/Legal guardian
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
            </div>
            {/* ----- Sponsor (if applicable) -----*/}
            <div className="mb-2 mt-4">
              <p
                className="text-gray-800 font-semibold inline-block
                bg-gray-400 px-4 py-2 rounded"
              >
                Sponsor (if applicable)
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
            </div>
            {/* ----- Parent/Guardian  End -----*/}

            {/* ----- Employment Record Start -----*/}
            <div className="my-2">
              <p
                className="text-gray-50 font-semibold inline-block
                bg-primaryDark px-4 py-2 rounded"
              >
                1.4: EMPLOYMENT RECORD
              </p>
            </div>

            {
              // Use a map to
            }
            <div className="my-2">
              <p
                className="text-gray-800 font-semibold inline-block
                 px-4 py-2 rounded bg-gray-400"
              >
                Employer 1
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Name and address of employer</label>
                <input
                  type="text"
                  required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">Designation</label>
                <input
                  type="text"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">From</label>
                <input
                  type="date"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.program && formik.touched.program && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.program}
                  </p>
                )}
                <label className="text-sm">To</label>
                <input
                  type="date"
                  // required
                  id="program"
                  name="program"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.program}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <button
                className="bg-gray-300 flex items-center justify-center px-4 
                 py-2 rounded mt-4 gap-4 text-primary"
              >
                <span>
                  <IconContext.Provider
                    value={{
                      size: "1rem",
                      color: "#d6336c",
                    }}
                  >
                    <FaPlus />
                  </IconContext.Provider>
                </span>
                <span>Add </span>
              </button>
            </div>
            {/* ----- Employment Record End -----*/}

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
                onClick={() => nextPageHandler()}
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
