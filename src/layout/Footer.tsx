import React, { Fragment } from "react";
// import logo from "../assets/logo.png";

export const Footer: React.FC = () => {
  return (
    <Fragment>
      <div
        className="w-full border-t-[1px] border-gray-300 py-8
         flex justify-center pb-16"
      >
        {/* <div
          className="flex flex-col justify-center items-center 
          sm:flex-row"
        >
          <img src={logo} alt="logo" className="w-auto h-32" />
          <div className="space-y-2 inline-block">
            <h1
              className="text-2xl w-auto sm:w-80 font-semibold uppercase 
               mt-0 text-center sm:text-start"
            >
              Uganda Christian University
            </h1>
            <p className="text-primary text-center sm:text-start">
              A center of Excellence in the Heart of Africa
            </p>
          </div>
        </div> */}
        {/* <div className="flex flex-col items-start justify-center">
          <span>P.O. Box 4, Mukono, Uganda</span>
          <span>Tel: (Off) +256312350880</span>
          <span>(Mob) +256772770826</span>
          <span>Fax: 256-41-290800</span>
          <span>E-mail: admissions@ucu.ac.ug</span>
          <span>Website: www.ucu.ac.ug</span>
        </div> */}
        <div className="">
          <span>UCU&copy;Copyright {new Date().getFullYear()}.</span>
          <span className="ml-2">All rights reserved</span>
        </div>
      </div>
    </Fragment>
  );
};
