import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  ChangeEvent,
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
import { useSearchParams } from "react-router-dom";
import { transformToArrayOfObjects } from "../../utils/transformToArrayOfObject";
import {
  saveFormDataToStorage,
  getDataFromStorage,
} from "../../utils/saveFormDataToStorage";
import { useProgress } from "../../hooks/useProgress";

type TInitialValues = {
  //   campus: string;
  //   faculty: string;
  //   department: string;
  //   currentPosition: string;
  //   promotionPosition: string;
  //   contractExpiryDate: string;
};

export const Section4: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 2,
    section: "2",
    nextPageURL: "/promotion/section3",
    prevPageURL: "/promotion/section1",
  });

  const initialValues: TInitialValues = {
    // campus: "",
    // faculty: "",
    // department: "",
    // currentPosition: "",
    // promotionPosition: "",
    // contractExpiryDate: "",
  };

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "education",
    }) as TInitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({}),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // Save Education background info
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

    // // Validate for empty field values
    // if (
    //   !formik.values.campus ||
    //   !formik.values.faculty ||
    //   !formik.values.department ||
    //   !formik.values.currentPosition ||
    //   !formik.values.promotionPosition ||
    //   !formik.values.contractExpiryDate
    // ) {
    //   dispatch(
    //     showCardNotification({
    //       type: "error",
    //       message: "Please check form for errors",
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
    allCategorySubmitHandler();
    nextPageHandler();
  };

  function allCategorySubmitHandler() {
    educationBgSubmitHandler();
  }

  // Education background
  const effectRan = useRef(false);
  const [institutionArray, setInstitutionArray] = useState<any[]>([]);

  const buildInstitution = (index: number) => {
    const instituition: any = {};
    instituition[`${index}`] = "";
    instituition[`instituitionName${index}`] = "";
    instituition[`from${index}`] = "";
    instituition[`to${index}`] = "";
    instituition[`reward${index}`] = "";
    instituition[`rewardDate${index}`] = "";
    instituition[`mainSubject${index}`] = "";

    return instituition;
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

    institutionArray.map((employer: any, index: number) => {
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

      throw new Error("Please fill all fields of education");
    }

    saveFormDataToStorage({
      applicationForm: "promotion",
      category: "education",
      data: { institutions: institutionArray },
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
          section="section 4"
          footer="Promotion footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/*-----Education fields Start -----*/}
            <div className="mb-4 mt-8">
              <p
                className="text-gray-50 font-semibold inline-block
               bg-primaryDark px-4 py-2 rounded"
              >
                EDUCATION
              </p>
            </div>
            <div className="mb-4 mt-8">
              <p
                className="text-gray-800 inline-block
                rounded bg-gray-400 p-4"
              >
                Give full details in chronological order of the educational
                institutions you have attended, including apprenticeship and
                technical training and other specialized courses. Give the exact
                name of institution and title of degrees, diplomas, etc.
              </p>
            </div>
            {/*----- Instituition Start -----*/}
            {institutionArray.map((institution, index) => (
              <div key={index}>
                <div className="mb-4 mt-8">
                  <p
                    className="text-gray-800 inline-block
                rounded bg-gray-400 px-4 py-2 font-semibold"
                  >
                    Instituition {index + 1}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                  >
                    {/* {formik.errors.faculty && formik.touched.faculty && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.faculty}
                      </p>
                    )} */}
                    <label htmlFor="intake" className="text-sm">
                      Name of instituition
                    </label>
                    <input
                      type="text"
                      id={`${institution["instituitionName"]}${index}`}
                      name={`${institution["instituitionName"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("instituitionName", index)
                        )
                      }
                      value={
                        institution[
                          buildInstitutionFieldValue("instituitionName", index)
                        ]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div
                      className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1 w-full"
                    >
                      {/* {formik.errors.faculty && formik.touched.faculty && (
                        <p className="absolute top-0 left-0 text-sm text-red-600">
                          {formik.errors.faculty}
                        </p>
                      )} */}
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
                       justify-center gap-1 w-full"
                    >
                      {/* {formik.errors.department &&
                        formik.touched.department && (
                          <p className="absolute top-0 left-0 text-sm text-red-600">
                            {formik.errors.department}
                          </p>
                        )} */}
                      <label className="text-sm">To</label>
                      <input
                        type="date"
                        id={`${institution["to"]}${index}`}
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
                  </div>
                </div>

                {/*----- Instituition End -----*/}

                {/*----- Rewards Start -----*/}
                <div className="mb-2 mt-8">
                  <p
                    className="text-gray-800 inline-block
                      rounded bg-gray-400 p-4"
                  >
                    Certificates, diplomas or degrees and academic distinctions
                    and date obtained
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-2">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                  >
                    {/* {formik.errors.contractExpiryDate &&
                      formik.touched.contractExpiryDate && (
                        <p className="absolute top-0 left-0 text-sm text-red-600">
                          {formik.errors.contractExpiryDate}
                        </p>
                      )} */}
                    <label className="text-sm">Reward</label>
                    <input
                      type="text"
                      id={`${institution["reward"]}${index}`}
                      name={`${institution["reward"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("reward", index)
                        )
                      }
                      value={
                        institution[buildInstitutionFieldValue("reward", index)]
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
                    {/* {formik.errors.currentPosition &&
                      formik.touched.currentPosition && (
                        <p className="absolute top-0 left-0 text-sm text-red-600">
                          {formik.errors.currentPosition}
                        </p>
                      )} */}
                    <label className="text-sm">Date</label>
                    <input
                      type="date"
                      id={`${institution["rewardDate"]}${index}`}
                      name={`${institution["rewardDate"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("rewardDate", index)
                        )
                      }
                      value={
                        institution[
                          buildInstitutionFieldValue("rewardDate", index)
                        ]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                </div>
                {/*----- Rewards End -----*/}

                {/*----- Main subject start -----*/}
                <div className="grid grid-cols-1 gap-4">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
                  >
                    {/* {formik.errors.promotionPosition &&
                      formik.touched.promotionPosition && (
                        <p className="absolute top-0 left-0 text-sm text-red-600">
                          {formik.errors.promotionPosition}
                        </p>
                      )} */}
                    <label className="text-sm">Main subjects</label>
                    <input
                      type="text"
                      id={`${institution["mainSubject"]}${index}`}
                      name={`${institution["mainSubject"]}${index}`}
                      onChange={(event) =>
                        educationBgFieldsChangeHandler(
                          event,
                          index,
                          buildInstitutionFieldValue("mainSubject", index)
                        )
                      }
                      value={
                        institution[
                          buildInstitutionFieldValue("mainSubject", index)
                        ]
                      }
                      className="p-2 outline-none rounded border-[2px]
                          border-gray-500 focus:border-[2px] focus:border-primaryLight
                          transition-all text-sm w-full resize-none"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
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
                </div>
              </div>
            ))}
            {/*----- Main subject end -----*/}

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
