import React, { Fragment, ReactNode } from "react";
// import { Progressbar } from "../UI/shared/Progressbar";

interface FormLayoutProps {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  section: string;
}

export const FormLayout: React.FC<FormLayoutProps> = (props) => {
  return (
    <Fragment>
      <div
        className="flex flex-col items-center justify-center
        bg-green-500s min-h-[100vh] h-auto w-[80vh] md:w-[700px]
        gap-16 text-gray-800"
      >
        {/* header section */}
        <div>{props.header}</div>
        {/* Progress section */}
        <div className="w-full space-y-2">
          <div
            className="w-full flex items-center justify-between
           bg-blue-500s"
          >
            <span className="first-letter: uppercase text-lg font-semibold">
              {props.section}
            </span>
            <span
              className="border-[1px] border-gray-300 bg-primary
               rounded px-4 py-2 text-gray-50"
            >
              {"60"}%
            </span>
          </div>
          {/* temporary div, To be removed */}
          <div className="h-[6px] w-full bg-primary rounded" />
          {/* <Progressbar completed={60} /> */}
        </div>
        {/* main content section */}
        <div>{props.children}</div>
        {/* footer section */}
        <div>{props.footer}</div>
      </div>
    </Fragment>
  );
};
