import React, { Fragment } from "react";
import { Section1 } from "./Section1";
import { Section2 } from "./Section2";

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
