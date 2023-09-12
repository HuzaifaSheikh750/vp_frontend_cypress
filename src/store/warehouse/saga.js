import { ADD_WAREHOUSE, DELETE_WAREHOUSE, GET_WAREHOUSE, UPDATE_WAREHOUSE } from "./actionTypes";
import {
  addWarehouseApi,
  deleteWarehouseApi,
  getWarehouseApi,
  updateWarehouseApi
} from "../../helpers/backend_helper";
import {
  addWarehouseFail,
  addWarehouseSuccess,
  deleteWarehouseFail,
  deleteWarehouseSuccess,
  getWarehouseFail,
  getWarehouseSuccess,
  updateWarehouseFail,
  updateWarehouseSuccess
} from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getWarehouseSaga(action) {
  try {
    const response = yield call(getWarehouseApi, action.payload);
    yield put(getWarehouseSuccess(response?.data));
  } catch (error) {
    yield put(getWarehouseFail(error));
  }
}

function* updateWarehouseSaga(action) {
  try {
    const response = yield call(updateWarehouseApi, action.payload);
    yield put(updateWarehouseSuccess(response));
  } catch (error) {
    yield put(updateWarehouseFail(error));
  }
}

function* addWarehouseSaga(action) {
  try {
    const response = yield call(addWarehouseApi, action.payload);
    yield put(addWarehouseSuccess(response));
  } catch (error) {
    yield put(addWarehouseFail(error));
  }
}

function* deleteWarehouseSaga(action) {
  try {
    const response = yield call(deleteWarehouseApi, action.payload);
    yield put(deleteWarehouseSuccess(response));
  } catch (error) {
    yield put(deleteWarehouseFail(error));
  }
}

function* WarehouseSaga() {
  yield takeLatest(GET_WAREHOUSE, getWarehouseSaga);
  yield takeLatest(UPDATE_WAREHOUSE, updateWarehouseSaga);
  yield takeLatest(ADD_WAREHOUSE, addWarehouseSaga);
  yield takeLatest(DELETE_WAREHOUSE, deleteWarehouseSaga);
}

export default WarehouseSaga;
