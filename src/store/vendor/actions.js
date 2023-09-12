import { GET_VENDOR_LIST, GET_VENDOR_LIST_FAIL, GET_VENDOR_LIST_SUCCESS } from "./actionTypes";

export const getVendorList = (rec) => ({
  type: GET_VENDOR_LIST,
  payload: rec
});

export const getVendorListSuccess = (rec) => ({
  type: GET_VENDOR_LIST_SUCCESS,
  payload: rec
});

export const getVendorListFail = (error) => ({
  type: GET_VENDOR_LIST_FAIL,
  payload: error
});
