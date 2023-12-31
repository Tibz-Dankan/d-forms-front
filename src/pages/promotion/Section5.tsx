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

type TInitialValues = {};

export const Section5: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 5,
    section: "5",
    nextPageURL: "/promotion/section6",
    prevPageURL: "/promotion/section4",
  });

  const initialValues: TInitialValues = {};

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "professionalBody",
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

    return hasError;
  };

  const page = searchParams.get("page");

  const moveToNextPageHandler = () => {
    if (formHasErrors()) return;
    allCategorySubmitHandler();
    nextPageHandler();
  };

  function allCategorySubmitHandler() {
    professionalBodySubmitHandler();
  }

  // Education background
  const effectRan = useRef(false);
  const [professionalBodyArray, setProfessionalBodyArray] = useState<any[]>([]);

  const buildProfessionalBody = (index: number) => {
    const professionalBody: any = {};
    professionalBody[`body${index}`] = "";

    return professionalBody;
  };

  const buildProfessionalFieldValue = (fieldName: string, index: number) => {
    return `${fieldName}${index}`;
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const constructProfessionalBodyFieldCount = () => {
        if (professionalBodyArray[0]) return;

        for (let index = 0; index < 2; index++) {
          setProfessionalBodyArray((employers) => [
            ...employers,
            buildProfessionalBody(index),
          ]);
        }
      };
      constructProfessionalBodyFieldCount();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const AddProfessionalBodyHandler = () => {
    const currentMaxBodyArrayIndex: number = professionalBodyArray.length - 1;
    const incrementedBodyArrayIndex: number = currentMaxBodyArrayIndex + 1;
    setProfessionalBodyArray((bodies) => [
      ...bodies,
      buildProfessionalBody(incrementedBodyArrayIndex),
    ]);
  };

  const removeProfessionalBodyHandler = () => {
    const lastBodyIndex: number = professionalBodyArray.length - 1;
    if (lastBodyIndex <= 1) return;

    const reducedBodyArray = professionalBodyArray.filter(
      (_, index) => index !== lastBodyIndex
    );
    setProfessionalBodyArray(() => reducedBodyArray);
  };

  const showBodyAddButton = (index: number) => {
    return index === professionalBodyArray.length - 1;
  };

  const showBodyRemoveButton = (index: number) => {
    const canShowBodyRemoveButton: boolean = professionalBodyArray.length > 2;
    const isLastBodyArrayIndex = index === professionalBodyArray.length - 1;
    const showRemoveButton: boolean =
      canShowBodyRemoveButton && isLastBodyArrayIndex;

    return showRemoveButton;
  };

  const professionalBodyFieldsChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    fieldIndex: number,
    fieldName: string
  ) => {
    const value = event.target.value;
    const mutatedInstitutionArray: any[] = [];

    professionalBodyArray.map((employer: any, index: number) => {
      if (index === fieldIndex) {
        employer[fieldName] = value;
        mutatedInstitutionArray.push(employer);
        return;
      }
      mutatedInstitutionArray.push(employer);
    });
    setProfessionalBodyArray(() => mutatedInstitutionArray);
  };

  function professionalBodySubmitHandler() {
    const profBodyArray = transformToArrayOfObjects(professionalBodyArray[0]);
    console.log("firstInstitutionArray", profBodyArray);

    for (let i = 0; i < profBodyArray.length; i++) {
      const key = extractItemKey(profBodyArray[i]);
      console.log("education extracted key", key);

      if (profBodyArray[i][key]) continue;

      throw new Error("Please fill all fields of education");
    }

    saveFormDataToStorage({
      applicationForm: "promotion",
      category: "professionalBody",
      data: { institutions: professionalBodyArray },
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
          section="section 5"
          footer="Promotion footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/*-----Education fields Start -----*/}
            <div className="mb-4 mt-8">
              <p
                className="text-gray-50 font-semibold inline-block
                 bg-primaryDark px-4 py-2 rounded uppercase"
              >
                Membership in professional bodies
              </p>
            </div>
            <div className="mb-4 mt-8">
              <p
                className="text-gray-800 inline-block
                  rounded bg-gray-400 p-4"
              >
                List membership of professional bodies and activities in civic,
                public or international affairs
              </p>
            </div>
            {/*----- professional body Start -----*/}
            {professionalBodyArray.map((institution, index) => (
              <div key={index}>
                <div className="mb-4 mt-8">
                  <p
                    className="text-gray-800 inline-block
                  rounded bg-gray-400 px-4 py-2 font-semibold"
                  >
                    Body {index + 1}
                  </p>
                </div>
                <div className="grid grid-cols-1">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                    justify-center gap-1"
                  >
                    <label htmlFor="intake" className="text-sm">
                      Name of body and activities
                    </label>
                    <input
                      type="text"
                      id={`${institution["body"]}${index}`}
                      name={`${institution["body"]}${index}`}
                      onChange={(event) =>
                        professionalBodyFieldsChangeHandler(
                          event,
                          index,
                          buildProfessionalFieldValue("body", index)
                        )
                      }
                      value={
                        institution[buildProfessionalFieldValue("body", index)]
                      }
                      className="p-2 outline-none rounded border-[2px]
                            border-gray-500 focus:border-[2px] focus:border-primaryLight
                            transition-all text-sm w-full resize-none"
                    />
                  </div>
                </div>
                {/*----- professional body End -----*/}

                <div className="flex items-center justify-center gap-4">
                  {showBodyRemoveButton(index) && (
                    <button
                      className="bg-gray-300 flex items-center justify-center px-4 
                            py-2 rounded mt-4 gap-4 text-primary w-full"
                      onClick={() => removeProfessionalBodyHandler()}
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
                  {showBodyAddButton(index) && (
                    <button
                      className="bg-gray-300 flex items-center justify-center px-4 
                           py-2 rounded mt-4 gap-4 text-primary w-full"
                      onClick={() => AddProfessionalBodyHandler()}
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
