import {
  ADD_SALES_UNIT,
  ADD_SALES_UNIT_FAIL,
  ADD_SALES_UNIT_SUCCESS,
  DELETE_SALES_UNIT,
  DELETE_SALES_UNIT_FAIL,
  DELETE_SALES_UNIT_SUCCESS,
  GET_SALES_UNIT,
  GET_SALES_UNIT_FAIL,
  GET_SALES_UNIT_SUCCESS,
  UPDATE_SALES_UNIT,
  UPDATE_SALES_UNIT_FAIL,
  UPDATE_SALES_UNIT_SUCCESS
} from "./actionTypes";

export const getSalesUnit = (payload) => ({
  type: GET_SALES_UNIT,
  payload
});

export const getSalesUnitSuccess = (payload) => ({
  type: GET_SALES_UNIT_SUCCESS,
  payload
});

export const getSalesUnitFail = (payload) => ({
  type: GET_SALES_UNIT_FAIL,
  payload
});

export const updateSalesUnit = (payload) => ({
  type: UPDATE_SALES_UNIT,
  payload
});

export const updateSalesUnitSuccess = (payload) => ({
  type: UPDATE_SALES_UNIT_SUCCESS,
  payload
});

export const updateSalesUnitFail = (payload) => ({
  type: UPDATE_SALES_UNIT_FAIL,
  payload
});

export const addSalesUnit = (payload) => ({
  type: ADD_SALES_UNIT,
  payload
});

export const addSalesUnitSuccess = (payload) => ({
  type: ADD_SALES_UNIT_SUCCESS,
  payload
});

export const addSalesUnitFail = (payload) => ({
  type: ADD_SALES_UNIT_FAIL,
  payload
});

export const deleteSalesUnit = (payload) => ({
  type: DELETE_SALES_UNIT,
  payload
});

export const deleteSalesUnitSuccess = (payload) => ({
  type: DELETE_SALES_UNIT_SUCCESS,
  payload
});

export const deleteSalesUnitFail = (payload) => ({
  type: DELETE_SALES_UNIT_FAIL,
  payload
});
