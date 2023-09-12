import {
  ADD_CURRENCY_CODE,
  DELETE_CURRENCY_CODE,
  GET_CURRENCY_CODE,
  UPDATE_CURRENCY_CODE
} from "./actionTypes";
import {
  addCurrencyCodeApi,
  deleteCurrencyCodeApi,
  getCurrencyCodeApi,
  updateCurrencyCodeApi
} from "../../helpers/backend_helper";
import {
  addCurrencyCodeFail,
  addCurrencyCodeSuccess,
  deleteCurrencyCodeFail,
  deleteCurrencyCodeSuccess,
  getCurrencyCodeFail,
  getCurrencyCodeSuccess,
  updateCurrencyCodeFail,
  updateCurrencyCodeSuccess
} from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getCurrencyCodeSaga(action) {
  try {
    const response = yield call(getCurrencyCodeApi, action.payload);
    yield put(getCurrencyCodeSuccess(response?.data));
  } catch (error) {
    yield put(getCurrencyCodeFail(error));
  }
}

function* updateCurrencyCodeSaga(action) {
  try {
    const response = yield call(updateCurrencyCodeApi, action.payload);
    yield put(updateCurrencyCodeSuccess(response));
  } catch (error) {
    yield put(updateCurrencyCodeFail(error));
  }
}

function* addCurrencyCodeSaga(action) {
  try {
    const response = yield call(addCurrencyCodeApi, action.payload);
    yield put(addCurrencyCodeSuccess(response));
  } catch (error) {
    yield put(addCurrencyCodeFail(error));
  }
}

function* deleteCurrencyCodeSaga(action) {
  try {
    const response = yield call(deleteCurrencyCodeApi, action.payload);
    yield put(deleteCurrencyCodeSuccess(response));
  } catch (error) {
    yield put(deleteCurrencyCodeFail(error));
  }
}

function* CurrencyCodeSaga() {
  yield takeLatest(GET_CURRENCY_CODE, getCurrencyCodeSaga);
  yield takeLatest(UPDATE_CURRENCY_CODE, updateCurrencyCodeSaga);
  yield takeLatest(ADD_CURRENCY_CODE, addCurrencyCodeSaga);
  yield takeLatest(DELETE_CURRENCY_CODE, deleteCurrencyCodeSaga);
}

export default CurrencyCodeSaga;
