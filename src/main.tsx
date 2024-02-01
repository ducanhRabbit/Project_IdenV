import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./redux/configStore";
import type {} from "@mui/lab/themeAugmentation";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StyledEngineProvider>
    <Provider store={store}>
      <CssBaseline/>
      <App />
    </Provider>
    </StyledEngineProvider>
  </QueryClientProvider>
);
