import React, { Fragment } from "react";
import { Section1 } from "./Section1";
import { Section1x } from "./Section1x";
import { Routes, Route } from "react-router-dom";

export const PostgraduateRouteController: React.FC = () => {
  const routes = [
    {
      page: 1,
      element: <Section1 />,
      path: "/section1",
    },
    {
      page: 2,
      element: <Section1x />,
      path: "/section1x",
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
