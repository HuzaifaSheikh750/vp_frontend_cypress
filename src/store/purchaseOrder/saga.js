import {
  DELETE_PURCHASE_ORDER,
  GET_PURCHASE_ORDER,
  GET_SPECIFIC_PURCHASE_ORDER,
  POST_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER,
} from "./actionTypes";
import {
  addPurchaseOrderApi,
  deletePurchaseOrderApi,
  getPurchaseOrderApi,
  updatePurchaseOrderApi,
  updateReasoningCall,
} from "../../helpers/backend_helper";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  deletePurchaseOrderFail,
  deletePurchaseOrderSuccess,
  getPurchaseOrderFail,
  getPurchaseOrderSuccess,
  getSpecificPurchaseOrderFail,
  getSpecificPurchaseOrderSuccess,
  postPurchaseOrderFail,
  postPurchaseOrderSuccess,
  updatePurchaseOrderFail,
  updatePurchaseOrderSuccess,
} from "./actions";

function* fetchPurchaseOrder(action) {
  try {
    const response = yield call(getPurchaseOrderApi, action.payload);
    yield put(getPurchaseOrderSuccess(response.data));
  } catch (error) {
    yield put(getPurchaseOrderFail(error));
  }
}

function* postPurchaseOrder(action) {
  try {
    const response = yield call(addPurchaseOrderApi, action.payload);
    yield put(postPurchaseOrderSuccess(response));
  } catch (error) {
    yield put(postPurchaseOrderFail(error));
  }
}

function* updatePurchaseOrder(action) {
  try {
    const response = yield call(updatePurchaseOrderApi, action.payload);
    yield put(updatePurchaseOrderSuccess(response));
  } catch (error) {
    yield put(updatePurchaseOrderFail(error));
  }
}

function* deletePurchaseOrder(action) {
  try {
    const response = yield call(deletePurchaseOrderApi, action.payload);
    yield put(deletePurchaseOrderSuccess(response));
  } catch (error) {
    yield put(deletePurchaseOrderFail(error));
  }
}

function* fetchSpecificPurchaseOrder(action) {
  try {
    const response = yield call(getPurchaseOrderApi, action.payload);
    yield put(getSpecificPurchaseOrderSuccess(response));
  } catch (error) {
    yield put(getSpecificPurchaseOrderFail(error));
  }
}

function* purchaseOrderSaga() {
  yield takeEvery(GET_PURCHASE_ORDER, fetchPurchaseOrder);
  yield takeEvery(POST_PURCHASE_ORDER, postPurchaseOrder);
  yield takeEvery(UPDATE_PURCHASE_ORDER, updatePurchaseOrder);
  yield takeEvery(DELETE_PURCHASE_ORDER, deletePurchaseOrder);
  yield takeEvery(GET_SPECIFIC_PURCHASE_ORDER, fetchSpecificPurchaseOrder);
}

export default purchaseOrderSaga;
