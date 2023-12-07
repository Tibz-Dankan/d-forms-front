import React from "react";
import { ReduxProvider } from "./ReduxProvider";

interface AppProvidersProps {
  children: JSX.Element;
}

export const AppProviders: React.FC<AppProvidersProps> = (props) => {
  return <ReduxProvider>{props.children}</ReduxProvider>;
};
