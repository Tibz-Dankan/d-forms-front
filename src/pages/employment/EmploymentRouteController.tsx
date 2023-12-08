import React, { Fragment } from "react";
import { Section1 } from "./Section1";
import { Section2 } from "./Section2";
import { Routes, Route } from "react-router-dom";

export const EmploymentRouteController: React.FC = () => {
  //   const [searchParams, _] = useSearchParams({
  //     page: "",
  //     section: "",
  //   });

  //   const page = searchParams.get("page");

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

  //   if (!page) return <Section1 />;

  return (
    <Fragment>
      <div>
        <Routes>
          {routes.map((route, _) => (
            // <div key={index}>
            <Route path={route.path} element={route.element} />
            // </div>
          ))}
        </Routes>
      </div>
    </Fragment>
  );
};
