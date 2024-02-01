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
import CreatePost from "./page/CreatePost";
import EditProfile from "./page/EditProfile";
import SearchPage from "./page/SearchPage";
import CreatedTab from "./components/ArtMuseum/UserProfile/CreatedTab";
import SavedTab from "./components/ArtMuseum/UserProfile/SavedTab";
import 'react-toastify/dist/ReactToastify.min.css';
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
          children: [
            {
              path: "created",
              element: <CreatedTab />,
            },
            {
              path: "saved",
              element: <SavedTab sortConfig={{sortBy:"popular,-1"}}/>,
            },
          ],
        },
        {
          path: "createInspiration",
          element: (
            <Protected>
              <CreatePost />
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
        {
          path: "editProfile",
          element: <EditProfile />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
