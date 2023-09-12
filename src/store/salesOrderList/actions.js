import {
  ADD_NEW_SALES_ORDER_LIST,
  ADD_NEW_SALES_ORDER_LIST_FAIL,
  ADD_NEW_SALES_ORDER_LIST_SUCCESS,
  CLEAR_SALES_ORDER_LIST,
  DELETE_SALES_ORDER_LIST,
  DELETE_SALES_ORDER_LIST_FAIL,
  DELETE_SALES_ORDER_LIST_SUCCESS,
  GET_SALES_ORDER_LIST,
  GET_SALES_ORDER_LIST_FAIL,
  GET_SALES_ORDER_LIST_SUCCESS,
  UPDATE_SALES_ORDER_LIST,
  UPDATE_SALES_ORDER_LIST_FAIL,
  UPDATE_SALES_ORDER_LIST_SUCCESS,
  UPDATE_SALES_ORDER_STATUS,
  UPDATE_SALES_ORDER_STATUS_FAIL,
  UPDATE_SALES_ORDER_STATUS_SUCCESS
} from "./actionTypes";

export const getSalesOrderList = (rec) => ({
  type: GET_SALES_ORDER_LIST,
  payload: rec
});

export const getSalesOrderListSuccess = (rec) => ({
  type: GET_SALES_ORDER_LIST_SUCCESS,
  payload: rec
});

export const getSalesOrderListFail = (error) => ({
  type: GET_SALES_ORDER_LIST_FAIL,
  payload: error
});

export const updateSalesOrderList = (rec) => ({
  type: UPDATE_SALES_ORDER_LIST,
  payload: rec
});

export const updateSalesOrderListSuccess = (rec) => ({
  type: UPDATE_SALES_ORDER_LIST_SUCCESS,
  payload: rec
});

export const updateSalesOrderListFail = (error) => ({
  type: UPDATE_SALES_ORDER_LIST_FAIL,
  payload: error
});

export const addNewSalesOrderList = (rec) => ({
  type: ADD_NEW_SALES_ORDER_LIST,
  payload: rec
});

export const addNewSalesOrderListSuccess = (rec) => ({
  type: ADD_NEW_SALES_ORDER_LIST_SUCCESS,
  payload: rec
});

export const addNewSalesOrderListFail = (error) => ({
  type: ADD_NEW_SALES_ORDER_LIST_FAIL,
  payload: error
});

export const deleteSalesOrderList = (rec) => ({
  type: DELETE_SALES_ORDER_LIST,
  payload: rec
});

export const deleteSalesOrderListSuccess = (rec) => ({
  type: DELETE_SALES_ORDER_LIST_SUCCESS,
  payload: rec
});

export const deleteSalesOrderListFail = (error) => ({
  type: DELETE_SALES_ORDER_LIST_FAIL,
  payload: error
});

export const updateSalesOrderStatus = (rec) => ({
  type: UPDATE_SALES_ORDER_STATUS,
  payload: rec
});

export const updateSalesOrderStatusSuccess = (rec) => ({
  type: UPDATE_SALES_ORDER_STATUS_SUCCESS,
  payload: rec
});

export const updateSalesOrderStatusFail = (error) => ({
  type: UPDATE_SALES_ORDER_STATUS_FAIL,
  payload: error
});

export const clearSalesOrderList = () => ({
  type: CLEAR_SALES_ORDER_LIST
});
