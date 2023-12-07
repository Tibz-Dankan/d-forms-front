import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Fragment>
          <Routes>
            <Route
              path="/"
              element={
                <div className="text-gray-100 bg-primary">D-forms app</div>
              }
            />
            <Route path="/" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Fragment>
      </Router>
    </div>
  );
};

export default App;
