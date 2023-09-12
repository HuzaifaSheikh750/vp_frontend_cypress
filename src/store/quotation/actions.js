import {
  DELETE_QUOTATION,
  DELETE_QUOTATION_FAIL,
  DELETE_QUOTATION_SUCCESS,
  GET_QUOTATION,
  GET_QUOTATION_FAIL,
  GET_QUOTATION_SUCCESS,
  GET_REASONING_LIST,
  GET_REASONING_LIST_FAIL,
  GET_REASONING_LIST_SUCCESS,
  GET_SPECIFIC_QUOTATION,
  GET_SPECIFIC_QUOTATION_FAIL,
  GET_SPECIFIC_QUOTATION_SUCCESS,
  POST_QUOTATION,
  POST_QUOTATION_FAIL,
  POST_QUOTATION_SUCCESS,
  RESET_QUOTATION_STATUS,
  SUBMIT_REASON,
  SUBMIT_REASON_FAIL,
  SUBMIT_REASON_SUCCESS,
  UPDATE_QUOTATION,
  UPDATE_QUOTATION_FAIL,
  UPDATE_QUOTATION_SUCCESS,
} from "./actionTypes";

export const getQuotation = (payload) => ({
  type: GET_QUOTATION,
  payload,
});

export const getQuotationSuccess = (payload) => ({
  type: GET_QUOTATION_SUCCESS,
  payload,
});

export const getQuotationFail = (payload) => ({
  type: GET_QUOTATION_FAIL,
  payload,
});

export const postQuotation = (payload) => ({
  type: POST_QUOTATION,
  payload,
});

export const postQuotationSuccess = (payload) => ({
  type: POST_QUOTATION_SUCCESS,
  payload,
});

export const postQuotationFail = (payload) => ({
  type: POST_QUOTATION_FAIL,
  payload,
});

export const updateQuotation = (payload) => ({
  type: UPDATE_QUOTATION,
  payload,
});

export const updateQuotationSuccess = (payload) => ({
  type: UPDATE_QUOTATION_SUCCESS,
  payload,
});

export const updateQuotationFail = (payload) => ({
  type: UPDATE_QUOTATION_FAIL,
  payload,
});

export const resetQuotationStatus = () => ({
  type: RESET_QUOTATION_STATUS,
});

export const deleteQuotation = (payload) => ({
  type: DELETE_QUOTATION,
  payload,
});

export const deleteQuotationSuccess = (payload) => ({
  type: DELETE_QUOTATION_SUCCESS,
  payload,
});

export const deleteQuotationFail = (payload) => ({
  type: DELETE_QUOTATION_FAIL,
  payload,
});

export const getSpecificQuotation = (payload) => ({
  type: GET_SPECIFIC_QUOTATION,
  payload,
});

export const getSpecificQuotationSuccess = (payload) => ({
  type: GET_SPECIFIC_QUOTATION_SUCCESS,
  payload,
});

export const getSpecificQuotationFail = (payload) => ({
  type: GET_SPECIFIC_QUOTATION_FAIL,
  payload,
});

export const getReasoningList = (payload) => ({
  type: GET_REASONING_LIST,
  payload,
});

export const getReasoningListSuccess = (payload) => ({
  type: GET_REASONING_LIST_SUCCESS,
  payload,
});

export const getReasoningListFail = (payload) => ({
  type: GET_REASONING_LIST_FAIL,
  payload,
});

export const submitReason = (payload) => ({
  type: SUBMIT_REASON,
  payload,
});

export const submitReasonSuccess = (payload) => ({
  type: SUBMIT_REASON_SUCCESS,
  payload,
});

export const submitReasonFail = (payload) => ({
  type: SUBMIT_REASON_FAIL,
  payload,
});
