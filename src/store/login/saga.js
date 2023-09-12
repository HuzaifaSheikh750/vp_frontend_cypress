import { LOGIN_USER, LOGIN_WITH_AZURE, LOGOUT_USER } from "./actionTypes";
import { Login, LogintoAzure, postAzureLogin } from "../../helpers/backend_helper";
import {
  apiError,
  azureLoginResponseError,
  azureLoginResponseSuccess,
  loginSuccess,
  loginWithAzureError,
  loginWithAzureSuccess
} from "./actions";
import { call, put, takeEvery } from "redux-saga/effects";

import { helper as $h } from "@/utils";
import Constants from "@/constants/Constants";
import toastr from "toastr";

// import { helpers as $h } from "@/utils/helper";

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(Login, {
      username: user.email,
      password: user.password
    });
    if (response?.token) {
      localStorage.setItem(Constants.ACCESS_TOKEN, response.token);
      localStorage.setItem(Constants.AUTH_USER, JSON.stringify(response.user));
      localStorage.setItem(Constants.ROLE, JSON.stringify(response.user.role));
      localStorage.setItem(Constants.COMPANY_NAME, "kaispe");
      history($h.toHome());
      yield put(loginSuccess(response));
    } else {
      yield put(loginError(response));
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* loginWithAzure({ payload: history }) {
  try {
    const response = yield call(LogintoAzure);
    if (response?.errorCode === "user_cancelled") {
      yield put(loginWithAzureError(response));
    } else if (response?.errorCode === "interaction_in_progress") {
      yield put(loginWithAzureError(response));
    } else {
      yield put(loginWithAzureSuccess(response));

      const backendResponse = yield call(postAzureLogin, response);

      if (backendResponse?.accessToken && backendResponse?.azure_data) {
        localStorage.setItem("authUser", JSON.stringify(backendResponse));
        history("/admin-panel");
      } else if (backendResponse?.message) {
        toastr.error(backendResponse.message, "Error");
      }
    }
  } catch (error) {
    yield put(loginWithAzureError(error));
  }
}

function* logoutUser({ payload }) {
  try {
    // remove above values from local storage
    localStorage.removeItem(Constants.ACCESS_TOKEN);
    localStorage.removeItem(Constants.AUTH_USER);
    localStorage.removeItem(Constants.ROLE);
    localStorage.removeItem(Constants.COMPANY_NAME);
    // redirect to login page

    yield payload("/login");
    // clean saga and redux store
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
  yield takeEvery(LOGIN_WITH_AZURE, loginWithAzure);
}

export default authSaga;
