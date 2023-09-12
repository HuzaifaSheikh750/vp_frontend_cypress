import {
 
  GET_ORDER_TRACKING,
  GET_ORDER_TRACKING_SUCCESS,
  GET_ORDER_TRACKING_FAIL,

  UPDATE_ORDER_TRACKING,
  UPDATE_ORDER_TRACKING_SUCCESS,
  UPDATE_ORDER_TRACKING_FAIL,
 
  ADD_NEW_ORDER_TRACKING,
  ADD_NEW_ORDER_TRACKING_SUCCESS,
  ADD_NEW_ORDER_TRACKING_FAIL,
 
  DELETE_ORDER_TRACKING_FAIL,
  DELETE_ORDER_TRACKING_SUCCESS,
  DELETE_ORDER_TRACKING
} from "./actionTypes"

export const getOrderTracking = () => ({
  type: GET_ORDER_TRACKING,
})

export const getOrderTrackingSuccess = rec => ({
  type: GET_ORDER_TRACKING_SUCCESS,
  payload: rec,
})

export const getOrderTrackingFail = error => ({
  type: GET_ORDER_TRACKING_FAIL,
  payload: error,
})

export const updateOrderTracking = rec => ({
  type: UPDATE_ORDER_TRACKING,
  payload: rec,
})

export const updateOrderTrackingSuccess = rec => ({
  type: UPDATE_ORDER_TRACKING_SUCCESS,
  payload: rec,
})

export const updateOrderTrackingFail = error => ({
  type: UPDATE_ORDER_TRACKING_FAIL,
  payload: error,
})

export const addNewOrderTracking = rec => ({
  type: ADD_NEW_ORDER_TRACKING,
  payload: rec,
})

export const addNewOrderTrackingSuccess = rec => ({
  type: ADD_NEW_ORDER_TRACKING_SUCCESS,
  payload: rec,
})

export const addNewOrderTrackingFail = error => ({
  type: ADD_NEW_ORDER_TRACKING_FAIL,
  payload: error,
})

export const deleteOrderTracking = rec => ({
  type: DELETE_ORDER_TRACKING,
  payload: rec,
})

export const deleteOrderTrackingSuccess = rec => ({
  type: DELETE_ORDER_TRACKING_SUCCESS,
  payload: rec,
})

export const deleteOrderTrackingFail = error => ({
  type: DELETE_ORDER_TRACKING_FAIL,
  payload: error,
})

