import {
  ADD_CURRENCY_CODE,
  ADD_CURRENCY_CODE_FAIL,
  ADD_CURRENCY_CODE_SUCCESS,
  DELETE_CURRENCY_CODE,
  DELETE_CURRENCY_CODE_FAIL,
  DELETE_CURRENCY_CODE_SUCCESS,
  GET_CURRENCY_CODE,
  GET_CURRENCY_CODE_FAIL,
  GET_CURRENCY_CODE_SUCCESS,
  UPDATE_CURRENCY_CODE,
  UPDATE_CURRENCY_CODE_FAIL,
  UPDATE_CURRENCY_CODE_SUCCESS
} from "./actionTypes";

export const getCurrencyCode = (payload) => ({
  type: GET_CURRENCY_CODE,
  payload
});

export const getCurrencyCodeSuccess = (payload) => ({
  type: GET_CURRENCY_CODE_SUCCESS,
  payload
});

export const getCurrencyCodeFail = (payload) => ({
  type: GET_CURRENCY_CODE_FAIL,
  payload
});

export const updateCurrencyCode = (payload) => ({
  type: UPDATE_CURRENCY_CODE,
  payload
});

export const updateCurrencyCodeSuccess = (payload) => ({
  type: UPDATE_CURRENCY_CODE_SUCCESS,
  payload
});

export const updateCurrencyCodeFail = (payload) => ({
  type: UPDATE_CURRENCY_CODE_FAIL,
  payload
});

export const addCurrencyCode = (payload) => ({
  type: ADD_CURRENCY_CODE,
  payload
});

export const addCurrencyCodeSuccess = (payload) => ({
  type: ADD_CURRENCY_CODE_SUCCESS,
  payload
});

export const addCurrencyCodeFail = (payload) => ({
  type: ADD_CURRENCY_CODE_FAIL,
  payload
});

export const deleteCurrencyCode = (payload) => ({
  type: DELETE_CURRENCY_CODE,
  payload
});

export const deleteCurrencyCodeSuccess = (payload) => ({
  type: DELETE_CURRENCY_CODE_SUCCESS,
  payload
});

export const deleteCurrencyCodeFail = (payload) => ({
  type: DELETE_CURRENCY_CODE_FAIL,
  payload
});
