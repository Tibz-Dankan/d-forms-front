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

export const Section1: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const formik = useFormik({
    initialValues: {
      announcementNumber: "",
      positionTitle: "",
      lastName: "",
      firstName: "",
      otherName: "",
      address: "",
      email: "",
      telephoneNumber: "",
      doesRelativeWorkInEmbassy: "",
      relativeName: "",
      relativeWorkSection: "",
      hasValidDriverLicense: "",
    },
    validationSchema: Yup.object({
      announcementNumber: Yup.string()
        .max(255)
        .required("Announcement number is required"),
      positionTitle: Yup.string()
        .max(255)
        .required("Position title is required"),
      lastName: Yup.string().max(255).required("Last name is required"),
      firstName: Yup.string().max(255).required("First name is required"),
      otherName: Yup.string().max(255).required("Other name is required"),
      address: Yup.string().max(255).required("Address is required"),
      email: Yup.string().max(255).required("Email is required"),
      telephoneNumber: Yup.string()
        .max(255)
        .required("Telephone number is required"),
      // doesRelativeWorkInEmbassy: Yup.string()
      //   .max(255)
      //   .required("Relative embassy status is required"),
      // relativeWorkSection: Yup.string().max(255).required("Last name is required"),
      // relativeName: Yup.string().max(255).required("Last name is required"),
      // hasValidDriverLicense: Yup.string()
      //   .max(255)
      //   .required("Driver License status is required"),
    }),
    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // dispatch form values to the global store
        // TODO: local storage to persist data (later)
      } catch (err: any) {
        helpers.setStatus({ success: false });
        // helpers.setErrors({ submit: err.message });
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
    delete formik.errors?.doesRelativeWorkInEmbassy;
    delete formik.errors?.relativeName;
    delete formik.errors?.relativeWorkSection;
    delete formik.errors?.hasValidDriverLicense;

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
      !formik.values.announcementNumber ||
      !formik.values.positionTitle ||
      !formik.values.lastName ||
      !formik.values.firstName ||
      !formik.values.otherName ||
      !formik.values.address ||
      !formik.values.email ||
      !formik.values.telephoneNumber
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
    navigate(`/employment/section${nextPage}`, { replace: false });
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
    navigate(`/employment/section${nextPage}`, { replace: false });
  };

  return (
    <Fragment>
      <div className="relative full grid place-items-center h-auto">
        <FormLayout
          totalNumPages={6}
          header={
            "EMPLOYMENT APPLICATION FOR LOCALLY EMPLOYED STAFF OR FAMILY MEMBER"
          }
          section="section 1"
          footer="Employment footer"
        >
          <form className="w-full">
            {/* Position */}
            <div className="bg-gray-400 px-4 py-1 rounded mb-4">
              <p className="text-gray-800 font-semibold text-lgs uppercase">
                Position
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.announcementNumber &&
                  formik.touched.announcementNumber && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.announcementNumber}
                    </p>
                  )}
                <label className="text-sm">Vacancy Announcement Number</label>
                <input
                  type="text"
                  required
                  id="announcementNumber"
                  name="announcementNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.announcementNumber}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.positionTitle &&
                  formik.touched.positionTitle && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.positionTitle}
                    </p>
                  )}
                <label className="text-sm">Position Title</label>
                <input
                  type="text"
                  required
                  id="positionTitle"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.positionTitle}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
            </div>
            {/* Personal information */}
            <div className="bg-gray-400 px-4 py-1 rounded mb-4 mt-8">
              <p className="text-gray-800 font-semibold text-lgs uppercase">
                SECTION 1: PERSONAL INFORMATION TO BE COMPLETED BY ALL
                APPLICANTS
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.lastName && formik.touched.lastName && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.lastName}
                  </p>
                )}
                <label className="text-sm">Last Name</label>
                <input
                  type="text"
                  required
                  id="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.firstName && formik.touched.firstName && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.firstName}
                  </p>
                )}
                <label className="text-sm">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.otherName && formik.touched.otherName && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.otherName}
                  </p>
                )}
                <label className="text-sm">Other Name</label>
                <input
                  type="text"
                  required
                  id="otherName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.otherName}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.address && formik.touched.address && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.address}
                  </p>
                )}
                <label className="text-sm">Address</label>
                <input
                  type="text"
                  required
                  id="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
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
                <label className="text-sm">Email</label>
                <input
                  type="text"
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
                {formik.errors.telephoneNumber &&
                  formik.touched.telephoneNumber && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.telephoneNumber}
                    </p>
                  )}
                <label className="text-sm">Telephone Number</label>
                <input
                  type="text"
                  required
                  id="telephoneNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.telephoneNumber}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                />
              </div>

              {/* ---- Applicants relative start ----- */}
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.doesRelativeWorkInEmbassy &&
                  formik.touched.doesRelativeWorkInEmbassy && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.doesRelativeWorkInEmbassy}
                    </p>
                  )}
                {/* <label className="text-sm">
                  Does your relative work in this Embassy or Consulate? If yes,
                  tell us their name and the section where they work.{" "}
                </label>
                <input
                  type="radio"
                  required
                  id="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                /> */}
                <div
                  className="relative pt-4 flex items-center 
                 justify-center gap-1"
                >
                  <label className="inline-flex items-center text-sm">
                    Does your relative work in this Embassy or Consulate? If
                    yes, tell us their name and the section where they work
                  </label>
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      className="form-radio"
                      name="does-relative-work-in-embassy"
                      value={"yes"}
                      id="yes"
                      // onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      // onChange={handleOptionChange}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="does-relative-work-in-embassy"
                      value="no"
                      id="no"
                      // onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      // checked={formik.values.doesRelativeWorkInEmbassy === "no"}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {formik.values.doesRelativeWorkInEmbassy === "yes" && (
                <div
                  className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                >
                  {formik.errors.relativeName &&
                    formik.touched.relativeName && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.relativeName}
                      </p>
                    )}
                  <label className="text-sm">Relative Name</label>
                  <input
                    type="text"
                    required
                    id="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.relativeName}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
              )}
              {formik.values.doesRelativeWorkInEmbassy === "yes" && (
                <div
                  className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                >
                  {formik.errors.relativeWorkSection &&
                    formik.touched.relativeWorkSection && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.relativeWorkSection}
                      </p>
                    )}
                  <label className="text-sm">Relative Work section</label>
                  <input
                    type="text"
                    required
                    id="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.relativeWorkSection}
                    className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full"
                  />
                </div>
              )}
              {/* ---- Applicants relative end ----- */}
            </div>
            {/* Does your relative work in this Embassy or Consulate? If yes, tell us their name and the section where they work. */}
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
          </form>
        </FormLayout>
      </div>
    </Fragment>
  );
};
