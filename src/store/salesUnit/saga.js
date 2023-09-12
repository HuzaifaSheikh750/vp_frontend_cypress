import {
  ADD_SALES_UNIT,
  DELETE_SALES_UNIT,
  GET_SALES_UNIT,
  UPDATE_SALES_UNIT
} from "./actionTypes";
import {
  addSalesUnitApi,
  deleteSalesUnitApi,
  getSalesUnitApi,
  updateSalesUnitApi
} from "../../helpers/backend_helper";
import {
  addSalesUnitFail,
  addSalesUnitSuccess,
  deleteSalesUnitFail,
  deleteSalesUnitSuccess,
  getSalesUnitFail,
  getSalesUnitSuccess,
  updateSalesUnitFail,
  updateSalesUnitSuccess
} from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getSalesUnitSaga(action) {
  try {
    const response = yield call(getSalesUnitApi, action.payload);
    yield put(getSalesUnitSuccess(response?.data));
  } catch (error) {
    yield put(getSalesUnitFail(error));
  }
}

function* updateSalesUnitSaga(action) {
  try {
    const response = yield call(updateSalesUnitApi, action.payload);
    yield put(updateSalesUnitSuccess(response));
  } catch (error) {
    yield put(updateSalesUnitFail(error));
  }
}

function* addSalesUnitSaga(action) {
  try {
    const response = yield call(addSalesUnitApi, action.payload);
    yield put(addSalesUnitSuccess(response));
  } catch (error) {
    yield put(addSalesUnitFail(error));
  }
}

function* deleteSalesUnitSaga(action) {
  try {
    const response = yield call(deleteSalesUnitApi, action.payload);
    yield put(deleteSalesUnitSuccess(response));
  } catch (error) {
    yield put(deleteSalesUnitFail(error));
  }
}

function* SalesUnitSaga() {
  yield takeLatest(GET_SALES_UNIT, getSalesUnitSaga);
  yield takeLatest(UPDATE_SALES_UNIT, updateSalesUnitSaga);
  yield takeLatest(ADD_SALES_UNIT, addSalesUnitSaga);
  yield takeLatest(DELETE_SALES_UNIT, deleteSalesUnitSaga);
}

export default SalesUnitSaga;
