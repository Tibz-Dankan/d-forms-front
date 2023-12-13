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
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { transformToArrayOfObjects } from "../../utils/transformToArrayOfObject";
import {
  saveFormDataToStorage,
  getDataFromStorage,
} from "../../utils/saveFormDataToStorage";

type InitialValues = {
  whyUCU: string;
};

/**
 * Section6 component has section 6 to 7
 */
export const Section6: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const initialValues: InitialValues = {
    whyUCU: "",
  };

  const getInitialValues = (): InitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "postgraduate",
      category: "whyUCU",
    }) as InitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      whyUCU: Yup.string().max(500).required("This field is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // Save additional Information
        saveFormDataToStorage({
          applicationForm: "postgraduate",
          category: "whyUCU",
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

    // check for empty field values
    if (!formik.values.whyUCU) {
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
    allCategoryHandler();
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

  const [waysIKnewAboutUCU, setWaysIKnewAboutUCU] = useState({
    friendAtUCU: false,
    advertisement: false,
    church: false,
    internet: false,
    exhibitions: false,
    others: false,
  });
  const [wayIKnewAboutUCUError, setWayIKnewAboutUCUError] = useState("");

  const waysCheckboxChangeHandler = (way: string) => {
    setWayIKnewAboutUCUError(() => "");
    setWaysIKnewAboutUCU((prevDisabilities: any) => ({
      ...prevDisabilities,
      [way]: !prevDisabilities[way],
    }));
  };

  function waysIKnewAboutUCUSubmitHandler() {
    const waysArray = [
      {
        way: "Friend who are students at UCU",
        codeLabel: "friendAtUCU",
      },
      {
        way: "Advertisement",
        codeLabel: "advertisement",
      },
      {
        way: "Church",
        codeLabel: "church",
      },
      {
        way: "Internet",
        codeLabel: "church",
      },
      {
        way: "Exhibitions",
        codeLabel: "exhibitions",
      },
      {
        way: "Others",
        codeLabel: "others",
      },
    ];
    // validate errors here

    const codeLabelArray = transformToArrayOfObjects(waysIKnewAboutUCU);
    console.log("codeLabelArray", codeLabelArray);

    const selectedWays = () => {
      const checkedWaysArray: string[] = [];

      for (let i = 0; i < codeLabelArray.length; i++) {
        const key = extractItemKey(codeLabelArray[i]);
        console.log("way extracted key", key);

        if (codeLabelArray[i][key] === true) {
          const checkedWay = waysArray.find(
            (disability) => disability.codeLabel === key
          );
          console.log("checkedWay", checkedWay);
          const way = checkedWay?.way as string;
          checkedWaysArray.push(way);
        }
      }
      return checkedWaysArray;
    };
    //error check
    if (!selectedWays()[0]) {
      setWayIKnewAboutUCUError(
        () => "please indicate at least one way you knew about UCU!"
      );
      dispatch(
        showCardNotification({
          type: "error",
          message: "please indicate at least one way you knew about UCU!",
        })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
      return;
    }
    // submit values
    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "waysIKnewAboutUCU",
      data: { waysIKnewAboutUCU: selectedWays() },
      updateAt: new Date().toISOString(),
    });
    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "whyUCU",
      data: formik.values,
      updateAt: new Date().toISOString(),
    });
  }

  const allCategoryHandler = () => {
    waysIKnewAboutUCUSubmitHandler();
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
          section="section 6"
          footer="Employment footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/* ----- Why UCU  Start-----*/}
            <div className="mb-8">
              <p
                className="text-gray-50 font-semibold inline-block
                  bg-primaryDark px-4 py-2 rounded mb-4"
              >
                6.0. ADDITIONAL INFORMATION
              </p>

              <div className="mb-4 flex items-center justify-start gap-3">
                <label className="text-sm">
                  How did you learn about Uganda Christian University (Tick as
                  appropriate)?
                </label>
              </div>

              <div className="mb-2 text-sm">
                {wayIKnewAboutUCUError && (
                  <div>
                    <span className="text-sm text-red-500">
                      {wayIKnewAboutUCUError}
                    </span>
                  </div>
                )}
                <div>
                  <input
                    type="checkbox"
                    id="chronicIllness"
                    checked={waysIKnewAboutUCU.friendAtUCU}
                    onChange={() => waysCheckboxChangeHandler("friendAtUCU")}
                    className="mr-2"
                  />
                  <label htmlFor="chronicIllness" className="mr-4">
                    Friend who are students at UCU
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="physicalDisability"
                    checked={waysIKnewAboutUCU.advertisement}
                    onChange={() => waysCheckboxChangeHandler("advertisement")}
                    className="mr-2"
                  />
                  <label htmlFor="physicalDisability" className="mr-4">
                    Advertisement
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="impairment"
                    checked={waysIKnewAboutUCU.church}
                    onChange={() => waysCheckboxChangeHandler("church")}
                    className="mr-2"
                  />
                  <label htmlFor="impairment" className="mr-4">
                    Church
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="others"
                    checked={waysIKnewAboutUCU.internet}
                    onChange={() => waysCheckboxChangeHandler("internet")}
                    className="mr-2"
                  />
                  <label htmlFor="others">Internet</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="others"
                    checked={waysIKnewAboutUCU.exhibitions}
                    onChange={() => waysCheckboxChangeHandler("exhibitions")}
                    className="mr-2"
                  />
                  <label htmlFor="others">Exhibitions</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="others"
                    checked={waysIKnewAboutUCU.others}
                    onChange={() => waysCheckboxChangeHandler("others")}
                    className="mr-2"
                  />
                  <label htmlFor="others">Others</label>
                </div>
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                   justify-center gap-1"
              >
                {formik.errors.whyUCU && formik.touched.whyUCU && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.whyUCU}
                  </p>
                )}
                <label className="text-sm">
                  Why do you wish to study at Uganda Christian University?
                </label>
                <textarea
                  required
                  id="whyUCU"
                  name="whyUCU"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.whyUCU}
                  className="p-2 outline-none rounded border-[2px]
                    border-gray-500 focus:border-[2px] focus:border-primaryLight
                    transition-all text-sm w-full resize-none h-28"
                />
              </div>
            </div>
            {/* ----- Why UCU  End----- */}

            {/* ----- Procedure Start  */}
            <div className="mb-8">
              <p
                className="text-gray-50 font-semibold inline-block
                  bg-primaryDark px-4 py-2 rounded "
              >
                7.0. PROCEDURE OF APPLICATION
              </p>
            </div>

            <div className="text-sm">
              <p>
                Applicants are required to pay a nonrefundable application fee
                of Ush. 50,000/= or $25 at any University bankers in Uganda then
                proceed to the Academic office and present a receipt at the
                front desk to obtain an application form.
              </p>
              <ul className="pl-6 list-disc">
                <li className="">
                  Apply by filling application forms and observe all the
                  application deadlines
                </li>
                <li>
                  Check for the results of your application on the date
                  specified
                </li>
                <li>If admitted pick admission letter on the date specified</li>
              </ul>
              <p className="text-base font-semibold mt-4">
                In addition applicants may
              </p>
              <ul className="list-disc pl-6">
                <li>
                  Download application forms from the websites at{" "}
                  <Link
                    to="www.ucu.ac.ug/admissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    www.ucu.ac.ug/admissions
                  </Link>{" "}
                  and fill and return them
                </li>
                <li>
                  International students admitted, may request for admission
                  letters by email{" "}
                  <Link
                    to="admissions@ucu.ac.ug"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    {" "}
                    (admissions@ucu.ac.ug)
                  </Link>
                </li>
              </ul>
            </div>
            {/* ----- Procedure End  */}

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
                 place-items-center text-gray-50"
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
