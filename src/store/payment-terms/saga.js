import {
  ADD_PAYMENT_TERM,
  DELETE_PAYMENT_TERM,
  GET_PAYMENT_TERM,
  UPDATE_PAYMENT_TERM
} from "./actionTypes";
import {
  addPaymentTermApi,
  deletePaymentTermApi,
  getPaymentTermApi,
  updatePaymentTermApi
} from "../../helpers/backend_helper";
import {
  addPaymentTermFail,
  addPaymentTermSuccess,
  deletePaymentTermFail,
  deletePaymentTermSuccess,
  getPaymentTermFail,
  getPaymentTermSuccess,
  updatePaymentTermFail,
  updatePaymentTermSuccess
} from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getPaymentTermSaga(action) {
  try {
    const response = yield call(getPaymentTermApi, action.payload);
    yield put(getPaymentTermSuccess(response?.data));
  } catch (error) {
    yield put(getPaymentTermFail(error));
  }
}

function* updatePaymentTermSaga(action) {
  try {
    const response = yield call(updatePaymentTermApi, action.payload);
    yield put(updatePaymentTermSuccess(response));
  } catch (error) {
    yield put(updatePaymentTermFail(error));
  }
}

function* addPaymentTermSaga(action) {
  try {
    const response = yield call(addPaymentTermApi, action.payload);
    yield put(addPaymentTermSuccess(response));
  } catch (error) {
    yield put(addPaymentTermFail(error));
  }
}

function* deletePaymentTermSaga(action) {
  try {
    const response = yield call(deletePaymentTermApi, action.payload);
    yield put(deletePaymentTermSuccess(response));
  } catch (error) {
    yield put(deletePaymentTermFail(error));
  }
}

function* PaymentTermSaga() {
  yield takeLatest(GET_PAYMENT_TERM, getPaymentTermSaga);
  yield takeLatest(UPDATE_PAYMENT_TERM, updatePaymentTermSaga);
  yield takeLatest(ADD_PAYMENT_TERM, addPaymentTermSaga);
  yield takeLatest(DELETE_PAYMENT_TERM, deletePaymentTermSaga);
}

export default PaymentTermSaga;
