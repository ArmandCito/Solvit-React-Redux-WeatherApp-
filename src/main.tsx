import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // makes the Redux store available to every component below it
import { store } from "./store/store"; // the single app-wide Redux store
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* Provider wraps the whole app so any component can use useAppSelector/useAppDispatch */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
