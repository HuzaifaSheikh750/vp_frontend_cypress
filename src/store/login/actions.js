import {
  API_ERROR,
  AZURE_LOGIN_ERROR,
  AZURE_LOGIN_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_USER,
  LOGIN_WITH_AZURE,
  LOGIN_WITH_AZURE_ERROR,
  LOGIN_WITH_AZURE_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS
} from "./actionTypes";

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history }
  };
};

export const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user
  };
};

export const logoutUser = (navigate) => {
  return {
    type: LOGOUT_USER,
    payload: navigate
  };
};

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {}
  };
};

export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: error
  };
};

export const loginWithAzure = (history) => {
  return {
    type: LOGIN_WITH_AZURE,
    payload: history
  };
};

export const loginWithAzureSuccess = (user) => {
  return {
    type: LOGIN_WITH_AZURE_SUCCESS,
    payload: user
  };
};

export const loginWithAzureError = (error) => {
  return {
    type: LOGIN_WITH_AZURE_ERROR,
    payload: error
  };
};

export const azureLoginResponseSuccess = (response) => {
  return {
    type: AZURE_LOGIN_SUCCESS,
    payload: response
  };
};

export const azureLoginResponseError = (error) => {
  return {
    type: AZURE_LOGIN_ERROR,
    payload: error
  };
};
