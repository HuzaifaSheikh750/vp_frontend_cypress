import {
  DELETE_INVOICE,
  GET_INVOICE,
  GET_SPECIFIC_INVOICE,
  POST_INVOICE,
  UPDATE_INVOICE,
} from "./actionTypes";
import {
  addInvoiceApi,
  deleteInvoiceApi,
  getInvoiceApi,
  updateInvoiceApi,
} from "../../helpers/backend_helper";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteInvoiceFail,
  deleteInvoiceSuccess,
  getInvoiceFail,
  getInvoiceSuccess,
  getSpecificInvoiceFail,
  getSpecificInvoiceSuccess,
  postInvoiceFail,
  postInvoiceSuccess,
  updateInvoiceFail,
  updateInvoiceSuccess,
} from "./actions";

function* fetchInvoice(action) {
  try {
    const response = yield call(getInvoiceApi, action.payload);
    yield put(getInvoiceSuccess(response.data));
  } catch (error) {
    yield put(getInvoiceFail(error));
  }
}

function* postInvoice(action) {
  try {
    const response = yield call(addInvoiceApi, action.payload);
    yield put(postInvoiceSuccess(response));
  } catch (error) {
    yield put(postInvoiceFail(error));
  }
}

function* updateInvoice(action) {
  try {
    const response = yield call(updateInvoiceApi, action.payload);
    yield put(updateInvoiceSuccess(response));
  } catch (error) {
    yield put(updateInvoiceFail(error));
  }
}

function* deleteInvoice(action) {
  try {
    const response = yield call(deleteInvoiceApi, action.payload);
    yield put(deleteInvoiceSuccess(response));
  } catch (error) {
    yield put(deleteInvoiceFail(error));
  }
}

function* fetchSpecificInvoice(action) {
  try {
    const response = yield call(getInvoiceApi, action.payload);
    yield put(getSpecificInvoiceSuccess(response));
  } catch (error) {
    yield put(getSpecificInvoiceFail(error));
  }
}

function* invoiceSaga() {
  yield takeEvery(GET_INVOICE, fetchInvoice);
  yield takeEvery(POST_INVOICE, postInvoice);
  yield takeEvery(UPDATE_INVOICE, updateInvoice);
  yield takeEvery(DELETE_INVOICE, deleteInvoice);
  yield takeEvery(GET_SPECIFIC_INVOICE, fetchSpecificInvoice);
}

export default invoiceSaga;
