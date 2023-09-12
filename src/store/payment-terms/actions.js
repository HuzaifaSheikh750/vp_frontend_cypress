import {
  ADD_PAYMENT_TERM,
  ADD_PAYMENT_TERM_FAIL,
  ADD_PAYMENT_TERM_SUCCESS,
  DELETE_PAYMENT_TERM,
  DELETE_PAYMENT_TERM_FAIL,
  DELETE_PAYMENT_TERM_SUCCESS,
  GET_PAYMENT_TERM,
  GET_PAYMENT_TERM_FAIL,
  GET_PAYMENT_TERM_SUCCESS,
  UPDATE_PAYMENT_TERM,
  UPDATE_PAYMENT_TERM_FAIL,
  UPDATE_PAYMENT_TERM_SUCCESS
} from "./actionTypes";

export const getPaymentTerm = (payload) => ({
  type: GET_PAYMENT_TERM,
  payload
});

export const getPaymentTermSuccess = (payload) => ({
  type: GET_PAYMENT_TERM_SUCCESS,
  payload
});

export const getPaymentTermFail = (payload) => ({
  type: GET_PAYMENT_TERM_FAIL,
  payload
});

export const updatePaymentTerm = (payload) => ({
  type: UPDATE_PAYMENT_TERM,
  payload
});

export const updatePaymentTermSuccess = (payload) => ({
  type: UPDATE_PAYMENT_TERM_SUCCESS,
  payload
});

export const updatePaymentTermFail = (payload) => ({
  type: UPDATE_PAYMENT_TERM_FAIL,
  payload
});

export const addPaymentTerm = (payload) => ({
  type: ADD_PAYMENT_TERM,
  payload
});

export const addPaymentTermSuccess = (payload) => ({
  type: ADD_PAYMENT_TERM_SUCCESS,
  payload
});

export const addPaymentTermFail = (payload) => ({
  type: ADD_PAYMENT_TERM_FAIL,
  payload
});

export const deletePaymentTerm = (payload) => ({
  type: DELETE_PAYMENT_TERM,
  payload
});

export const deletePaymentTermSuccess = (payload) => ({
  type: DELETE_PAYMENT_TERM_SUCCESS,
  payload
});

export const deletePaymentTermFail = (payload) => ({
  type: DELETE_PAYMENT_TERM_FAIL,
  payload
});
