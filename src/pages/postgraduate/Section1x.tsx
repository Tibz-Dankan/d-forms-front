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

type Employer = {
  nameAddress: string;
  designation: string;
  from: string;
  to: string;
};

type ContactInfo = {
  contactTelephone: string;
  contactEmail: string;
  contactPOBox: string;
  contactTown: string;
  contactCountry: string;
};

type GuardianInfo = {
  fatherGuardianTelephone: string;
  fatherGuardianEmail: string;
  fatherGuardianPOBox: string;
  fatherGuardianTown: string;
  fatherGuardianCountry: string;
  motherGuardianTelephone: string;
  motherGuardianEmail: string;
  motherGuardianPOBox: string;
  motherGuardianTown: string;
  motherGuardianCountry: string;
};

type SponsorInfo = {
  sponsorTelephone: string;
  sponsorEmail: string;
  sponsorPOBox: string;
  sponsorTown: string;
  sponsorCountry: string;
};

type Disability = {
  isDisabled?: boolean;
  disabilityState?: string;
};

type InitialValues = ContactInfo & GuardianInfo & SponsorInfo & Disability;

/**
 * Section1x component has section 1.2 to 1.4
 */
export const Section1x: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    section: "",
  });
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  // // Disability
  // const disablity = {
  //   isDisabled: false,
  //   disabilities: {},
  //   natureOfDisability: "",
  // };
  // // Contact
  // const contact = {
  //   telephone: null,
  //   email: "",
  //   POBox: "",
  //   town: "",
  //   country: "",
  // };
  // // Parents/Guardians
  // const parentGuardianFather = {
  //   telephone: null,
  //   email: "",
  //   POBox: "",
  //   town: "",
  //   country: "",
  // };
  // const parentGuardianMother = {
  //   telephone: null,
  //   email: "",
  //   POBox: "",
  //   town: "",
  //   country: "",
  // };
  // const sponsor = {
  //   telephone: null,
  //   email: "",
  //   POBox: "",
  //   town: "",
  //   country: "",
  // };
  // // employer
  // const employer = {
  //   nameAddress: "",
  //   designation: "",
  //   from: "",
  //   to: "",
  // };

  const initialValues: InitialValues = {
    isDisabled: false,
    disabilityState: "",
    contactTelephone: "",
    contactEmail: "",
    contactPOBox: "",
    contactTown: "",
    contactCountry: "",
    fatherGuardianTelephone: "",
    fatherGuardianEmail: "",
    fatherGuardianPOBox: "",
    fatherGuardianTown: "",
    fatherGuardianCountry: "",
    motherGuardianTelephone: "",
    motherGuardianEmail: "",
    motherGuardianPOBox: "",
    motherGuardianTown: "",
    motherGuardianCountry: "",
    sponsorTelephone: "",
    sponsorEmail: "",
    sponsorPOBox: "",
    sponsorTown: "",
    sponsorCountry: "",
  };

  const getInitialValues = (): InitialValues => {
    const valuesFromStorage = getDataFromStorage({
      applicationForm: "postgraduate",
      category: "personalInfo",
    }) as InitialValues;

    if (!valuesFromStorage) return initialValues;
    return valuesFromStorage;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      // contact
      contactTelephone: Yup.string().max(255).required("Telephone is required"),
      contactEmail: Yup.string().max(255).required("Email is required"),
      contactPOBox: Yup.string().max(255).required("P.O box is required"),
      contactTown: Yup.string().max(255).required("Town is required"),
      contactCountry: Yup.string().max(255).required("Country is required"),
      // father/guardian
      fatherGuardianTelephone: Yup.string()
        .max(255)
        .required("Telephone is required"),
      fatherGuardianEmail: Yup.string().max(255).required("Email is required"),
      fatherGuardianTown: Yup.string().max(255).required("Town is required"),
      fatherGuardianCountry: Yup.string()
        .max(50)
        .required("Country is required"),
      // mother/guardian
      motherGuardianTelephone: Yup.string()
        .max(50)
        .required("Telephone is required"),
      motherGuardianEmail: Yup.string().max(50).required("Email is required"),
      motherGuardianPOBox: Yup.string().max(50).required("P.O box is required"),
      motherGuardianTown: Yup.string().max(50).required("Town is required"),
      motherGuardianCountry: Yup.string()
        .max(50)
        .required("Country is required"),
      // // sponsor
      // sponsorTelephone: Yup.string().max(50).required("Sponsor is required"),
      // sponsorEmail: Yup.string().max(50).required("Email is required"),
      // sponsorPOBox: Yup.string().max(50).required("P.O box is required"),
      // sponsorTown: Yup.string().max(50).required("Town is required"),
      // sponsorCountry: Yup.string().max(50).required("Country is required"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Submit values", values);
      try {
        // // Save Personal Information
        // saveFormDataToStorage({
        //   applicationForm: "postgraduate",
        //   category: "personalInfo",
        //   data: values,
        //   updateAt: new Date().toISOString(),
        // });
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
    if (
      !formik.values.contactTelephone ||
      !formik.values.contactEmail ||
      !formik.values.contactPOBox ||
      !formik.values.contactTown ||
      !formik.values.contactCountry ||
      !formik.values.fatherGuardianTelephone ||
      !formik.values.fatherGuardianEmail ||
      !formik.values.fatherGuardianPOBox ||
      !formik.values.fatherGuardianTown ||
      !formik.values.fatherGuardianCountry ||
      !formik.values.motherGuardianTelephone ||
      !formik.values.motherGuardianEmail ||
      !formik.values.motherGuardianPOBox ||
      !formik.values.motherGuardianTown ||
      !formik.values.motherGuardianCountry
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

  const [disability, setDisability] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [disabilityError, setDisabilityError] = useState("");

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
    setDisabilityError(() => "");
    setDisabilities((prevDisabilities: any) => ({
      ...prevDisabilities,
      [disability]: !prevDisabilities[disability],
    }));
  };

  function disabilitySubmitHandler() {
    const disabilitiesArray = [
      {
        disability: "Chronic Illness",
        codeLabel: "chronicIllness",
      },
      {
        disability: "Physical Disability",
        codeLabel: "physicalDisability",
      },
      {
        disability: "Impairment",
        codeLabel: "impairment",
      },
      {
        disability: "Others",
        codeLabel: "others",
      },
    ];
    // validate errors here

    const codeLabelArray = transformToArrayOfObjects(disabilities);
    console.log("codeLabelArray", codeLabelArray);

    const selectedDisability = () => {
      const checkedDisabilitiesArray: any[] = [];

      for (let i = 0; i < codeLabelArray.length; i++) {
        const key = extractItemKey(codeLabelArray[i]);
        console.log("disability extracted key", key);

        if (codeLabelArray[i][key] === true) {
          const checkedDisability = disabilitiesArray.find(
            (disability) => disability.codeLabel === key
          );
          console.log("checkedDisability", checkedDisability);
          checkedDisabilitiesArray.push(checkedDisability?.disability);
        }
      }
      return checkedDisabilitiesArray;
    };
    //error check
    if (!selectedDisability()[0]) {
      setDisabilityError(() => "If you are disabled please indicate!");
      dispatch(
        showCardNotification({
          type: "error",
          message: "If you are disabled please indicate!",
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
      category: "disability",
      data: { disability: selectedDisability() },
      updateAt: new Date().toISOString(),
    });
  }

  const allCategoryHandler = () => {
    employerRecordSubmitHandler();
    disabilitySubmitHandler();
    applicantContactSubmitHandler();
    parentGuardianSubmitHandler();
  };

  // EMPLOYER RECORD LOGIC
  const effectRan = useRef(false);
  const [employerArray, setEmployerArray] = useState<any[]>([]);

  const buildEmployer = (index: number) => {
    const employer: any = {};
    employer[`nameAddress${index}`] = "";
    employer[`designation${index}`] = "";
    employer[`from${index}`] = "";
    employer[`to${index}`] = "";

    return employer;
  };

  const buildEmployerFieldValue = (fieldName: string, index: number) => {
    return `${fieldName}${index}`;
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const constructEmployerInitialFieldCount = () => {
        if (employerArray[0]) return;

        for (let index = 0; index < 2; index++) {
          setEmployerArray((employers) => [...employers, buildEmployer(index)]);
        }
      };
      constructEmployerInitialFieldCount();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const AddEmployerHandler = () => {
    const currentMaxEmployerArrayIndex: number = employerArray.length - 1;
    const incrementedEmployArrayIndex: number =
      currentMaxEmployerArrayIndex + 1;
    setEmployerArray((employers) => [
      ...employers,
      buildEmployer(incrementedEmployArrayIndex),
    ]);
  };

  const removeEmployerHandler = () => {
    const lastEmployerArrayIndex: number = employerArray.length - 1;
    if (lastEmployerArrayIndex <= 1) return;

    const reducedEmployArray = employerArray.filter(
      (_, index) => index !== lastEmployerArrayIndex
    );
    setEmployerArray(() => reducedEmployArray);
  };

  const showEmployerAddButton = (index: number) => {
    return index === employerArray.length - 1;
  };

  const showEmployerRemoveButton = (index: number) => {
    const canShowEmployerRemoveButton: boolean = employerArray.length > 2;
    const isLastEmployerArrayIndex = index === employerArray.length - 1;
    const showRemoveButton: boolean =
      canShowEmployerRemoveButton && isLastEmployerArrayIndex;

    return showRemoveButton;
  };

  const employerFieldsChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    fieldIndex: number,
    fieldName: string
  ) => {
    const value = event.target.value;
    const mutatedEmployerArray: any[] = [];

    employerArray.map((employer: any, index) => {
      if (index === fieldIndex) {
        employer[fieldName] = value;
        mutatedEmployerArray.push(employer);
        return;
      }
      mutatedEmployerArray.push(employer);
    });
    setEmployerArray(() => mutatedEmployerArray);
  };

  function employerRecordSubmitHandler() {
    const firstEmployerArray = transformToArrayOfObjects(employerArray[0]);
    console.log("firstEmployerArray", firstEmployerArray);

    for (let i = 0; i < firstEmployerArray.length; i++) {
      const key = extractItemKey(firstEmployerArray[i]);
      console.log("employer extracted key", key);

      if (firstEmployerArray[i][key]) continue;
      dispatch(
        showCardNotification({
          type: "error",
          message: "Please fill all fields of employer 1",
        })
      );
      setTimeout(() => {
        dispatch(hideCardNotification());
      }, 5000);
    }

    // TODO: validate for more 2 employers

    // submit values
    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "employerRecord",
      data: { employers: employerArray }, //To be changed
      updateAt: new Date().toISOString(),
    });
  }

  function validateApplicantSponsor() {
    const sponsor = {
      telephone: formik.values.sponsorTelephone,
      email: formik.values.sponsorEmail,
      POBox: formik.values.sponsorPOBox,
      town: formik.values.sponsorTown,
      country: formik.values.sponsorCountry,
    };

    const sponsorProperyArray = transformToArrayOfObjects(sponsor);
    // TODO: to add more validation for sponsor here
    // save data in storage
  }

  function parentGuardianSubmitHandler() {
    const fatherGuardian = {
      telephone: formik.values.fatherGuardianTelephone,
      email: formik.values.fatherGuardianEmail,
      POBox: formik.values.fatherGuardianPOBox,
      town: formik.values.fatherGuardianTown,
      country: formik.values.fatherGuardianCountry,
    };
    const motherGuardian = {
      telephone: formik.values.motherGuardianCountry,
      email: formik.values.motherGuardianEmail,
      POBox: formik.values.motherGuardianPOBox,
      town: formik.values.motherGuardianTown,
      country: formik.values.motherGuardianCountry,
    };
    const sponsor = {
      telephone: formik.values.sponsorTelephone,
      email: formik.values.sponsorEmail,
      POBox: formik.values.sponsorPOBox,
      town: formik.values.sponsorTown,
      country: formik.values.sponsorCountry,
    };

    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "parentGuardian",
      data: {
        parentGuardian: {
          fatherGuardian: fatherGuardian,
          motherGuardian: motherGuardian,
          sponsor: sponsor,
        },
      },
      updateAt: new Date().toISOString(),
    });
  }

  function applicantContactSubmitHandler() {
    const applicantContact = {
      telephone: formik.values.contactTelephone,
      email: formik.values.contactEmail,
      POBox: formik.values.contactPOBox,
      town: formik.values.contactTown,
      country: formik.values.contactCountry,
    };

    saveFormDataToStorage({
      applicationForm: "postgraduate",
      category: "contact",
      data: { contact: applicantContact },
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
          section="section 1.2-1.4"
          footer="Employment footer"
        >
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/* ----- Disability  Start-----*/}
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
                  {disabilityError && (
                    <div>
                      <span className="text-sm text-red-500">
                        {disabilityError}
                      </span>
                    </div>
                  )}
                  <div></div>
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
                  {isDisabled &&
                    formik.errors.disabilityState &&
                    formik.touched.disabilityState && (
                      <p className="absolute top-0 left-0 text-sm text-red-600">
                        {formik.errors.disabilityState}
                      </p>
                    )}
                  <label className="text-sm">
                    Briefly state nature of disability
                  </label>
                  <textarea
                    required
                    id="disabilityState"
                    name="disabilityState"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.disabilityState}
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
                {formik.errors.contactTelephone &&
                  formik.touched.contactTelephone && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.contactTelephone}
                    </p>
                  )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  required
                  id="contactTelephone"
                  name="contactTelephone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contactTelephone}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.contactEmail && formik.touched.contactEmail && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.contactEmail}
                  </p>
                )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  id="contactEmail"
                  name="contactEmail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contactEmail}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.contactPOBox && formik.touched.contactPOBox && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.contactPOBox}
                  </p>
                )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  required
                  id="contactPOBox"
                  name="contactPOBox"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contactPOBox}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.contactTown && formik.touched.contactTown && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.contactTown}
                  </p>
                )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  required
                  id="contactTown"
                  name="contactTown"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contactTown}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.contactCountry &&
                  formik.touched.contactCountry && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.contactCountry}
                    </p>
                  )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  required
                  id="contactCountry"
                  name="contactCountry"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.contactCountry}
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
                {formik.errors.fatherGuardianTelephone &&
                  formik.touched.fatherGuardianTelephone && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.fatherGuardianTelephone}
                    </p>
                  )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  required
                  id="fatherGuardianTelephone"
                  name="fatherGuardianTelephone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.fatherGuardianTelephone}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.fatherGuardianEmail &&
                  formik.touched.fatherGuardianEmail && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.fatherGuardianEmail}
                    </p>
                  )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  id="fatherGuardianEmail"
                  name="fatherGuardianEmail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.fatherGuardianEmail}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.fatherGuardianPOBox &&
                  formik.touched.fatherGuardianPOBox && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.fatherGuardianPOBox}
                    </p>
                  )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  required
                  id="fatherGuardianPOBox"
                  name="fatherGuardianPOBox"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.fatherGuardianPOBox}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.fatherGuardianTown &&
                  formik.touched.fatherGuardianTown && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.fatherGuardianTown}
                    </p>
                  )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  required
                  id="fatherGuardianTown"
                  name="fatherGuardianTown"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.fatherGuardianTown}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.fatherGuardianCountry &&
                  formik.touched.fatherGuardianCountry && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.fatherGuardianCountry}
                    </p>
                  )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  required
                  id="fatherGuardianCountry"
                  name="fatherGuardianCountry"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.fatherGuardianCountry}
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
                {formik.errors.motherGuardianTelephone &&
                  formik.touched.motherGuardianTelephone && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.motherGuardianTelephone}
                    </p>
                  )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  required
                  id="motherGuardianTelephone"
                  name="motherGuardianTelephone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.motherGuardianTelephone}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.motherGuardianEmail &&
                  formik.touched.motherGuardianEmail && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.motherGuardianEmail}
                    </p>
                  )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  id="motherGuardianEmail"
                  name="motherGuardianEmail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.motherGuardianEmail}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.motherGuardianPOBox &&
                  formik.touched.motherGuardianPOBox && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.motherGuardianPOBox}
                    </p>
                  )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  required
                  id="motherGuardianPOBox"
                  name="motherGuardianPOBox"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.motherGuardianPOBox}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.motherGuardianTown &&
                  formik.touched.motherGuardianTown && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.motherGuardianTown}
                    </p>
                  )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  required
                  id="motherGuardianTown"
                  name="motherGuardianTown"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.motherGuardianTown}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.motherGuardianCountry &&
                  formik.touched.motherGuardianCountry && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.motherGuardianCountry}
                    </p>
                  )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  required
                  id="motherGuardianCountry"
                  name="motherGuardianCountry"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.motherGuardianCountry}
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
                {formik.errors.sponsorTelephone &&
                  formik.touched.sponsorTelephone && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.sponsorTelephone}
                    </p>
                  )}
                <label className="text-sm">Telephone number</label>
                <input
                  type="text"
                  // required
                  id="sponsorTelephone"
                  name="sponsorTelephone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.sponsorTelephone}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.sponsorEmail && formik.touched.sponsorEmail && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.sponsorEmail}
                  </p>
                )}
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  // required
                  id="sponsorEmail"
                  name="sponsorEmail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.sponsorEmail}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.sponsorPOBox && formik.touched.sponsorPOBox && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.sponsorPOBox}
                  </p>
                )}
                <label className="text-sm">P.O BOX</label>
                <input
                  type="text"
                  // required
                  id="sponsorPOBox"
                  name="sponsorPOBox"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.sponsorPOBox}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.sponsorTown && formik.touched.sponsorTown && (
                  <p className="absolute top-0 left-0 text-sm text-red-600">
                    {formik.errors.sponsorTown}
                  </p>
                )}
                <label className="text-sm">Town</label>
                <input
                  type="text"
                  // required
                  id="sponsorTown"
                  name="sponsorTown"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.sponsorTown}
                  className="p-2 outline-none rounded border-[2px]
                  border-gray-500 focus:border-[2px] focus:border-primaryLight
                  transition-all text-sm w-full resize-none"
                />
              </div>
              <div
                className="relative pt-4 flex flex-col items-start 
                 justify-center gap-1"
              >
                {formik.errors.sponsorCountry &&
                  formik.touched.sponsorCountry && (
                    <p className="absolute top-0 left-0 text-sm text-red-600">
                      {formik.errors.sponsorCountry}
                    </p>
                  )}
                <label className="text-sm">Country</label>
                <input
                  type="text"
                  // required
                  id="sponsorCountry"
                  name="sponsorCountry"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.sponsorCountry}
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

            {employerArray.map((employer, index) => (
              <div key={index}>
                <div className="my-2">
                  <p
                    className="text-gray-800 font-semibold inline-block
                       px-4 py-2 rounded bg-gray-400"
                  >
                    Employer {index + 1}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mt-2 mb-8">
                  <div
                    className="relative pt-4 flex flex-col items-start 
                      justify-center gap-1"
                  >
                    {/* {formik.errors.program && formik.touched.program && (
                          <p className="absolute top-0 left-0 text-sm text-red-600">
                            {formik.errors.program}
                          </p>
                        )} */}
                    <label className="text-sm">
                      Name and address of employer
                    </label>
                    <input
                      type="text"
                      required
                      id={`${employer["nameAddress"]}${index}`}
                      name={`${employer["nameAddress"]}${index}`}
                      onChange={(event) =>
                        employerFieldsChangeHandler(
                          event,
                          index,
                          buildEmployerFieldValue("nameAddress", index)
                        )
                      }
                      value={
                        employer[buildEmployerFieldValue("nameAddress", index)]
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
                    {/* {formik.errors.program && formik.touched.program && (
                          <p className="absolute top-0 left-0 text-sm text-red-600">
                            {formik.errors.program}
                          </p>
                        )} */}
                    <label className="text-sm">Designation</label>
                    <input
                      type="text"
                      id={`${employer["designation"]}${index}`}
                      name={`${employer["designation"]}${index}`}
                      onChange={(event) =>
                        employerFieldsChangeHandler(
                          event,
                          index,
                          buildEmployerFieldValue("designation", index)
                        )
                      }
                      value={
                        employer[buildEmployerFieldValue("designation", index)]
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
                    {/* {formik.errors.program && formik.touched.program && (
                          <p className="absolute top-0 left-0 text-sm text-red-600">
                            {formik.errors.program}
                          </p>
                        )} */}
                    <label className="text-sm">From</label>
                    <input
                      type="date"
                      id={`${employer["from"]}${index}`}
                      name={`${employer["from"]}${index}`}
                      onChange={(event) =>
                        employerFieldsChangeHandler(
                          event,
                          index,
                          buildEmployerFieldValue("from", index)
                        )
                      }
                      value={employer[buildEmployerFieldValue("from", index)]}
                      className="p-2 outline-none rounded border-[2px]
                        border-gray-500 focus:border-[2px] focus:border-primaryLight
                        transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div
                    className="relative pt-4 flex flex-col items-start 
                      justify-center gap-1"
                  >
                    {/* {formik.errors.program && formik.touched.program && (
                          <p className="absolute top-0 left-0 text-sm text-red-600">
                            {formik.errors.program}
                          </p>
                        )} */}
                    <label className="text-sm">To</label>
                    <input
                      type="date"
                      id={employer["to"]}
                      name={`${employer["to"]}${index}`}
                      onChange={(event) =>
                        employerFieldsChangeHandler(
                          event,
                          index,
                          buildEmployerFieldValue("to", index)
                        )
                      }
                      value={employer[buildEmployerFieldValue("to", index)]}
                      className="p-2 outline-none rounded border-[2px]
                        border-gray-500 focus:border-[2px] focus:border-primaryLight
                        transition-all text-sm w-full resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    {showEmployerAddButton(index) && (
                      <button
                        className="bg-gray-300 flex items-center justify-center px-4 
                       py-2 rounded mt-4 gap-4 text-primary w-full"
                        onClick={() => AddEmployerHandler()}
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
                    {showEmployerRemoveButton(index) && (
                      <button
                        className="bg-gray-300 flex items-center justify-center px-4 
                        py-2 rounded mt-4 gap-4 text-primary w-full"
                        onClick={() => removeEmployerHandler()}
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
