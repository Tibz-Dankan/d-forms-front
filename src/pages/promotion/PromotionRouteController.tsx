import React, { Fragment } from "react";
import { Section1 } from "./Section1";
import { Section2 } from "./Section2";
import { Section3 } from "./Section3";
import { Section4 } from "./Section4";
import { Section5 } from "./Section5";
import { Section6 } from "./Section6";
import { Section7 } from "./Section7";
import { Section8 } from "./Section8";
import { Section9 } from "./Section9";
import { SectionSubmit } from "./SectionSubmit";

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
    {
      page: 7,
      element: <Section7 />,
      path: "/Section7",
    },
    {
      page: 8,
      element: <Section8 />,
      path: "/Section8",
    },
    {
      page: 9,
      element: <Section9 />,
      path: "/Section9",
    },
    {
      page: 10,
      element: <SectionSubmit />,
      path: "/section-submit",
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
