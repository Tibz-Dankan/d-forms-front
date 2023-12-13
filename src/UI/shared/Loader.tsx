import React, { Fragment } from "react";
import { twMerge } from "tailwind-merge";

interface LoaderProps {
  label?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <Fragment>
      <div
        className={twMerge(
          `h-10 bg-primaryDark rounded-md relative 
          before:border-4 before:border-solid before:border-gray-400
          before:border-r-4 before:border-r-gray-100 before:w-[24px] 
          before:h-[24px] before:rounded-[50%] before:absolute before:top-2
          before:left-4 before:animate-rotate`,
          props.className
        )}
      >
        <span className="text-gray-light-1 absolute top-2 left-12 font-bold">
          {props?.label && props.label + "..."}
        </span>
      </div>
    </Fragment>
  );
};
