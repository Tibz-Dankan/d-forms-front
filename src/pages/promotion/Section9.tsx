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
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { transformToArrayOfObjects } from "../../utils/transformToArrayOfObject";
import {
  saveFormDataToStorage,
  getDataFromStorage,
} from "../../utils/saveFormDataToStorage";
import { useProgress } from "../../hooks/useProgress";

type TInitialValues = {};

export const Section9: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 9,
    section: "9",
    nextPageURL: "/promotion/section-submit",
    prevPageURL: "/promotion/section8",
  });

  const initialValues: TInitialValues = {};

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "references",
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
        // Save References info
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
    referencesSubmitHandler();
  }

  // Education background
  const effectRan = useRef(false);
  const [referencesArray, setReferencesArray] = useState<any[]>([]);

  const buildReference = (index: number) => {
    const reference: any = {};
    reference[`fullname${index}`] = "";
    reference[`fullAddress${index}`] = "";
    reference[`telephone${index}`] = "";
    reference[`email${index}`] = "";
    reference[`occupation${index}`] = "";

    return reference;
  };

  const buildReferenceFieldValue = (fieldName: string, index: number) => {
    return `${fieldName}${index}`;
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const constructReferencesFieldCount = () => {
        if (referencesArray[0]) return;

        for (let index = 0; index < 3; index++) {
          setReferencesArray((references) => [
            ...references,
            buildReference(index),
          ]);
        }
      };
      constructReferencesFieldCount();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const referencesFieldsChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    fieldIndex: number,
    fieldName: string
  ) => {
    const value = event.target.value;
    const mutatedReferenceArray: any[] = [];

    referencesArray.map((reference: any, index: number) => {
      if (index === fieldIndex) {
        reference[fieldName] = value;
        mutatedReferenceArray.push(reference);
        return;
      }
      mutatedReferenceArray.push(reference);
    });
    setReferencesArray(() => mutatedReferenceArray);
  };

  function referencesSubmitHandler() {
    for (let i = 0; i < referencesArray.length; i++) {
      const key = extractItemKey(referencesArray[i]);

      if (referencesArray[i][key]) continue;

      throw new Error("Please fill all fields of education");
    }

    saveFormDataToStorage({
      applicationForm: "promotion",
      category: "references",
      data: { references: referencesArray },
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
                 bg-primaryDark px-4 py-2 rounded uppercase"
              >
                References
              </p>
            </div>
            <div className="mb-4 mt-8">
              <p
                className="text-gray-800 inline-block
                  rounded bg-gray-400 p-4"
              >
                List three persons not related to you who are familiar with your
                character and qualifications and who may be contacted for a
                reference
              </p>
            </div>
            {/*----- Instituition Start -----*/}
            {referencesArray.map((reference, index) => (
              <div key={index}>
                <div className="mb-4 mt-8">
                  <p
                    className="text-gray-800 inline-block
                  rounded bg-gray-400 px-4 py-2 font-semibold"
                  >
                    Reference {index + 1}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
                  >
                    <label htmlFor="intake" className="text-sm">
                      Full name
                    </label>
                    <input
                      type="text"
                      id={`${reference["fullname"]}${index}`}
                      name={`${reference["fullname"]}${index}`}
                      onChange={(event) =>
                        referencesFieldsChangeHandler(
                          event,
                          index,
                          buildReferenceFieldValue("fullname", index)
                        )
                      }
                      value={
                        reference[buildReferenceFieldValue("fullname", index)]
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
                    <label className="text-sm">Full address</label>
                    <input
                      type="text"
                      id={`${reference["fullAddress"]}${index}`}
                      name={`${reference["fullAddress"]}${index}`}
                      onChange={(event) =>
                        referencesFieldsChangeHandler(
                          event,
                          index,
                          buildReferenceFieldValue("fullAddress", index)
                        )
                      }
                      value={
                        reference[
                          buildReferenceFieldValue("fullAddress", index)
                        ]
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
                    <label className="text-sm">Telephone</label>
                    <input
                      type="number"
                      id={`${reference["telephone"]}${index}`}
                      name={`${reference["telephone"]}${index}`}
                      onChange={(event) =>
                        referencesFieldsChangeHandler(
                          event,
                          index,
                          buildReferenceFieldValue("telephone", index)
                        )
                      }
                      value={
                        reference[buildReferenceFieldValue("telephone", index)]
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
                    <label className="text-sm">Email</label>
                    <input
                      type="email"
                      id={`${reference["email"]}${index}`}
                      name={`${reference["email"]}${index}`}
                      onChange={(event) =>
                        referencesFieldsChangeHandler(
                          event,
                          index,
                          buildReferenceFieldValue("email", index)
                        )
                      }
                      value={
                        reference[buildReferenceFieldValue("email", index)]
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
                    <label className="text-sm">Occupation or Business</label>
                    <input
                      type="text"
                      id={`${reference["occupation"]}${index}`}
                      name={`${reference["occupation"]}${index}`}
                      onChange={(event) =>
                        referencesFieldsChangeHandler(
                          event,
                          index,
                          buildReferenceFieldValue("occupation", index)
                        )
                      }
                      value={
                        reference[buildReferenceFieldValue("occupation", index)]
                      }
                      className="p-2 outline-none rounded border-[2px]
                            border-gray-500 focus:border-[2px] focus:border-primaryLight
                            transition-all text-sm w-full resize-none"
                    />
                  </div>
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
