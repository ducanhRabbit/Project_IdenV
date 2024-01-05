import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import './App.css'
import 'react-lazy-load-image-component/src/effects/blur.css';
import Landing from "./page/Landing"
import Auth from "./page/Auth";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing/>,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;