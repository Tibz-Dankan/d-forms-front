import React, { Fragment } from "react";
import { Section1 } from "./Section1";
import { Section2 } from "./Section2";
import { Section3 } from "./Section3";
import { Section4 } from "./Section4";
import { Section5 } from "./Section5";
import { Section6 } from "./Section6";

import { Routes, Route } from "react-router-dom";

export const PromotionRouteController: React.FC = () => {
  const routes = [
    {
      page: 1,
      element: <Section1 />,
      path: "/section1",
    },
    {
      page: 2,
      element: <Section2 />,
      path: "/section2",
    },
    {
      page: 3,
      element: <Section3 />,
      path: "/Section3",
    },
    {
      page: 4,
      element: <Section4 />,
      path: "/Section4",
    },
    {
      page: 5,
      element: <Section5 />,
      path: "/Section5",
    },
    {
      page: 6,
      element: <Section6 />,
      path: "/Section6",
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
