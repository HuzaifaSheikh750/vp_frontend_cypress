import {
  ADD_WAREHOUSE,
  ADD_WAREHOUSE_FAIL,
  ADD_WAREHOUSE_SUCCESS,
  DELETE_WAREHOUSE,
  DELETE_WAREHOUSE_FAIL,
  DELETE_WAREHOUSE_SUCCESS,
  GET_WAREHOUSE,
  GET_WAREHOUSE_FAIL,
  GET_WAREHOUSE_SUCCESS,
  UPDATE_WAREHOUSE,
  UPDATE_WAREHOUSE_FAIL,
  UPDATE_WAREHOUSE_SUCCESS
} from "./actionTypes";

export const getWarehouse = (payload) => ({
  type: GET_WAREHOUSE,
  payload
});

export const getWarehouseSuccess = (payload) => ({
  type: GET_WAREHOUSE_SUCCESS,
  payload
});

export const getWarehouseFail = (payload) => ({
  type: GET_WAREHOUSE_FAIL,
  payload
});

export const updateWarehouse = (payload) => ({
  type: UPDATE_WAREHOUSE,
  payload
});

export const updateWarehouseSuccess = (payload) => ({
  type: UPDATE_WAREHOUSE_SUCCESS,
  payload
});

export const updateWarehouseFail = (payload) => ({
  type: UPDATE_WAREHOUSE_FAIL,
  payload
});

export const addWarehouse = (payload) => ({
  type: ADD_WAREHOUSE,
  payload
});

export const addWarehouseSuccess = (payload) => ({
  type: ADD_WAREHOUSE_SUCCESS,
  payload
});

export const addWarehouseFail = (payload) => ({
  type: ADD_WAREHOUSE_FAIL,
  payload
});

export const deleteWarehouse = (payload) => ({
  type: DELETE_WAREHOUSE,
  payload
});

export const deleteWarehouseSuccess = (payload) => ({
  type: DELETE_WAREHOUSE_SUCCESS,
  payload
});

export const deleteWarehouseFail = (payload) => ({
  type: DELETE_WAREHOUSE_FAIL,
  payload
});
