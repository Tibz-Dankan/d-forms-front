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

export const Section6: React.FC = () => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();

  const { prevPageHandler, nextPageHandler } = useProgress({
    page: 6,
    section: "6",
    nextPageURL: "/promotion/section7",
    prevPageURL: "/promotion/section5",
  });

  const initialValues: TInitialValues = {};

  const getInitialValues = (): TInitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "promotion",
      category: "publications",
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
    publicationSubmitHandler();
  }

  // Education background
  const effectRan = useRef(false);
  const [publicationArray, setPublicationArray] = useState<any[]>([]);

  const buildProfessionalBody = (index: number) => {
    const publication: any = {};
    publication[`publication${index}`] = "";

    return publication;
  };

  const buildPublicationFieldValue = (fieldName: string, index: number) => {
    return `${fieldName}${index}`;
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const constructPublicationFieldCount = () => {
        if (publicationArray[0]) return;

        for (let index = 0; index < 3; index++) {
          setPublicationArray((publications) => [
            ...publications,
            buildProfessionalBody(index),
          ]);
        }
      };
      constructPublicationFieldCount();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const AddPublicationHandler = () => {
    const currentMaxPublicationArrayIndex: number = publicationArray.length - 1;
    const incrementedPublicationArrayIndex: number =
      currentMaxPublicationArrayIndex + 1;
    setPublicationArray((bodies) => [
      ...bodies,
      buildProfessionalBody(incrementedPublicationArrayIndex),
    ]);
  };

  const removePublicationHandler = () => {
    const lastPublicationIndex: number = publicationArray.length - 1;
    if (lastPublicationIndex <= 1) return;

    const reducedPublicationArray = publicationArray.filter(
      (_, index) => index !== lastPublicationIndex
    );
    setPublicationArray(() => reducedPublicationArray);
  };

  const showPublicationAddButton = (index: number) => {
    return index === publicationArray.length - 1;
  };

  const showPublicationRemoveButton = (index: number) => {
    const canShowBodyRemoveButton: boolean = publicationArray.length > 2;
    const isLastBodyArrayIndex = index === publicationArray.length - 1;
    const showRemoveButton: boolean =
      canShowBodyRemoveButton && isLastBodyArrayIndex;

    return showRemoveButton;
  };

  const publicationFieldsChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    fieldIndex: number,
    fieldName: string
  ) => {
    const value = event.target.value;
    const mutatedInstitutionArray: any[] = [];

    publicationArray.map((employer: any, index: number) => {
      if (index === fieldIndex) {
        employer[fieldName] = value;
        mutatedInstitutionArray.push(employer);
        return;
      }
      mutatedInstitutionArray.push(employer);
    });
    setPublicationArray(() => mutatedInstitutionArray);
  };

  function publicationSubmitHandler() {
    const pubArray = transformToArrayOfObjects(publicationArray[0]);
    console.log("firstPublicationArray", pubArray);

    for (let i = 0; i < pubArray.length; i++) {
      const key = extractItemKey(pubArray[i]);
      console.log("publication extracted key", key);

      if (pubArray[i][key]) continue;

      throw new Error("Please fill all fields of publication");
    }

    saveFormDataToStorage({
      applicationForm: "promotion",
      category: "publication",
      data: { publications: publicationArray },
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
                Publications
              </p>
            </div>
            <div className="mb-4 mt-8">
              <p
                className="text-gray-800 inline-block
                    rounded bg-gray-400 p-4"
              >
                List and attach a minimum of three significant publications
                completed since appointment or last promotion.
              </p>
            </div>
            {/*----- professional body Start -----*/}
            {publicationArray.map((publication, index) => (
              <div key={index}>
                <div className="mb-4 mt-8">
                  <p
                    className="text-gray-800 inline-block
                    rounded bg-gray-400 px-4 py-2 font-semibold"
                  >
                    Publication {index + 1}
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
                      id={`${publication["publication"]}${index}`}
                      name={`${publication["publication"]}${index}`}
                      onChange={(event) =>
                        publicationFieldsChangeHandler(
                          event,
                          index,
                          buildPublicationFieldValue("publication", index)
                        )
                      }
                      value={
                        publication[
                          buildPublicationFieldValue("publication", index)
                        ]
                      }
                      className="p-2 outline-none rounded border-[2px]
                              border-gray-500 focus:border-[2px] focus:border-primaryLight
                              transition-all text-sm w-full resize-none"
                    />
                  </div>
                </div>
                {/*----- professional body End -----*/}

                <div className="flex items-center justify-center gap-4">
                  {showPublicationRemoveButton(index) && (
                    <button
                      className="bg-gray-300 flex items-center justify-center px-4 
                              py-2 rounded mt-4 gap-4 text-primary w-full"
                      onClick={() => removePublicationHandler()}
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
                  {showPublicationAddButton(index) && (
                    <button
                      className="bg-gray-300 flex items-center justify-center px-4 
                             py-2 rounded mt-4 gap-4 text-primary w-full"
                      onClick={() => AddPublicationHandler()}
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
