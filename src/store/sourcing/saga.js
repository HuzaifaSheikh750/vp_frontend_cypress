import {
  DELETE_SOURCING,
  GET_SOURCING,
  GET_SPECIFIC_SOURCING,
  POST_SOURCING,
  UPDATE_SOURCING
} from "./actionTypes";
import {
  addSourcingCall,
  deleteSourcingCall,
  getSourcingCall,
  updateSourcingCall
} from "../../helpers/backend_helper";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteSourcingFail,
  deleteSourcingSuccess,
  getSourcingFail,
  getSourcingSuccess,
  getSpecificSourcingFail,
  getSpecificSourcingSuccess,
  postSourcingFail,
  postSourcingSuccess,
  updateSourcingFail,
  updateSourcingSuccess
} from "./actions";

function* fetchSourcing(action) {
  try {
    const response = yield call(getSourcingCall, action.payload);
    yield put(getSourcingSuccess(response.data));
  } catch (error) {
    yield put(getSourcingFail(error));
  }
}

function* postSourcing(action) {
  try {
    const response = yield call(addSourcingCall, action.payload);
    yield put(postSourcingSuccess(response));
  } catch (error) {
    yield put(postSourcingFail(error));
  }
}

function* updateSourcing(action) {
  try {
    const response = yield call(updateSourcingCall, action.payload);
    yield put(updateSourcingSuccess(response));
  } catch (error) {
    yield put(updateSourcingFail(error));
  }
}

function* deleteSourcing(action) {
  try {
    const response = yield call(deleteSourcingCall, action.payload);
    yield put(deleteSourcingSuccess(response));
  } catch (error) {
    yield put(deleteSourcingFail(error));
  }
}

function* fetchSpecificSourcing(action) {
  try {
    const response = yield call(getSourcingCall, action.payload);
    yield put(getSpecificSourcingSuccess(response));
  } catch (error) {
    yield put(getSpecificSourcingFail(error));
  }
}

function* sourcingSaga() {
  yield takeEvery(GET_SOURCING, fetchSourcing);
  yield takeEvery(POST_SOURCING, postSourcing);
  yield takeEvery(UPDATE_SOURCING, updateSourcing);
  yield takeEvery(DELETE_SOURCING, deleteSourcing);
  yield takeEvery(GET_SPECIFIC_SOURCING, fetchSpecificSourcing);
}

export default sourcingSaga;
