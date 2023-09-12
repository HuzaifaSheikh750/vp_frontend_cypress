import {
  DELETE_PURCHASE_ORDER,
  DELETE_PURCHASE_ORDER_FAIL,
  DELETE_PURCHASE_ORDER_SUCCESS,
  GET_PURCHASE_ORDER,
  GET_PURCHASE_ORDER_FAIL,
  GET_PURCHASE_ORDER_SUCCESS,
  GET_SPECIFIC_PURCHASE_ORDER,
  GET_SPECIFIC_PURCHASE_ORDER_FAIL,
  GET_SPECIFIC_PURCHASE_ORDER_SUCCESS,
  POST_PURCHASE_ORDER,
  POST_PURCHASE_ORDER_FAIL,
  POST_PURCHASE_ORDER_SUCCESS,
  RESET_PURCHASE_ORDER_STATUS,
  UPDATE_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER_FAIL,
  UPDATE_PURCHASE_ORDER_SUCCESS
} from "./actionTypes";

export const getPurchaseOrder = (payload) => ({
  type: GET_PURCHASE_ORDER,
  payload
});

export const getPurchaseOrderSuccess = (payload) => ({
  type: GET_PURCHASE_ORDER_SUCCESS,
  payload
});

export const getPurchaseOrderFail = (payload) => ({
  type: GET_PURCHASE_ORDER_FAIL,
  payload
});

export const postPurchaseOrder = (payload) => ({
  type: POST_PURCHASE_ORDER,
  payload
});

export const postPurchaseOrderSuccess = (payload) => ({
  type: POST_PURCHASE_ORDER_SUCCESS,
  payload
});

export const postPurchaseOrderFail = (payload) => ({
  type: POST_PURCHASE_ORDER_FAIL,
  payload
});

export const updatePurchaseOrder = (payload) => ({
  type: UPDATE_PURCHASE_ORDER,
  payload
});

export const updatePurchaseOrderSuccess = (payload) => ({
  type: UPDATE_PURCHASE_ORDER_SUCCESS,
  payload
});

export const updatePurchaseOrderFail = (payload) => ({
  type: UPDATE_PURCHASE_ORDER_FAIL,
  payload
});

export const resetPurchaseOrderStatus = () => ({
  type: RESET_PURCHASE_ORDER_STATUS
});

export const deletePurchaseOrder = (payload) => ({
  type: DELETE_PURCHASE_ORDER,
  payload
});

export const deletePurchaseOrderSuccess = (payload) => ({
  type: DELETE_PURCHASE_ORDER_SUCCESS,
  payload
});

export const deletePurchaseOrderFail = (payload) => ({
  type: DELETE_PURCHASE_ORDER_FAIL,
  payload
});

export const getSpecificPurchaseOrder = (payload) => ({
  type: GET_SPECIFIC_PURCHASE_ORDER,
  payload
});

export const getSpecificPurchaseOrderSuccess = (payload) => ({
  type: GET_SPECIFIC_PURCHASE_ORDER_SUCCESS,
  payload
});

export const getSpecificPurchaseOrderFail = (payload) => ({
  type: GET_SPECIFIC_PURCHASE_ORDER_FAIL,
  payload
});
