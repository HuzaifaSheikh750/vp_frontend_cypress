import {
  ADD_DISCOUNT,
  ADD_DISCOUNT_FAIL,
  ADD_DISCOUNT_SUCCESS,
  DELETE_DISCOUNT,
  DELETE_DISCOUNT_FAIL,
  DELETE_DISCOUNT_SUCCESS,
  GET_DISCOUNT,
  GET_DISCOUNT_FAIL,
  GET_DISCOUNT_SUCCESS,
  UPDATE_DISCOUNT,
  UPDATE_DISCOUNT_FAIL,
  UPDATE_DISCOUNT_SUCCESS,
} from "./actionTypes";

export const getDiscount = (payload) => ({
  type: GET_DISCOUNT,
  payload,
});

export const getDiscountSuccess = (payload) => ({
  type: GET_DISCOUNT_SUCCESS,
  payload,
});

export const getDiscountFail = (payload) => ({
  type: GET_DISCOUNT_FAIL,
  payload,
});

export const updateDiscount = (payload) => ({
  type: UPDATE_DISCOUNT,
  payload,
});

export const updateDiscountSuccess = (payload) => ({
  type: UPDATE_DISCOUNT_SUCCESS,
  payload,
});

export const updateDiscountFail = (payload) => ({
  type: UPDATE_DISCOUNT_FAIL,
  payload,
});

export const addDiscount = (payload) => ({
  type: ADD_DISCOUNT,
  payload,
});

export const addDiscountSuccess = (payload) => ({
  type: ADD_DISCOUNT_SUCCESS,
  payload,
});

export const addDiscountFail = (payload) => ({
  type: ADD_DISCOUNT_FAIL,
  payload,
});

export const deleteDiscount = (payload) => ({
  type: DELETE_DISCOUNT,
  payload,
});

export const deleteDiscountSuccess = (payload) => ({
  type: DELETE_DISCOUNT_SUCCESS,
  payload,
});

export const deleteDiscountFail = (payload) => ({
  type: DELETE_DISCOUNT_FAIL,
  payload,
});
