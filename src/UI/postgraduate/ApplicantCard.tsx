import React, { Fragment } from "react";
import { formattedDate } from "../../utils/formatDate";

interface ApplicantCardProps {
  surname: string;
  givenname: string;
  campus: string;
  program: string;
  createdAt: string;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = (props) => {
  return (
    <Fragment>
      <div
        className="bg-gray-50 text-gray-800 flex 
        items-center justify-center shadow-sm p-4 gap-3
        text-sm"
      >
        <span>{props.surname}</span>
        <span>{props.givenname}</span>
        <span>{props.campus}</span>
        <span>{props.program}</span>
        <span>{formattedDate(props.createdAt)}</span>
      </div>
    </Fragment>
  );
};
