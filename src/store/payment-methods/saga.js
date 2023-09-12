import {
  ADD_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  GET_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD
} from "./actionTypes";
import {
  addPaymentMethodApi,
  deletePaymentMethodApi,
  getPaymentMethodApi,
  updatePaymentMethodApi
} from "../../helpers/backend_helper";
import {
  addPaymentMethodFail,
  addPaymentMethodSuccess,
  deletePaymentMethodFail,
  deletePaymentMethodSuccess,
  getPaymentMethodFail,
  getPaymentMethodSuccess,
  updatePaymentMethodFail,
  updatePaymentMethodSuccess
} from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getPaymentMethodSaga(action) {
  try {
    const response = yield call(getPaymentMethodApi, action.payload);
    yield put(getPaymentMethodSuccess(response?.data));
  } catch (error) {
    yield put(getPaymentMethodFail(error));
  }
}

function* updatePaymentMethodSaga(action) {
  try {
    const response = yield call(updatePaymentMethodApi, action.payload);
    yield put(updatePaymentMethodSuccess(response));
  } catch (error) {
    yield put(updatePaymentMethodFail(error));
  }
}

function* addPaymentMethodSaga(action) {
  try {
    const response = yield call(addPaymentMethodApi, action.payload);
    yield put(addPaymentMethodSuccess(response));
  } catch (error) {
    yield put(addPaymentMethodFail(error));
  }
}

function* deletePaymentMethodSaga(action) {
  try {
    const response = yield call(deletePaymentMethodApi, action.payload);
    yield put(deletePaymentMethodSuccess(response));
  } catch (error) {
    yield put(deletePaymentMethodFail(error));
  }
}

function* PaymentMethodSaga() {
  yield takeLatest(GET_PAYMENT_METHOD, getPaymentMethodSaga);
  yield takeLatest(UPDATE_PAYMENT_METHOD, updatePaymentMethodSaga);
  yield takeLatest(ADD_PAYMENT_METHOD, addPaymentMethodSaga);
  yield takeLatest(DELETE_PAYMENT_METHOD, deletePaymentMethodSaga);
}

export default PaymentMethodSaga;
