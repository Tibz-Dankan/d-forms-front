import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import { AppThemeProvider } from "./ThemeProvider";

interface AppProvidersProps {
  children: JSX.Element;
}

export const AppProviders: React.FC<AppProvidersProps> = (props) => {
  return (
    <ReduxProvider>
      <AppThemeProvider>{props.children}</AppThemeProvider>
    </ReduxProvider>
  );
};
