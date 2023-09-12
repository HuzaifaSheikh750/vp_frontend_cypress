import {
  ADD_BANKING_INFO,
  ADD_BANKING_INFO_FAIL,
  ADD_BANKING_INFO_SUCCESS,
  ADD_NEW_SHIPPING_INFO,
  ADD_NEW_SHIPPING_INFO_FAIL,
  ADD_NEW_SHIPPING_INFO_SUCCESS,
  ADD_NEW_USER,
  ADD_NEW_USER_FAIL,
  ADD_NEW_USER_SUCCESS,
  ADD_VENDOR,
  ADD_VENDOR_FAIL,
  ADD_VENDOR_SUCCESS,
  CLEAR_SHIPPING_INFO,
  DELETE_BANKING_INFO,
  DELETE_BANKING_INFO_FAIL,
  DELETE_BANKING_INFO_SUCCESS,
  DELETE_SHIPPING_INFO,
  DELETE_SHIPPING_INFO_FAIL,
  DELETE_SHIPPING_INFO_SUCCESS,
  DELETE_USER,
  DELETE_USER_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_VENDOR,
  DELETE_VENDOR_FAIL,
  DELETE_VENDOR_SUCCESS,
  GET_ALL_SHIPPING_INFO,
  GET_ALL_SHIPPING_INFO_FAIL,
  GET_ALL_SHIPPING_INFO_SUCCESS,
  GET_ALL_VENDOR,
  GET_ALL_VENDOR_FAIL,
  GET_ALL_VENDOR_SUCCESS,
  GET_BANKING_INFO,
  GET_BANKING_INFO_FAIL,
  GET_BANKING_INFO_SUCCESS,
  GET_QUANTITY,
  GET_QUANTITY_FAIL,
  GET_QUANTITY_SUCCESS,
  GET_SHIPPING_INFO,
  GET_SHIPPING_INFO_FAIL,
  GET_SHIPPING_INFO_SUCCESS,
  GET_SPECIFIC_USER,
  GET_SPECIFIC_USER_FAIL,
  GET_SPECIFIC_USER_SUCCESS,
  GET_USERS,
  GET_USERS_FAIL,
  GET_USERS_SUCCESS,
  GET_VENDOR,
  GET_VENDOR_FAIL,
  GET_VENDOR_SUCCESS,
  QUANTITY_CHANGE,
  RESET_ERROR,
  RESET_USER,
  UPDATE_BANKING_INFO,
  UPDATE_BANKING_INFO_FAIL,
  UPDATE_BANKING_INFO_SUCCESS,
  UPDATE_NEW_USER,
  UPDATE_NEW_USER_FAIL,
  UPDATE_NEW_USER_SUCCESS,
  UPDATE_REMAINING_QUANTITY,
  UPDATE_REMAINING_QUANTITY_FAIL,
  UPDATE_REMAINING_QUANTITY_SUCCESS,
  UPDATE_SHIPPING_INFO,
  UPDATE_SHIPPING_INFO_FAIL,
  UPDATE_SHIPPING_INFO_SUCCESS,
  UPDATE_VENDOR,
  UPDATE_VENDOR_FAIL,
  UPDATE_VENDOR_SUCCESS,
} from "./actionTypes";

export const getUsers = (rec) => ({
  type: GET_USERS,
  payload: rec,
});

export const getUsersSuccess = (rec) => ({
  type: GET_USERS_SUCCESS,
  payload: rec,
});

export const getUsersFail = (error) => ({
  type: GET_USERS_FAIL,
  payload: error,
});

export const addNewUser = (rec) => ({
  type: ADD_NEW_USER,
  payload: rec,
});

export const addNewUserSuccess = (rec) => ({
  type: ADD_NEW_USER_SUCCESS,
  payload: rec,
});

export const addNewUserFail = (error) => ({
  type: ADD_NEW_USER_FAIL,
  payload: error,
});

export const updateUser = (rec) => ({
  type: UPDATE_NEW_USER,
  payload: rec,
});

export const updateUserSuccess = (rec) => ({
  type: UPDATE_NEW_USER_SUCCESS,
  payload: rec,
});

export const updateUserFail = (error) => ({
  type: UPDATE_NEW_USER_FAIL,
  payload: error,
});

export const deleteUser = (rec) => ({
  type: DELETE_USER,
  payload: rec,
});

export const deleteUserSuccess = (rec) => ({
  type: DELETE_USER_SUCCESS,
  payload: rec,
});

export const deleteUserFail = (error) => ({
  type: DELETE_USER_FAIL,
  payload: error,
});

export const getQuantity = () => ({
  type: GET_QUANTITY,
});

export const getQuantitySuccess = (rec) => ({
  type: GET_QUANTITY_SUCCESS,
  payload: rec,
});

export const getQuantityFail = (error) => ({
  type: GET_QUANTITY_FAIL,
  payload: error,
});

export const quantityChange = (rec) => ({
  type: QUANTITY_CHANGE,
  payload: rec,
});

export const updateRemainingQuantity = (rec) => ({
  type: UPDATE_REMAINING_QUANTITY,
  payload: rec,
});

export const updateRemainingQuantitySuccess = (rec) => ({
  type: UPDATE_REMAINING_QUANTITY_SUCCESS,
  payload: rec,
});

export const updateRemainingQuantityFail = (error) => ({
  type: UPDATE_REMAINING_QUANTITY_FAIL,
  payload: error,
});

export const clearQtyError = () => ({
  type: RESET_ERROR,
});

export const getSpecificUser = (rec) => ({
  type: GET_SPECIFIC_USER,
  payload: rec,
});

export const getSpecificUserSuccess = (rec) => ({
  type: GET_SPECIFIC_USER_SUCCESS,
  payload: rec,
});

