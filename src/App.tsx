import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import './App.css'
import 'react-lazy-load-image-component/src/effects/blur.css';
import Landing from "./page/Landing"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing/>,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;