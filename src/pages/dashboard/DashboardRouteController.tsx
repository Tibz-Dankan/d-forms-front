import React, { Fragment } from "react";
import { ApplicantList } from "../postgraduate/ApplicantList";
import { Routes, Route } from "react-router-dom";

export const DashboardRouteController: React.FC = () => {
  const routes = [
    {
      page: 1,
      element: <ApplicantList />,
      path: "/postgraduate/applicants",
    },
  ];

  return (
    <Fragment>
      <div>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Fragment>
  );
};
