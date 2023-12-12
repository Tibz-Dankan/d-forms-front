import React, { Fragment, useEffect } from "react";
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
import { useSearchParams, useNavigate } from "react-router-dom";
import { transformToArrayOfObjects } from "../../utils/transformToArrayOfObject";
import {
  saveFormDataToStorage,
  getDataFromStorage,
} from "../../utils/saveFormDataToStorage";
import { Select, Option } from "@material-tailwind/react";

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

export const Section1: React.FC = () => {
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
      //   !formik.values.maritalStatus
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

    // // Dynamically validate empty values
    // const values: any[] = transformToArrayOfObjects(formik.values);

    // values?.map((item) => {
    //   const key = extractItemKey(item);
    //   console.log("key", key);
    //   if (!item[key]) {
    //     dispatch(
    //       showCardNotification({
    //         type: "error",
    //         message: "Check form for errors",
    //       })
    //     );
    //     setTimeout(() => {
    //       dispatch(hideCardNotification());
    //     }, 5000);
    //     hasError = true;
    //   }
    // });

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
    navigate(`/postgraduate/section1x`, { replace: false });
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

  const onIntakeChangeHandler = (selectedDate: any) => {
    console.log("selectedDate", selectedDate);
    if (!selectedDate) return;
    formik.values.intake = selectedDate;
  };

  const onCampusChangeHandler = (selectedCampus: any) => {
    console.log("selectedCampus", selectedCampus);
    if (!selectedCampus) return;
    formik.values.campus = selectedCampus;
  };

  const onTitleChangeHandler = (selectedTitle: any) => {
    console.log("selectedTitle", selectedTitle);
    if (!selectedTitle) return;
    formik.values.title = selectedTitle;
  };

  const onGenderChangeHandler = (selectedGender: any) => {
    console.log("selectedCampus", selectedGender);
    if (!selectedGender) return;
    formik.values.gender = selectedGender;
  };

  const onMaritalStatusChangeHandler = (selectedStatus: any) => {
    console.log("selectedStatus", selectedStatus);
    if (!selectedStatus) return;
    formik.values.maritalStatus = selectedStatus;
  };

  const intake = ["January", "May", "September"];
  const campuses = [
    "Main Campus (Mukono)",
    "Bishop Barham University College (Kabale)",
    "Mbale Campus",
    "Kampala Campus",
    "Arua Campus",
  ];

  const genders = ["Female", "Male"];
  const applicantTitles = ["Rev.", "Dr.", "Mr.", " Miss", "Mrs."];
  const maritalStatus = [
    "Single",
    "Married (attach marriage certificate)",
    // "Others specify",
    // "Marital status",
    // "Type of marriage",
    // "Name of spouse",
    // "Number of children",
  ];

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
          section="section 1"
          footer="Employment footer"
        >
          {/*----- Notice Start ----- */}
          <div className="text-sm italic space-y-2 mb-16">
            <p>
              <span className="font-bold not-italic">NOTE:</span>
              <span>
                Transcript copies of both ‘0’ level and ‘A’ level result
                slips/Certificate, other qualifications, Curriculum Vitae, and
                birth certificate should be attached to this form.
              </span>
            </p>
            <p>
              All academic records in a language other than English must be
              accompanied by a certified English translation. At registration,
              originals shall be required.
            </p>
            <p>
              Initially the selection letter for admission for those who qualify
              is provisional. It does not give the applicant an entitlement to a
              place at the University. It is subject to confirmation according
              to the instructions set in it.
            </p>
          </div>
          {/*----- Notice End ----- */}

          {/*------ Capital letter notice Start ----- */}
          <div>
            <p
              className="bg-primaryDark text-gray-50 inline-block 
              font-bold px-4 py-2 rounded mb-8"
            >
              PLEASE FILL THIS IN CAPITAL LETTERS
            </p>
          </div>
          {/*------ Capital letter notice End ----- */}

          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/*----- Intake Start ----  */}
            <div className="w-full space-y-1">
              <label htmlFor="intake" className="text-sm">
                CHOICE OF INTAKE: (Indicate if January, May, September Intake)
              </label>
              <Select
                onChange={(event) => onIntakeChangeHandler(event)}
                label=""
                className="border-[2px] border-gray-500 focus:border-primaryLight
                focus:border-t-primaryLight"
                aria-required
              >
                {intake.map((month, index) => (
                  <Option key={index} value={month}>
                    <span className="first-letter:uppercase">{month}</span>
                  </Option>
                ))}
              </Select>
            </div>
            {/*----- Intake End ----  */}

            {/*----- Program being applied for Start ----- */}
            <div className="mb-4 mt-8">
              <p
                className="text-gray-50 font-semibold inline-block
               bg-primaryDark px-4 py-2 rounded"
              >
                SECTION 1:
              </p>
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
                  1.0 Programme being applied for
                </label>
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
                  transition-all text-sm w-full"
                />
              </div>
            </div>

            {/*----- Choice of Campus/College start -----  */}
            <div className="w-full space-y-1">
              <label htmlFor="intake" className="text-sm">
                1.0.1 Choice of Campus/College
              </label>
              <Select
                onChange={(event) => onCampusChangeHandler(event)}
                label=""
                className="border-[2px] border-gray-500 focus:border-primaryLight
                focus:border-t-primaryLight"
                aria-required
              >
                {campuses.map((campus, index) => (
                  <Option key={index} value={campus}>
                    <span className="first-letter:uppercase">{campus}</span>
                  </Option>
                ))}
              </Select>
            </div>
            {/*----- Choice of Campus/College End -----  */}

            {/*----- Personal Information Start -----*/}
            <div className="mb-4 mt-8">
              <p
                className="text-gray-50 font-semibold inline-block
               bg-primaryDark px-4 py-2 rounded"
              >
                1.1: APPLICANT’S PERSONAL INFORMATION
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.givenname && formik.touched.givenname && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.givenname}
                  </p>
                )}
                <label className="text-sm">
                  Given name (use name on academic documents)
                </label>
                <input
                  type="text"
                  required
                  id="givenname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.givenname}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.surname && formik.touched.surname && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.surname}
                  </p>
                )}
                <label className="text-sm">Surname</label>
                <input
                  type="text"
                  id="surname"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.surname}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.othername && formik.touched.othername && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.othername}
                  </p>
                )}
                <label className="text-sm">Other name</label>
                <input
                  type="text"
                  required
                  id="othername"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.othername}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.title && formik.touched.title && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.title}
                  </p>
                )}
                <label className="text-sm">Title</label>
                <Select
                  onChange={(event) => onTitleChangeHandler(event)}
                  label=""
                  className="border-[2px] border-gray-500 focus:border-primaryLight
                focus:border-t-primaryLight"
                  aria-required
                >
                  {applicantTitles.map((title, index) => (
                    <Option key={index} value={title}>
                      <span>{title}</span>
                    </Option>
                  ))}
                </Select>
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.gender && formik.touched.gender && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.gender}
                  </p>
                )}
                <label className="text-sm">Gender</label>
                <Select
                  onChange={(event) => onGenderChangeHandler(event)}
                  label=""
                  className="border-[2px] border-gray-500 focus:border-primaryLight
                focus:border-t-primaryLight"
                  aria-required
                  defaultValue="Gender"
                >
                  {genders.map((title, index) => (
                    <Option key={index} value={title}>
                      <span>{title}</span>
                    </Option>
                  ))}
                </Select>
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
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.countyOfResidence &&
                  formik.touched.countyOfResidence && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.countyOfResidence}
                    </p>
                  )}
                <label className="text-sm">Country of Residence</label>
                <input
                  type="text"
                  required
                  id="countyOfResidence"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.countyOfResidence}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.homeDistrict && formik.touched.homeDistrict && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.homeDistrict}
                  </p>
                )}
                <label className="text-sm">Home district</label>
                <input
                  type="text"
                  required
                  id="homeDistrict"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.homeDistrict}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.homeDiocese && formik.touched.homeDiocese && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.homeDiocese}
                  </p>
                )}
                <label className="text-sm">Home diocese</label>
                <input
                  type="text"
                  required
                  id="homeDiocese"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.homeDiocese}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.religiousAffiliation &&
                  formik.touched.religiousAffiliation && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.religiousAffiliation}
                    </p>
                  )}
                <label className="text-sm">
                  {/* Religious affiliation (if Christian, state denomination) */}
                  Religious affiliation
                </label>
                <input
                  type="text"
                  required
                  id="religiousAffiliation"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.religiousAffiliation}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.maritalStatus &&
                  formik.touched.maritalStatus && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {/* {formik.errors.maritalStatus} */}
                    </p>
                  )}
                <label className="text-sm">Marital status</label>
                <Select
                  onChange={(event) => onMaritalStatusChangeHandler(event)}
                  label=""
                  className="border-[2px] border-gray-500 focus:border-primaryLight
                focus:border-t-primaryLight"
                  aria-required
                  defaultValue="Marital status"
                >
                  {maritalStatus.map((status, index) => (
                    <Option key={index} value={status}>
                      <span>{status}</span>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {/*----- Personal Information End -----*/}

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
