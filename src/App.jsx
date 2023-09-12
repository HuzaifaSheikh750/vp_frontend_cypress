import { Route, Routes } from "react-router-dom";
import { authProtectedRoutes, publicRoutes } from "./router";

import AuthMiddleware from "./router/route";
import PropTypes from "prop-types";
import React from "react";
import SideMenu from "./layouts/side-menu/Main";

const App = (props) => {
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => {
          return (
            <Route
              key={idx}
              exact
              path={route.path}
              element={
                <AuthMiddleware
                  component={route.component}
                  key={idx}
                  isAuthProtected={false}
                  path={route.path}
                  exact
                  role={[]}
                />
              }
            />
          );
        })}
        {authProtectedRoutes.map((route, idx) => {
          return (
            <Route path="/" key={idx} element={<SideMenu />}>
              <Route
                exact
                path={route.path}
                element={
                  <AuthMiddleware
                    component={route.component}
                    isAuthProtected={true}
                    path={route.path}
                    role={route.role}
                  />
                }
              />
            </Route>
          );
        })}
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

export default App;
