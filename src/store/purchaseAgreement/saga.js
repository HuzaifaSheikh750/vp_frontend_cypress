import {
  DELETE_PURCHASE_AGREEMENT,
  GET_PURCHASE_AGREEMENT,
  GET_SPECIFIC_PURCHASE_AGREEMENT,
  POST_PURCHASE_AGREEMENT,
  UPDATE_PURCHASE_AGREEMENT
} from "./actionTypes";
import {
  addPurchaseAgreementCall,
  deletePurchaseAgreementCall,
  getPurchaseAgreementCall,
  updatePurchaseAgreementCall
} from "../../helpers/backend_helper";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  deletePurchaseAgreementFail,
  deletePurchaseAgreementSuccess,
  getPurchaseAgreementFail,
  getPurchaseAgreementSuccess,
  getSpecificPurchaseAgreementFail,
  getSpecificPurchaseAgreementSuccess,
  postPurchaseAgreementFail,
  postPurchaseAgreementSuccess,
  updatePurchaseAgreementFail,
  updatePurchaseAgreementSuccess
} from "./actions";

function* fetchPurchaseAgreement(action) {
  try {
    const response = yield call(getPurchaseAgreementCall, action.payload);
    yield put(getPurchaseAgreementSuccess(response.data));
  } catch (error) {
    yield put(getPurchaseAgreementFail(error));
  }
}

function* postPurchaseAgreement(action) {
  try {
    const response = yield call(addPurchaseAgreementCall, action.payload);
    yield put(postPurchaseAgreementSuccess(response));
  } catch (error) {
    yield put(postPurchaseAgreementFail(error));
  }
}

function* updatePurchaseAgreement(action) {
  try {
    const response = yield call(updatePurchaseAgreementCall, action.payload);
    yield put(updatePurchaseAgreementSuccess(response));
  } catch (error) {
    yield put(updatePurchaseAgreementFail(error));
  }
}

function* deletePurchaseAgreement(action) {
  try {
    const response = yield call(deletePurchaseAgreementCall, action.payload);
    yield put(deletePurchaseAgreementSuccess(response));
  } catch (error) {
    yield put(deletePurchaseAgreementFail(error));
  }
}

function* fetchSpecificPurchaseAgreement(action) {
  try {
    const response = yield call(getPurchaseAgreementCall, action.payload);
    yield put(getSpecificPurchaseAgreementSuccess(response));
  } catch (error) {
    yield put(getSpecificPurchaseAgreementFail(error));
  }
}

function* purchaseAgreementSaga() {
  yield takeEvery(GET_PURCHASE_AGREEMENT, fetchPurchaseAgreement);
  yield takeEvery(POST_PURCHASE_AGREEMENT, postPurchaseAgreement);
  yield takeEvery(UPDATE_PURCHASE_AGREEMENT, updatePurchaseAgreement);
  yield takeEvery(DELETE_PURCHASE_AGREEMENT, deletePurchaseAgreement);
  yield takeEvery(GET_SPECIFIC_PURCHASE_AGREEMENT, fetchSpecificPurchaseAgreement);
}

export default purchaseAgreementSaga;
