import { Navigate, Route } from "react-router-dom";
import PropTypes, { element } from "prop-types";

import { helper as $h } from "@/utils";
import Constants from "../constants/Constants";
import React from "react";

const AuthMiddleware = ({ component: Component, isAuthProtected, path, role }) => {
  const authUser = $h.getUserData();

  if (isAuthProtected && !authUser) {
    return <Navigate to="/login" />;
  }

  if (!isAuthProtected && authUser) {
    return handleAuthenticatedRoute(Component, path);
  }

  if (isAuthProtected && authUser) {
    return handleProtectedRoute(Component, path, role);
  }

  return <Component />;
};

const handleAuthenticatedRoute = (Component, path) => {
  const roleId = $h.getRoleId();

  if (
    roleId === Constants.ADMIN_ROLE_ID &&
    (path === "/" || path === "/login" || path === "/register")
  ) {
    return <Navigate to="/admin-panel" />;
  }

  if (
    roleId === Constants.USER_ROLE_ID &&
    (path === "/" || path === "/login" || path === "/register")
  ) {
    return <Navigate to="/dashboard" />;
  }

  return <Component />;
};

const handleProtectedRoute = (Component, path, role) => {
  const roleId = $h.getRoleId();
  // role = [1,2,3,4,5]
  const isRoleIdMatch = role.length ? role.includes(roleId) : false;

  // roleId === role;

  if (isRoleIdMatch) {
    return <CompanyValidation component={Component} path={path} />;
  }

  if (roleId === Constants.ADMIN_ROLE_ID && role === Constants.USER_ROLE_ID) {
    return <Navigate to="/admin-panel" />;
  }

  if (roleId === Constants.USER_ROLE_ID && role === Constants.ADMIN_ROLE_ID) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/error-page" />;
};

const CompanyValidation = ({ component: Component, path }) => {
  const companyParam = document.location.pathname.split("/")[1];

  if ($h.getCompanyName() === companyParam) {
    return <Component />;
  }

  if ($h.getCompanyName() === "") {
    return <Navigate to="/login" />;
  }

  if (companyParam === $h.removeSlash(path)) {
    window.location.pathname = `/${$h.getCompanyName()}${path}`;
  }

  return <Navigate to="/error-page" />;
};

AuthMiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  path: PropTypes.string,
  role: PropTypes.array
};

export default AuthMiddleware;
