import {
  ADD_PAYMENT_METHOD,
  ADD_PAYMENT_METHOD_FAIL,
  ADD_PAYMENT_METHOD_SUCCESS,
  DELETE_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD_FAIL,
  DELETE_PAYMENT_METHOD_SUCCESS,
  GET_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_FAIL,
  GET_PAYMENT_METHOD_SUCCESS,
  UPDATE_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD_FAIL,
  UPDATE_PAYMENT_METHOD_SUCCESS
} from "./actionTypes";

export const getPaymentMethod = (payload) => ({
  type: GET_PAYMENT_METHOD,
  payload
});

export const getPaymentMethodSuccess = (payload) => ({
  type: GET_PAYMENT_METHOD_SUCCESS,
  payload
});

export const getPaymentMethodFail = (payload) => ({
  type: GET_PAYMENT_METHOD_FAIL,
  payload
});

export const updatePaymentMethod = (payload) => ({
  type: UPDATE_PAYMENT_METHOD,
  payload
});

export const updatePaymentMethodSuccess = (payload) => ({
  type: UPDATE_PAYMENT_METHOD_SUCCESS,
  payload
});

export const updatePaymentMethodFail = (payload) => ({
  type: UPDATE_PAYMENT_METHOD_FAIL,
  payload
});

export const addPaymentMethod = (payload) => ({
  type: ADD_PAYMENT_METHOD,
  payload
});

export const addPaymentMethodSuccess = (payload) => ({
  type: ADD_PAYMENT_METHOD_SUCCESS,
  payload
});

export const addPaymentMethodFail = (payload) => ({
  type: ADD_PAYMENT_METHOD_FAIL,
  payload
});

export const deletePaymentMethod = (payload) => ({
  type: DELETE_PAYMENT_METHOD,
  payload
});

export const deletePaymentMethodSuccess = (payload) => ({
  type: DELETE_PAYMENT_METHOD_SUCCESS,
  payload
});

export const deletePaymentMethodFail = (payload) => ({
  type: DELETE_PAYMENT_METHOD_FAIL,
  payload
});
