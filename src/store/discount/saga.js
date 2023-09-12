import {
  ADD_DISCOUNT,
  DELETE_DISCOUNT,
  GET_DISCOUNT,
  UPDATE_DISCOUNT,
} from "./actionTypes";
import {
  addDiscountApi,
  deleteDiscountApi,
  getDiscountApi,
  updateDiscountApi,
} from "../../helpers/backend_helper";
import {
  addDiscountFail,
  addDiscountSuccess,
  deleteDiscountFail,
  deleteDiscountSuccess,
  getDiscountFail,
  getDiscountSuccess,
  updateDiscountFail,
  updateDiscountSuccess,
} from "./actions";
import { call, put, takeLatest } from "redux-saga/effects";

function* getDiscountSaga(action) {
  try {
    const response = yield call(getDiscountApi, action.payload);
    yield put(getDiscountSuccess(response?.data));
  } catch (error) {
    yield put(getDiscountFail(error));
  }
}

function* updateDiscountSaga(action) {
  try {
    const response = yield call(updateDiscountApi, action.payload);
    yield put(updateDiscountSuccess(response));
  } catch (error) {
    yield put(updateDiscountFail(error));
  }
}

function* addDiscountSaga(action) {
  try {
    const response = yield call(addDiscountApi, action.payload);
    yield put(addDiscountSuccess(response));
  } catch (error) {
    yield put(addDiscountFail(error));
  }
}

function* deleteDiscountSaga(action) {
  try {
    const response = yield call(deleteDiscountApi, action.payload);
    yield put(deleteDiscountSuccess(response));
  } catch (error) {
    yield put(deleteDiscountFail(error));
  }
}

function* DiscountSaga() {
  yield takeLatest(GET_DISCOUNT, getDiscountSaga);
  yield takeLatest(UPDATE_DISCOUNT, updateDiscountSaga);
  yield takeLatest(ADD_DISCOUNT, addDiscountSaga);
  yield takeLatest(DELETE_DISCOUNT, deleteDiscountSaga);
}

export default DiscountSaga;
