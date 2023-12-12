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

type InitialValues = {
  affirmationName: string;
  affirmationDate: string;
  affirmationSignature: string;
};

/**
 * Section3 component has section 3 content
 */
export const Section3: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const initialValues: InitialValues = {
    affirmationName: "",
    affirmationDate: "",
    affirmationSignature: "",
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
      affirmationName: Yup.string().max(255).required("Fullname is required"),
      affirmationDate: Yup.string().max(255).required("Date is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        //   Save info to storage
        saveFormDataToStorage({
          applicationForm: "postgraduate",
          category: "christianPhilosophyAffirmation",
          data: formik.values,
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
    if (!formik.values.affirmationName || !formik.values.affirmationDate) {
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
    // allCategorySubmitHandler();
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
      category: "christianPhilosophyAffirmation",
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
          section="section 3"
          footer="Employment footer"
        >
          <div className="w-full">
            <div className="my-2">
              <p
                className="text-gray-50 font-semibold inline-block
                    bg-primaryDark px-4 py-2 rounded"
              >
                SECTION 3.0. THE CHRISTIAN PHILOSOPHY OF UGANDA CHRISTIAN
                UNIVERSITY
              </p>
            </div>
            <div className="my-2">
              <p className="text-gray-800 text-sm inline-block py-2 rounded italic">
                From University Charter, Section 8; Adopted, 10 January 2002
              </p>
            </div>

            <div className="my-2">
              <p className="text-gray-800 text-sm inline-block py-2 rounded">
                The Christian Philosophy of Uganda Christian University is
                summarized in the motto:“God the Beginning and the End” and is
                articulated more fully in the “Instruments of Identity,” a
                statement approved by the House of Bishops of the Church of
                Uganda on 23 November 2000.
              </p>
            </div>

            <div className="my-2 text-sm space-y-8">
              {/* ----- Rules 1 start ----- */}
              <div>
                <p>
                  (1) Rule of Faith: Seeking to love God with all our heart, as
                  He has revealed Himself, we believe in the articles of the
                  Christian Faith.
                </p>
                <ul className="pl-4 space-y-2">
                  <li>
                    (a) There is One God in Three Persons, the Holy Trinity. God
                    is known partially in various times and cultures but is
                    fully revealed in Scripture as the Father, the Son, and the
                    Holy Spirit
                  </li>
                  <li>
                    (b) God the Father is the Source and Head of the Holy
                    Trinity and possesses all authority in heaven and earth. He
                    created the world, all things visible and invisible, and He
                    is the ground of all truth.
                  </li>
                  <li>
                    (c) God the Son, our Lord Jesus Christ, is truly God and
                    truly Man, born of the Holy Spirit by the Virgin Mary, risen
                    bodily from the dead, and seated at the right hand of the
                    Father.
                  </li>
                  <li>
                    (d) Jesus Christ is the unique Saviour, the Sinless One and
                    Sin-Bearer, who died on the Cross in our place so that all
                    who believe in Him might have eternal life. By God’s grace,
                    His elect people are saved through faith alone, being
                    reckoned righteous for His sake.
                  </li>
                  <li>
                    (e) Believers are sanctified by the Holy Spirit the
                    Counselor, Who distributes gifts, produces the fruit of good
                    works, and unites His Church in love.
                  </li>
                  <li>
                    (f) Holy Scripture, the Old and New Testaments, is God’s
                    Word written, and its authors, moved by the Holy Spirit,
                    spoke from God. The Bible contains all things necessary for
                    salvation and is the final authority in matters of faith and
                    practice.
                  </li>
                  <li>
                    (g) Jesus Christ is Lord and has received all authority in
                    heaven and earth. In obedience to His Great Commission,
                    believers are committed to personal evangelism,
                    discipleship, social responsibility, and world
                    evangelisation.
                  </li>
                  <li>
                    (h) Christ will come again in glory to judge the living and
                    the dead, some to eternal life and some to eternal death.
                  </li>
                </ul>
              </div>
              {/* ----- Rules 1 End ----- */}

              {/* ----- Rules 2 Start ----- */}
              <div>
                <p>
                  (2) Rule of Life: Seeking to love our neighbours as ourselves,
                  we promise:
                </p>
                <ul className="pl-4 space-y-2">
                  <li>
                    (a) to worship the one true God and avoid polytheistic
                    worship and the invoking of ancestral spirits or other
                    powers;
                  </li>
                  <li>
                    (b) to avoid swearing and disparaging talk about God, or
                    gossip about our neighbour;
                  </li>
                  <li>(c) to respect public times of worship and rest;</li>
                  <li>
                    (d) to respect the legitimate authority of the state, the
                    family, the Church, and the University, observing University
                    rules and not participating in any public riot;
                  </li>
                  <li>
                    (e) to uphold the human and civil rights of persons
                    regardless of race, class, ethnic group, or gender,
                    including the unborn, and to renounce any physical or verbal
                    abuse of another person;
                  </li>
                  <li>
                    (f) to shun all sexual immorality, polygamy, adultery,
                    fornication and homosexual practice;
                  </li>
                  <li>
                    (g) not to steal or engage in financial dishonesty of any
                    kind;
                  </li>
                  <li>
                    (i) to dress decently and treat each other with decency and
                    purity;
                  </li>
                  <li>
                    (j) to exercise moderation in all things, avoiding abuse of
                    body and soul through alcohol, tobacco, drugs, pornography,
                    or gambling.
                  </li>
                </ul>
              </div>
              {/* ----- Rules 2 End ----- */}

              {/* ----- Rules 3 start ----- */}
              <div>
                <p>
                  (3) Rule of Prayer. Seeking to love God with all our soul and
                  spirit, we promise:
                </p>
                <ul className="pl-4 space-y-2">
                  <li>
                    (a) to worship and participate regularly in a congregation
                    and/or in the University Chapel;
                  </li>
                  <li>
                    (b) to maintain a discipline of Bible reading and prayer;
                  </li>
                  <li>
                    (c) to give generously to the work of the Lord and to the
                    poor and needy.
                  </li>
                </ul>
              </div>
              {/* ----- Rules 3 End ----- */}
            </div>
          </div>

          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/*----- Affirmation Start -----*/}
            <div>
              <div
                className="flex flex-col items-start justify-center 
                sm:flex-row sm:items-center sm:justify-start gap-2"
              >
                <div
                  className=" relative pt-4 flex items-center 
                  justify-start gap-1"
                >
                  {formik.errors.affirmationName &&
                    formik.touched.affirmationName && (
                      <p className="absolute top-0 left-4 text-sm text-red-600">
                        {formik.errors.affirmationName}
                      </p>
                    )}
                  <label className="text-lg">I,</label>
                  <input
                    required
                    id="affirmationName"
                    name="affirmationName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.affirmationName}
                    className="p-2 outline-none rounded border-[2px]
                    border-gray-500 focus:border-[2px] focus:border-primaryLight
                    transition-all text-sm w-auto resize-none"
                    placeholder="your full name"
                  />
                </div>
                <div className="sm:pt-4">
                  <span className="text-sm">
                    affirm and Subscribe to the Christian Philosophy of Uganda
                    Christian University as laid out above.
                  </span>
                </div>
              </div>

              <div
                className="flex flex-col items-start justify-center 
                sm:flex-row sm:items-center sm:justify-start gap-2"
              >
                <div
                  className=" relative pt-4 flex flex-col items-start 
                  justify-center gap-1 w-full"
                >
                  {formik.errors.affirmationSignature &&
                    formik.touched.affirmationSignature && (
                      <p className="absolute top-0 left-4 text-sm text-red-600">
                        {formik.errors.affirmationSignature}
                      </p>
                    )}
                  <label className="text-sm">Signed:</label>
                  <input
                    // required
                    type="text"
                    id="affirmationSignature"
                    name="affirmationSignature"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.affirmationSignature}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
                <div
                  className=" relative pt-4 flex flex-col items-start 
                  justify-center gap-1 w-full"
                >
                  {formik.errors.affirmationDate &&
                    formik.touched.affirmationDate && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.affirmationDate}
                      </p>
                    )}
                  <label className="text-sm">Date:</label>
                  <input
                    required
                    type="date"
                    id="affirmationDate"
                    name="affirmationDate"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.affirmationDate}
                    className="p-2 outline-none rounded border-[2px]
                     border-gray-500 focus:border-[2px] focus:border-primaryLight
                     transition-all text-sm w-full resize-none"
                  />
                </div>
              </div>
            </div>
            {/*----- Affirmation End -----*/}

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
                   place-items-center text-gray-50 text-lgs"
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