export const getSpecificUserFail = (error) => ({
  type: GET_SPECIFIC_USER_FAIL,
  payload: error,
});

export const getShippingInfo = (rec) => ({
  type: GET_SHIPPING_INFO,
  payload: rec,
});

export const getShippingInfoSuccess = (rec) => ({
  type: GET_SHIPPING_INFO_SUCCESS,
  payload: rec,
});

export const getShippingInfoFail = (error) => ({
  type: GET_SHIPPING_INFO_FAIL,
  payload: error,
});

export const updateShippingInfo = (rec) => ({
  type: UPDATE_SHIPPING_INFO,
  payload: rec,
});

export const updateShippingInfoSuccess = (rec) => ({
  type: UPDATE_SHIPPING_INFO_SUCCESS,
  payload: rec,
});

export const updateShippingInfoFail = (error) => ({
  type: UPDATE_SHIPPING_INFO_FAIL,
  payload: error,
});

export const addNewShippingInfo = (rec) => ({
  type: ADD_NEW_SHIPPING_INFO,
  payload: rec,
});

export const addNewShippingInfoSuccess = (rec) => ({
  type: ADD_NEW_SHIPPING_INFO_SUCCESS,
  payload: rec,
});

export const addNewShippingInfoFail = (error) => ({
  type: ADD_NEW_SHIPPING_INFO_FAIL,
  payload: error,
});

export const deleteShippingInfo = (rec) => ({
  type: DELETE_SHIPPING_INFO,
  payload: rec,
});

export const deleteShippingInfoSuccess = (rec) => ({
  type: DELETE_SHIPPING_INFO_SUCCESS,
  payload: rec,
});

export const deleteShippingInfoFail = (error) => ({
  type: DELETE_SHIPPING_INFO_FAIL,
  payload: error,
});

export const clearShippingInfo = () => ({
  type: CLEAR_SHIPPING_INFO,
});

export const getAllShippingInfo = (rec) => ({
  type: GET_ALL_SHIPPING_INFO,
  payload: rec,
});

export const getAllShippingInfoSuccess = (rec) => ({
  type: GET_ALL_SHIPPING_INFO_SUCCESS,
  payload: rec,
});

export const getAllShippingInfoFail = (error) => ({
  type: GET_ALL_SHIPPING_INFO_FAIL,
  payload: error,
});

export const getVendor = (rec) => ({
  type: GET_VENDOR,
  payload: rec,
});

export const getVendorSuccess = (rec) => ({
  type: GET_VENDOR_SUCCESS,
  payload: rec,
});

export const getVendorFail = (error) => ({
  type: GET_VENDOR_FAIL,
  payload: error,
});

export const addVendor = (rec) => ({
  type: ADD_VENDOR,
  payload: rec,
});

export const addVendorSuccess = (rec) => ({
  type: ADD_VENDOR_SUCCESS,
  payload: rec,
});

export const addVendorFail = (error) => ({
  type: ADD_VENDOR_FAIL,
  payload: error,
});

export const updateVendor = (rec) => ({
  type: UPDATE_VENDOR,
  payload: rec,
});

export const updateVendorSuccess = (rec) => ({
  type: UPDATE_VENDOR_SUCCESS,
  payload: rec,
});

export const updateVendorFail = (error) => ({
  type: UPDATE_VENDOR_FAIL,
  payload: error,
});

export const deleteVendor = (rec) => ({
  type: DELETE_VENDOR,
  payload: rec,
});

export const deleteVendorSuccess = (rec) => ({
  type: DELETE_VENDOR_SUCCESS,
  payload: rec,
});

export const deleteVendorFail = (error) => ({
  type: DELETE_VENDOR_FAIL,
  payload: error,
});

export const getAllVendor = (rec) => ({
  type: GET_ALL_VENDOR,
  payload: rec,
});

export const getAllVendorSuccess = (rec) => ({
  type: GET_ALL_VENDOR_SUCCESS,
  payload: rec,
});

export const getAllVendorFail = (error) => ({
  type: GET_ALL_VENDOR_FAIL,
  payload: error,
});

export const addBankingInfo = (rec) => ({
  type: ADD_BANKING_INFO,
  payload: rec,
});

export const addBankingInfoSuccess = (rec) => ({
  type: ADD_BANKING_INFO_SUCCESS,
  payload: rec,
});

export const addBankingInfoFail = (error) => ({
  type: ADD_BANKING_INFO_FAIL,
  payload: error,
});

export const deleteBankingInfo = (rec) => ({
  type: DELETE_BANKING_INFO,
  payload: rec,
});

export const deleteBankingInfoSuccess = (rec) => ({
  type: DELETE_BANKING_INFO_SUCCESS,
  payload: rec,
});

export const deleteBankingInfoFail = (error) => ({
  type: DELETE_BANKING_INFO_FAIL,
  payload: error,
});

export const getBankingInfo = (rec) => ({
  type: GET_BANKING_INFO,
  payload: rec,
});

export const getBankingInfoSuccess = (rec) => ({
  type: GET_BANKING_INFO_SUCCESS,
  payload: rec,
});

export const getBankingInfoFail = (error) => ({
  type: GET_BANKING_INFO_FAIL,
  payload: error,
});

export const updateBankingInfo = (rec) => ({
  type: UPDATE_BANKING_INFO,
  payload: rec,
});

export const updateBankingInfoSuccess = (rec) => ({
  type: UPDATE_BANKING_INFO_SUCCESS,
  payload: rec,
});

export const updateBankingInfoFail = (error) => ({
  type: UPDATE_BANKING_INFO_FAIL,
  payload: error,
});

export const resetUser = () => ({
  type: RESET_USER,
});
