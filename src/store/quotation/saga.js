import {
  DELETE_QUOTATION,
  GET_QUOTATION,
  GET_REASONING_LIST,
  GET_REASONING_LIST_FAIL,
  GET_REASONING_LIST_SUCCESS,
  GET_SPECIFIC_QUOTATION,
  POST_QUOTATION,
  SUBMIT_REASON,
  SUBMIT_REASON_FAIL,
  SUBMIT_REASON_SUCCESS,
  UPDATE_QUOTATION,
} from "./actionTypes";
import {
  addQuotationCall,
  deleteQuotationCall,
  getQuotationCall,
  getReasoningListCall,
  updateQuotationCall,
} from "../../helpers/backend_helper";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteQuotationFail,
  deleteQuotationSuccess,
  getQuotationFail,
  getQuotationSuccess,
  getReasoningListFail,
  getReasoningListSuccess,
  getSpecificQuotationFail,
  getSpecificQuotationSuccess,
  postQuotationFail,
  postQuotationSuccess,
  updateQuotationFail,
  updateQuotationSuccess,
} from "./actions";

function* fetchQuotation(action) {
  try {
    const response = yield call(getQuotationCall, action.payload);
    yield put(getQuotationSuccess(response.data));
  } catch (error) {
    yield put(getQuotationFail(error));
  }
}

function* postQuotation(action) {
  try {
    const response = yield call(addQuotationCall, action.payload);
    yield put(postQuotationSuccess(response));
  } catch (error) {
    yield put(postQuotationFail(error));
  }
}

function* updateQuotation(action) {
  try {
    const response = yield call(updateQuotationCall, action.payload);
    yield put(updateQuotationSuccess(response));
  } catch (error) {
    yield put(updateQuotationFail(error));
  }
}

function* deleteQuotation(action) {
  try {
    const response = yield call(deleteQuotationCall, action.payload);
    yield put(deleteQuotationSuccess(response));
  } catch (error) {
    yield put(deleteQuotationFail(error));
  }
}

function* fetchSpecificQuotation(action) {
  try {
    const response = yield call(getQuotationCall, action.payload);
    yield put(getSpecificQuotationSuccess(response));
  } catch (error) {
    yield put(getSpecificQuotationFail(error));
  }
}

function* fetchReasoningList(action) {
  try {
    const response = yield call(getReasoningListCall, action.payload);
    yield put(getReasoningListSuccess(response.data));
  } catch (error) {
    yield put(getReasoningListFail(error));
  }
}

// function* submitReason(action) {
//   try {
//     const response = yield call(submitReasonCall, action.payload);
//     yield put(submitReasonSuccess(response));
//   } catch (error) {
//     yield put(submitReasonFail(error));
//   }
// }

function* quotationSaga() {
  yield takeEvery(GET_QUOTATION, fetchQuotation);
  yield takeEvery(POST_QUOTATION, postQuotation);
  yield takeEvery(UPDATE_QUOTATION, updateQuotation);
  yield takeEvery(DELETE_QUOTATION, deleteQuotation);
  yield takeEvery(GET_SPECIFIC_QUOTATION, fetchSpecificQuotation);
  yield takeEvery(GET_REASONING_LIST, fetchReasoningList);
  // yield takeEvery(SUBMIT_REASON, submitReason);
}

export default quotationSaga;
