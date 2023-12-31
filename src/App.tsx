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
import { EmploymentRouteController } from "./pages/employment/EmploymentRouteController";
import { PostgraduateRouteController } from "./pages/postgraduate/PostgraduateRouteController";
import { DashboardRouteController } from "./pages/dashboard/DashboardRouteController";
import { PromotionRouteController } from "./pages/promotion/PromotionRouteController";
import { updateProgress } from "./store/actions/progress";

const App: React.FC = () => {
  const dispatch: any = useDispatch();

  const notification = useSelector(
    (state: TNotificationState) => state.notification
  );

  useEffect(() => {
    const tryUpdateProgress = () => {
      const stringifiedProgress = localStorage.getItem("progress");
      const parsedProgress =
        stringifiedProgress && JSON.parse(stringifiedProgress);

      if (!parsedProgress) return;

      console.log("parsedProgress", parsedProgress);
      const { currentMaxPage } = parsedProgress;

      if (!currentMaxPage) return;
      dispatch(updateProgress({ currentMaxPage: currentMaxPage }));
    };
    tryUpdateProgress();
  }, [dispatch]);

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
              path="/postgraduate/*"
              element={<PostgraduateRouteController />}
            />
            <Route
              path="/employment/*"
              element={<EmploymentRouteController />}
            />
            <Route path="/promotion/*" element={<PromotionRouteController />} />
            <Route path="/dashboard/*" element={<DashboardRouteController />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Fragment>
      </Router>
    </div>
  );
};

export default App;
