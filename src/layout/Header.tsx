import React, { Fragment } from "react";
import logo from "../assets/logo.png";

export const Header: React.FC = () => {
  return (
    <Fragment>
      <header className="w-full h-auto p-4 shadow absolute top-0 left-0">
        <div
          className="flex flex-col justify-center items-center 
           sm:flex-row"
        >
          <img src={logo} alt="logo" className="w-auto h-32" />
          <div className="space-y-2 inline-block">
            <h1
              className="text-3xl w-auto sm:w-80 font-semibold uppercase 
               mt-0 text-center sm:text-start"
            >
              Uganda Christian University
            </h1>
            <p className="text-primary text-center sm:text-start">
              A center of Excellence in the Heart of Africa
            </p>
          </div>
        </div>
      </header>
    </Fragment>
  );
};
