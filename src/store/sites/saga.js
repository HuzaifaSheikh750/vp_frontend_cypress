import {
  ADD_SITES,
  DELETE_SITES,
  GET_SITES,
  GET_SPECIFIC_SITES,
  UPDATE_SITES
} from "./actionTypes";
import {
  addSitesApi,
  deleteSitesApi,
  getSitesApi,
  updateSitesApi
} from "../../helpers/backend_helper";
import {
  addSitesFail,
  addSitesSuccess,
  deleteSitesFail,
  deleteSitesSuccess,
  getSitesFail,
  getSitesSuccess,
  getSpecificSitesFail,
  getSpecificSitesSuccess,
  updateSitesFail,
  updateSitesSuccess
} from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getSitesSaga(action) {
  try {
    const response = yield call(getSitesApi, action.payload);
    yield put(getSitesSuccess(response?.data));
  } catch (error) {
    yield put(getSitesFail(error));
  }
}

function* updateSitesSaga(action) {
  try {
    const response = yield call(updateSitesApi, action.payload);
    yield put(updateSitesSuccess(response));
  } catch (error) {
    yield put(updateSitesFail(error));
  }
}

function* addSitesSaga(action) {
  try {
    const response = yield call(addSitesApi, action.payload);
    yield put(addSitesSuccess(response));
  } catch (error) {
    yield put(addSitesFail(error));
  }
}

function* deleteSitesSaga(action) {
  try {
    const response = yield call(deleteSitesApi, action.payload);
    yield put(deleteSitesSuccess(response));
  } catch (error) {
    yield put(deleteSitesFail(error));
  }
}

function* fetchSpecificSitesSaga(action) {
  try {
    const response = yield call(getSitesApi, action.payload);
    yield put(getSpecificSitesSuccess(response));
  } catch (error) {
    yield put(getSpecificSitesFail(error));
  }
}

function* SitesSaga() {
  yield takeLatest(GET_SITES, getSitesSaga);
  yield takeLatest(UPDATE_SITES, updateSitesSaga);
  yield takeLatest(ADD_SITES, addSitesSaga);
  yield takeLatest(DELETE_SITES, deleteSitesSaga);
  yield takeLatest(GET_SPECIFIC_SITES, fetchSpecificSitesSaga);
}

export default SitesSaga;
