import React, { Fragment } from "react";
import { Section1 } from "./Section1";
import { Section1x } from "./Section1x";
import { Section2 } from "./Section2";
import { Section3 } from "./Section3";
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
    {
      page: 3,
      element: <Section2 />,
      path: "/section2",
    },
    {
      page: 3,
      element: <Section3 />,
      path: "/section3",
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
