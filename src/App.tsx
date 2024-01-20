import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import Landing from "./page/Landing";
import Auth from "./page/Auth";
import ArtMuseum from "./page/ArtMuseum";
import HomeGallery from "./page/HomeGallery";
import Protected from "./components/shared/Protected";
import UserProfile from "./page/UserProfile";
import moment from "moment";
import DetailArt from "./page/DetailArt";

function App() {

  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "just now",
      ss: "%d s",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      w: "1w",
      ww: "%dw",
      M: "1mon",
      MM: "%dmon",
      y: "1y",
      yy: "%dy",
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/artMuseum",
      element: <ArtMuseum />,
      children: [
        {
          path: "",
          element: <HomeGallery />,
        },
        {
          path: "profile/:id",
          element: (
            <Protected>
              <UserProfile />
            </Protected>
          ),
        },
        {
          path: "inspiration/:id",
          element: (
            <Protected>
              <DetailArt />
            </Protected>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
