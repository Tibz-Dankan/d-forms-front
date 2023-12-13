import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  hideCardNotification,
  showCardNotification,
} from "../../store/actions/notification";
import { getPostgraduateApplicants } from "../../API/postgraduate";
import { ApplicantCard } from "../../UI/postgraduate/ApplicantCard";

export const ApplicantList: React.FC = () => {
  const [applicants, setApplicants] = useState([]);

  const dispatch: any = useDispatch();

  const { isLoading } = useQuery(
    ["postgraduate-applicants"],
    getPostgraduateApplicants,
    {
      onSuccess: (response: any) => {
        console.log("response", response);
        setApplicants(() => response.data);
      },
      onError: (error: any) => {
        dispatch(
          showCardNotification({ type: "error", message: error.message })
        );
        setTimeout(() => {
          dispatch(hideCardNotification());
        }, 5000);
      },
    }
  );

  if (isLoading)
    return (
      <div
        className="flex items-center justify-center 
        w-full min-h-[100vh] text-2xl"
      >
        Loading ...
      </div>
    );

  return (
    <Fragment>
      <div className="w-full min-h-[100vh]">
        <div
          className="bg-gray-50 text-gray-800 flex 
          items-center justify-center shadow-sm p-4 gap-3
           text-lg mb-6"
        >
          <span className="first-letter:uppercase">surname</span>
          <span className="first-letter:uppercase">givenname</span>
          <span className="first-letter:uppercase">campus</span>
          <span className="first-letter:uppercase">program</span>
          <span className="first-letter:uppercase">Applied On</span>
        </div>
        {applicants?.map((applicant: any, index) => (
          <div key={index}>
            <ApplicantCard
              surname={applicant.surname}
              givenname={applicant.givenname}
              campus={applicant.campus}
              program={applicant.program}
              createdAt={applicant.createdAt}
            />
          </div>
        ))}
      </div>
    </Fragment>
  );
};
