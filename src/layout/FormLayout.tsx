import React, { Fragment, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Progressbar } from "../UI/shared/Progressbar";
import { Header } from "./Header";

interface FormLayoutProps {
  headerTitle: ReactNode;
  headerTitleClassName?: string;
  children: ReactNode;
  footer: ReactNode;
  section: string;
  totalNumPages: number;
}

export const FormLayout: React.FC<FormLayoutProps> = (props) => {
  const [searchParams, _] = useSearchParams({
    page: "",
    section: "",
  });
  const currMaxPage = searchParams.get("currMaxPage");
  console.log("currMaxPage", currMaxPage);

  const progressPercentage = (): any => {
    if (!currMaxPage) return;
    const currentPage = parseInt(currMaxPage);
    const totalPages = props.totalNumPages;
    const percentage = Math.floor(((currentPage - 1) / totalPages) * 100);
    console.log("Progress", percentage + " %");
    return percentage;
  };

  // TODO: To calculate the progress percentage
  return (
    <Fragment>
      <div
        className="flex flex-col items-center justify-center
        bg-green-500s min-h-[100vh] h-auto w-[90%] md:w-[700px]
        gap-16 text-gray-800"
      >
        {/* header section */}
        <div className="w-full h-auto">
          <div className="mt-[340px] sm:mt-52">
            <Header />
          </div>
          <div
            //   className="text-gray-200 bg-secondary p-4 font-bold
            // text-center rounded text-xl"
            className={twMerge(
              `text-gray-200 bg-secondary p-4 font-bold 
             text-center rounded text-xl`,
              props.headerTitleClassName
            )}
          >
            {props.headerTitle}
          </div>
        </div>
        {/* Progress section */}
        <div className="w-full space-y-2">
          <div className="w-full flex items-center justify-between">
            <p className="first-letter: uppercase text-lg font-semibold">
              {props.section}
            </p>
            <p
              // className="border-[1px] border-gray-300 bg-primary
              //  rounded px-4 py-2 text-gray-50"
              className="border-[1px] border-gray-300 bg-gray-100
              rounded px-4 py-2 text-gray-700 font-semibold"
            >
              <span className="mr-2">Progress:</span>
              <span>{progressPercentage()}%</span>
            </p>
          </div>
          {/* <Progressbar completed={60} /> */}
          <Progressbar completed={progressPercentage()} />
        </div>
        {/* main content section */}
        <div className="w-full">{props.children}</div>
        {/* footer section */}
        <div>{props.footer}</div>
      </div>
    </Fragment>
  );
};
