import React, {
  Fragment,
  useEffect,
  ChangeEvent,
  useState,
  useRef,
} from "react";
import { FormLayout } from "../../layout/FormLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  showCardNotification,
  hideCardNotification,
} from "../../store/actions/notification";
import { useDispatch } from "react-redux";
import { IconContext } from "react-icons";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useSearchParams, useNavigate } from "react-router-dom";
import { transformToArrayOfObjects } from "../../utils/transformToArrayOfObject";
import {
  saveFormDataToStorage,
  getDataFromStorage,
} from "../../utils/saveFormDataToStorage";

type InitialValues = {
  reasonForCourseChoice: string;
  previousWorkExperienceSummary: string;
};

/**
 * Section1x component has section 2
 */
export const Section2: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const initialValues: InitialValues = {
    reasonForCourseChoice: "",
    previousWorkExperienceSummary: "",
  };

  const getInitialValues = (): InitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "postgraduate",
      category: "educationBackground",
    }) as InitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      reasonForCourseChoice: Yup.string()
        .max(255)
        .required("Reason for course of choice is required"),
      previousWorkExperienceSummary: Yup.string()
        .max(255)
        .required("Summary of previous work experience is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        //   Save info to storage
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
    allCategorySubmitHandler();
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

  const allCategorySubmitHandler = () => {
    try {
      educationBgSubmitHandler();
      otherQualificationSubmitHandler();
      refereeSubmitHandler();
    } catch (error: any) {
      dispatch(showCardNotification({ type: "error", message: error.message }));
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    }
  };

  //   Education background
  const effectRan = useRef(false);
  const [institutionArray, setInstitutionArray] = useState<any[]>([]);

  const buildInstitution = (index: number) => {
    const employer: any = {};
    employer[`nameAddress${index}`] = "";
    employer[`qualification${index}`] = "";
    employer[`from${index}`] = "";
    employer[`to${index}`] = "";

    return employer;
  };

  const buildInstitutionFieldValue = (fieldName: string, index: number) => {
    return `${fieldName}${index}`;
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const constructInstitutionInitialFieldCount = () => {
        if (institutionArray[0]) return;

        for (let index = 0; index < 2; index++) {
          setInstitutionArray((employers) => [
            ...employers,
            buildInstitution(index),
          ]);
        }
      };
      constructInstitutionInitialFieldCount();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const AddInstitutionHandler = () => {
    const currentMaxEmployerArrayIndex: number = institutionArray.length - 1;
    const incrementedEmployArrayIndex: number =
      currentMaxEmployerArrayIndex + 1;
    setInstitutionArray((employers) => [
      ...employers,
      buildInstitution(incrementedEmployArrayIndex),
    ]);
  };

  const removeInstitutionHandler = () => {
    const lastEmployerArrayIndex: number = institutionArray.length - 1;
    if (lastEmployerArrayIndex <= 1) return;

    const reducedEmployArray = institutionArray.filter(
      (_, index) => index !== lastEmployerArrayIndex
    );
    setInstitutionArray(() => reducedEmployArray);
  };

  const showInstitutionAddButton = (index: number) => {
    return index === institutionArray.length - 1;
  };

  const showInstitutionRemoveButton = (index: number) => {
    const canShowEmployerRemoveButton: boolean = institutionArray.length > 2;
    const isLastEmployerArrayIndex = index === institutionArray.length - 1;
    const showRemoveButton: boolean =
      canShowEmployerRemoveButton && isLastEmployerArrayIndex;

    return showRemoveButton;
  };

  const educationBgFieldsChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    fieldIndex: number,
    fieldName: string
  ) => {
    const value = event.target.value;
    const mutatedInstitutionArray: any[] = [];

    institutionArray.map((employer: any, index) => {
      if (index === fieldIndex) {
        employer[fieldName] = value;
        mutatedInstitutionArray.push(employer);
        return;
      }
      mutatedInstitutionArray.push(employer);
    });
    setInstitutionArray(() => mutatedInstitutionArray);
  };

  function educationBgSubmitHandler() {
    const firstInstituitionArray = transformToArrayOfObjects(
      institutionArray[0]
    );
    console.log("firstInstitutionArray", firstInstituitionArray);

    for (let i = 0; i < firstInstituitionArray.length; i++) {
      const key = extractItemKey(firstInstituitionArray[i]);
      console.log("education extracted key", key);

      if (firstInstituitionArray[i][key]) continue;

      throw new Error("Please fill all fields of education background");
    }

    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "educationBackground",
      data: { institutions: institutionArray },
      updateAt: new Date().toISOString(),
    });
  }

  //   Other professional qualifications
  const [otherQualificationArray, setOtherQualificationArray] = useState<any[]>(
    []
  );

  const buildOtherQualification = (index: number) => {
    const qualification: any = {};
    qualification[`OtherQualification${index}`] = "";
    qualification[`OtherQualificationDate${index}`] = "";

    return qualification;
  };

  const buildOtherQualificationFieldValue = (
    fieldName: string,
    index: number
  ) => {
    return `${fieldName}${index}`;
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const constructOtherQualificationFieldCount = () => {
        if (institutionArray[0]) return;

        for (let index = 0; index < 1; index++) {
          setOtherQualificationArray((qualifications) => [
            ...qualifications,
            buildOtherQualification(index),
          ]);
        }
      };
      constructOtherQualificationFieldCount();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const addOtherQualificationHandler = () => {
    const maxOtherQualificationArrayIndex: number =
      otherQualificationArray.length - 1;
    const incrementedOtherQualificationArrayIndex: number =
      maxOtherQualificationArrayIndex + 1;
    setOtherQualificationArray((qualifications) => [
      ...qualifications,
      buildOtherQualification(incrementedOtherQualificationArrayIndex),
    ]);
  };

  const removeOtherQualificationHandler = () => {
    const lastOtherQualificationArrayIndex: number =
      institutionArray.length - 1;
    if (lastOtherQualificationArrayIndex < 1) return;

    const reducedOtherQualificationArray = otherQualificationArray.filter(
      (_, index) => index !== lastOtherQualificationArrayIndex
    );
    setOtherQualificationArray(() => reducedOtherQualificationArray);
  };

  const showOtherQualificationAddButton = (index: number) => {
    return index === otherQualificationArray.length - 1;
  };

  const showOtherQualificationRemoveButton = (index: number) => {
    const canShowQualificationRemoveButton: boolean =
      otherQualificationArray.length >= 2;
    const isLastQualificationArrayIndex =
      index === otherQualificationArray.length - 1;
    const showRemoveButton: boolean =
      canShowQualificationRemoveButton && isLastQualificationArrayIndex;

    return showRemoveButton;
  };

  const otherQualificationFieldsChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    fieldIndex: number,
    fieldName: string
  ) => {
    const value = event.target.value;
    const mutatedQualificationArray: any[] = [];

    otherQualificationArray.map((qualification: any, index) => {
      if (index === fieldIndex) {
        qualification[fieldName] = value;
        mutatedQualificationArray.push(qualification);
        return;
      }
      mutatedQualificationArray.push(qualification);
    });
    setOtherQualificationArray(() => mutatedQualificationArray);
  };

  function otherQualificationSubmitHandler() {
    const firstQualificationArray = transformToArrayOfObjects(
      otherQualificationArray[0]
    );
    console.log("firstQualificationArray", firstQualificationArray);

    for (let i = 0; i < firstQualificationArray.length; i++) {
      const key = extractItemKey(firstQualificationArray[i]);
      console.log("Qualification extracted key", key);

      if (firstQualificationArray[i][key]) continue;
      // throw new Error("Please fill other qualifications if any");
    }

    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "otherQualification",
      data: { otherQualification: otherQualificationArray },
      updateAt: new Date().toISOString(),
    });
  }

  //  Academic referee
  const [refereeArray, setRefereeArray] = useState<any[]>([]);

  const buildReferee = (index: number) => {
    const referee: any = {};
    referee[`name${index}`] = "";
    referee[`POBox${index}`] = "";
    referee[`town${index}`] = "";
    referee[`country${index}`] = "";
    referee[`telephone${index}`] = "";
    referee[`email${index}`] = "";

    return referee;
  };

  const buildRefereeFieldValue = (fieldName: string, index: number) => {
    return `${fieldName}${index}`;
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const constructRefereeFieldCount = () => {
        if (refereeArray[0]) return;

        for (let index = 0; index < 2; index++) {
          setRefereeArray((qualifications) => [
            ...qualifications,
            buildReferee(index),
          ]);
        }
      };
      constructRefereeFieldCount();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const refereeChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    fieldIndex: number,
    fieldName: string
  ) => {
    const value = event.target.value;
    const mutatedRefereeArray: any[] = [];

    refereeArray.map((referee: any, index) => {
      if (index === fieldIndex) {
        referee[fieldName] = value;
        mutatedRefereeArray.push(referee);
        return;
      }
      mutatedRefereeArray.push(referee);
    });
    setRefereeArray(() => mutatedRefereeArray);
  };

  function refereeSubmitHandler() {
    for (let j = 0; j < refereeArray.length; j++) {
      const singleRefereeArray = transformToArrayOfObjects(refereeArray[j]);
      console.log("singleRefereeArray", singleRefereeArray);

      for (let i = 0; i < singleRefereeArray.length; i++) {
        const key = extractItemKey(singleRefereeArray[i]);
        console.log("singleRefereeArray extracted key", key);

        if (singleRefereeArray[i][key]) continue;
        throw new Error("Please fill all fields of referees");
      }
    }

    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "referee",
      data: { referee: refereeArray },
      updateAt: new Date().toISOString(),
    });
  }

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
          section="section 2"
          footer="Employment footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/* ----- Education Background Start -----*/}
            <div className="my-2">
              <p
                className="text-gray-50 font-semibold inline-block
                  bg-primaryDark px-4 py-2 rounded"
              >
                SECTION 2: EDUCATION BACKGROUND
              </p>
            </div>

            <div className="my-2">
              <p className="text-gray-800 inline-block py-2 rounded">
                2.0 Secondary Schools, Colleges and Universities attended (Give
                names dates, qualifications and grades )
              </p>
            </div>
            {institutionArray.map((institution, index) => (
              <div key={index}>
                <div className="my-2">
                  <p
                    className="text-gray-800 font-semibold inline-block
                         px-4 py-2 rounded bg-gray-400"
                  >
                    Institution {index + 1}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">
                      Name and address of School/Institution
                    </label>
                    <input
                      type="text"
                      required
                      id={`${institution["nameAddress"]}${index}`}
                      name={`${institution["nameAddress"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("nameAddress", index)
                        )
                      }
                      value={
                        institution[
                          buildInstitutionFieldValue("nameAddress", index)
                        ]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">Qualification</label>
                    <input
                      type="text"
                      id={`${institution["qualification"]}${index}`}
                      name={`${institution["qualification"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("qualification", index)
                        )
                      }
                      value={
                        institution[
                          buildInstitutionFieldValue("qualification", index)
                        ]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">From</label>
                    <input
                      type="date"
                      id={`${institution["from"]}${index}`}
                      name={`${institution["from"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("from", index)
                        )
                      }
                      value={
                        institution[buildInstitutionFieldValue("from", index)]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">To</label>
                    <input
                      type="date"
                      id={institution["to"]}
                      name={`${institution["to"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("to", index)
                        )
                      }
                      value={
                        institution[buildInstitutionFieldValue("to", index)]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    {showInstitutionAddButton(index) && (
                      <button
                        className="bg-gray-300 flex items-center justify-center px-4 
                         py-2 rounded mt-4 gap-4 text-primary w-full"
                        onClick={() => AddInstitutionHandler()}
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
                    )}
                    {showInstitutionRemoveButton(index) && (
                      <button
                        className="bg-gray-300 flex items-center justify-center px-4 
                          py-2 rounded mt-4 gap-4 text-primary w-full"
                        onClick={() => removeInstitutionHandler()}
                      >
                        <span>
                          <IconContext.Provider
                            value={{
                              size: "1rem",
                              color: "#d6336c",
                            }}
                          >
                            <FaMinus />
                          </IconContext.Provider>
                        </span>
                        <span>Remove </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* ----- Education Background End -----*/}

            {/* ----- Other Professional qualifications Start -----*/}
            <div className="my-2">
              <p className="text-gray-800 inline-block py-2 rounded">
                2.1. Other professional qualifications (with dates)
              </p>
            </div>
            {otherQualificationArray.map((qualification, index) => (
              <div key={index}>
                <div className="my-2">
                  <p
                    className="text-gray-800 font-semibold inline-block
                         px-4 py-2 rounded bg-gray-400"
                  >
                    Qualification {index + 1}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">Qualification</label>
                    <input
                      type="text"
                      id={`${qualification["otherQualification"]}${index}`}
                      name={`${qualification["otherQualification"]}${index}`}
                      onChange={(event) =>
                        otherQualificationFieldsChangeHandler(
                          event,
                          index,
                          buildOtherQualificationFieldValue(
                            "otherQualification",
                            index
                          )
                        )
                      }
                      value={
                        qualification[
                          buildOtherQualificationFieldValue(
                            "otherQualification",
                            index
                          )
                        ]
                      }
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
                      type="date"
                      id={`${qualification["otherQualificationDate"]}${index}`}
                      name={`${qualification["otherQualificationDate"]}${index}`}
                      onChange={(event) =>
                        otherQualificationFieldsChangeHandler(
                          event,
                          index,
                          buildOtherQualificationFieldValue(
                            "otherQualificationDate",
                            index
                          )
                        )
                      }
                      value={
                        qualification[
                          buildOtherQualificationFieldValue(
                            "otherQualificationDate",
                            index
                          )
                        ]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    {showOtherQualificationAddButton(index) && (
                      <button
                        className="bg-gray-300 flex items-center justify-center px-4 
                         py-2 rounded mt-4 gap-4 text-primary w-full"
                        onClick={() => addOtherQualificationHandler()}
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
                    )}
                    {showOtherQualificationRemoveButton(index) && (
                      <button
                        className="bg-gray-300 flex items-center justify-center px-4 
                          py-2 rounded mt-4 gap-4 text-primary w-full"
                        onClick={() => removeOtherQualificationHandler()}
                      >
                        <span>
                          <IconContext.Provider
                            value={{
                              size: "1rem",
                              color: "#d6336c",
                            }}
                          >
                            <FaMinus />
                          </IconContext.Provider>
                        </span>
                        <span>Remove </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* ----- Other Professional qualifications End -----*/}

            {/*----- Reason for choosing course & Previous work experience start -----*/}
            <div className="my-2">
              <p className="text-gray-800 inline-block py-2 rounded">
                2.2. Kindly use a separate sheet of paper and write a one page
                support letter stating in particular:
              </p>
            </div>
            <div
              className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
            >
              {formik.errors.reasonForCourseChoice &&
                formik.touched.reasonForCourseChoice && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.reasonForCourseChoice}
                  </p>
                )}
              <label className="text-sm">
                a. Your reasons for selecting this course.
              </label>
              <textarea
                required
                id="reasonForCourseChoice"
                name="reasonForCourseChoice"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.reasonForCourseChoice}
                className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none h-28"
              />
            </div>
            <div
              className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
            >
              {formik.errors.previousWorkExperienceSummary &&
                formik.touched.previousWorkExperienceSummary && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.previousWorkExperienceSummary}
                  </p>
                )}
              <label className="text-sm">
                b. A brief summary of your previous work experience.
              </label>
              <textarea
                required
                id="previousWorkExperienceSummary"
                name="previousWorkExperienceSummary"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.previousWorkExperienceSummary}
                className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none h-28"
              />
            </div>
            {/*----- Reason for choosing course & Previous work experience End -----*/}

            {/* ----- Referee Start -----*/}
            <div className="my-2">
              <p className="text-gray-800 inline-block py-2 rounded">
                2.3. Names and address of two referees who are familiar with
                your academic ability and performance.
              </p>
            </div>
            {refereeArray.map((referee, index) => (
              <div key={index}>
                <div className="my-2">
                  <p
                    className="text-gray-800 font-semibold inline-block
                         px-4 py-2 rounded bg-gray-400"
                  >
                    Referee {index + 1}
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
                      required
                      id={`${referee["name"]}${index}`}
                      name={`${referee["name"]}${index}`}
                      onChange={(event) =>
                        refereeChangeHandler(
                          event,
                          index,
                          buildRefereeFieldValue("name", index)
                        )
                      }
                      value={referee[buildRefereeFieldValue("name", index)]}
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">P.O Box</label>
                    <input
                      type="text"
                      id={`${referee["POBox"]}${index}`}
                      name={`${referee["POBox"]}${index}`}
                      onChange={(event) =>
                        refereeChangeHandler(
                          event,
                          index,
                          buildRefereeFieldValue("POBox", index)
                        )
                      }
                      value={referee[buildRefereeFieldValue("POBox", index)]}
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                     justify-center gap-1"
                  >
                    <label className="text-sm">Town</label>
                    <input
                      type="text"
                      id={`${referee["town"]}${index}`}
                      name={`${referee["town"]}${index}`}
                      onChange={(event) =>
                        refereeChangeHandler(
                          event,
                          index,
                          buildRefereeFieldValue("town", index)
                        )
                      }
                      value={referee[buildRefereeFieldValue("town", index)]}
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">Country</label>
                    <input
                      type="text"
                      id={`${referee["country"]}${index}`}
                      name={`${referee["country"]}${index}`}
                      onChange={(event) =>
                        refereeChangeHandler(
                          event,
                          index,
                          buildRefereeFieldValue("country", index)
                        )
                      }
                      value={referee[buildRefereeFieldValue("country", index)]}
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">Telephone</label>
                    <input
                      type="text"
                      id={`${referee["telephone"]}${index}`}
                      name={`${referee["telephone"]}${index}`}
                      onChange={(event) =>
                        refereeChangeHandler(
                          event,
                          index,
                          buildRefereeFieldValue("telephone", index)
                        )
                      }
                      value={
                        referee[buildRefereeFieldValue("telephone", index)]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                        justify-center gap-1"
                  >
                    <label className="text-sm">Email</label>
                    <input
                      type="email"
                      id={`${referee["email"]}${index}`}
                      name={`${referee["email"]}${index}`}
                      onChange={(event) =>
                        refereeChangeHandler(
                          event,
                          index,
                          buildRefereeFieldValue("email", index)
                        )
                      }
                      value={referee[buildRefereeFieldValue("email", index)]}
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {/* ----- Referee End -----*/}

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
