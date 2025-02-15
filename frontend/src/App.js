import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error";
import EventsRootLayout from "./pages/EventsRoot";
import HomePage from "./pages/HomePage";
import RootLayout from "./pages/Root";

import { lazy } from "react";
import StyledSuspense from "./components/StyledSuspense";
import { checkAuthLoader, tokenLoader } from "./util/auth";

const EventsPage = lazy(() => import("./pages/Events"));
const AuthenticationPage = lazy(() => import("./pages/Authentication"));
const NewsletterPage = lazy(() => import("./pages/Newsletter"));
const EventDetailsPage = lazy(() => import("./pages/EventDetails"));
const NewEventPage = lazy(() => import("./pages/NewEvent"));
const EditEventPage = lazy(() => import("./pages/EditEvent"));

function lazyLoader(path, funcName = "loader") {
  return ({ request, params }) =>
    import(`${path}`).then((module) => module[funcName]({ request, params }));
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "events",
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: (
              <StyledSuspense>
                <EventsPage />
              </StyledSuspense>
            ),
            loader: lazyLoader("./pages/Events"),
          },
          {
            path: ":eventId",
            id: "event-detail",
            loader: lazyLoader("./pages/EventDetails"),
            children: [
              {
                index: true,
                element: (
                  <StyledSuspense>
                    <EventDetailsPage />
                  </StyledSuspense>
                ),
                action: lazyLoader("./pages/EventDetails", "action"),
              },
              {
                path: "edit",
                element: (
                  <StyledSuspense>
                    <EditEventPage />
                  </StyledSuspense>
                ),
                action: lazyLoader("./components/EventForm", "action"),
                loader: checkAuthLoader,
              },
            ],
          },
          {
            path: "new",
            element: (
              <StyledSuspense>
                <NewEventPage />
              </StyledSuspense>
            ),
            action: lazyLoader("./components/EventForm", "action"),
            loader: checkAuthLoader,
          },
        ],
      },
      {
        path: "auth",
        element: (
          <StyledSuspense>
            <AuthenticationPage />
          </StyledSuspense>
        ),
        action: lazyLoader("./pages/Authentication", "action"),
      },
      {
        path: "newsletter",
        element: (
          <StyledSuspense>
            <NewsletterPage />
          </StyledSuspense>
        ),
        action: lazyLoader("./pages/Newsletter", "action"),
      },
      {
        path: "logout",
        action: lazyLoader("./pages/Logout", "action"),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
