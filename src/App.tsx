import React, { Fragment, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Notification } from "./UI/shared/Notifiication";
import { hideCardNotification } from "./store/actions/notification";
import { TNotificationState } from "./types/notification";
import "./App.css";
// import { Section1 } from "./pages/employment/Section1";
import { EmploymentRouteController } from "./pages/employment/EmploymentRouteController";

const App: React.FC = () => {
  const dispatch: any = useDispatch();

  const notification = useSelector(
    (state: TNotificationState) => state.notification
  );

  const closeCardHandler = () => {
    dispatch(hideCardNotification());
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(hideCardNotification());
    }, 4000);
  }, [dispatch]);

  return (
    <div className="bg-gray-50">
      <Router>
        <Fragment>
          {notification.showCardNotification && (
            <Notification
              type={notification.cardNotificationType}
              message={notification.cardMessage}
              onClose={closeCardHandler}
            />
          )}
          <Routes>
            <Route path="/" element={<div>Home Page here</div>} />
            <Route
              path="/employment/*"
              element={<EmploymentRouteController />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Fragment>
      </Router>
    </div>
  );
};

export default App;
