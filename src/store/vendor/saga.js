import { GET_VENDOR_LIST, GET_VENDOR_LIST_FAIL, GET_VENDOR_LIST_SUCCESS } from "./actionTypes";
import { call, put, takeEvery } from "redux-saga/effects";
import { getVendorListFail, getVendorListSuccess } from "./actions";

import { getVendorApi } from "@/helpers/backend_helper";

function* fetchVendorList(action) {
  try {
    const response = yield call(getVendorApi, action.payload);
    yield put(getVendorListSuccess(response.data));
  } catch (error) {
    yield put(getVendorListFail(error));
  }
}

function* vendorSaga() {
  yield takeEvery(GET_VENDOR_LIST, fetchVendorList);
}

export default vendorSaga;
