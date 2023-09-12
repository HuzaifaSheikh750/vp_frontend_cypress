import "./assets/css/app.css";

import React, { StrictMode } from "react";

import App from "./App";
import { Provider } from "react-redux";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import store from "./store";

const root = createRoot(document.getElementById("root"));

const currentPath = document.location.pathname.split("/")[1];

const basename = currentPath;
root.render(
  <RecoilRoot>
    <Provider store={store}>
      <React.Fragment>
        <Router basename={basename}>
          <App />
        </Router>
      </React.Fragment>
    </Provider>
  </RecoilRoot>
);
