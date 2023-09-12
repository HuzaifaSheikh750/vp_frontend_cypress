import {
  ADD_NEW_PRODUCT_LIST,
  ADD_NEW_PRODUCT_LIST_FAIL,
  ADD_NEW_PRODUCT_LIST_SUCCESS,
  ADD_TO_CART,
  CLEAR_CART,
  CLEAR_PRODUCT_IMAGES,
  CLEAR_SINGLE_IMAGE,
  DELETE_PRODUCT_LIST,
  DELETE_PRODUCT_LIST_FAIL,
  DELETE_PRODUCT_LIST_SUCCESS,
  GET_PRODUCT_LIST,
  GET_PRODUCT_LIST_FAIL,
  GET_PRODUCT_LIST_SUCCESS,
  QUANTITY_CHANGE,
  RESET_STATUS,
  UPDATE_PRODUCT_LIST,
  UPDATE_PRODUCT_LIST_FAIL,
  UPDATE_PRODUCT_LIST_SUCCESS,
  UPDATE_PRODUCT_STATUS,
  UPDATE_PRODUCT_STATUS_FAIL,
  UPDATE_PRODUCT_STATUS_SUCCESS,
  UPLOAD_PRODUCT_IMAGE,
  UPLOAD_PRODUCT_IMAGE_FAIL,
  UPLOAD_PRODUCT_IMAGE_SUCCESS,
} from "./actionTypes";

export const getProductList = (rec) => ({
  type: GET_PRODUCT_LIST,
  payload: rec,
});

export const QuantityChange = (qObject) => {
  return {
    type: QUANTITY_CHANGE,
    payload: qObject,
    value: 0,
  };
};

export const clearCart = (rec) => ({
  type: CLEAR_CART,
  payload: rec,
});

export const AddtoCart = (rec) => ({
  type: ADD_TO_CART,
  payload: rec,
});

export const getProductListSuccess = (rec) => ({
  type: GET_PRODUCT_LIST_SUCCESS,
  payload: rec,
});

export const getProductListFail = (error) => ({
  type: GET_PRODUCT_LIST_FAIL,
  payload: error,
});

export const updateProductList = (rec) => ({
  type: UPDATE_PRODUCT_LIST,
  payload: rec,
});

export const updateProductListSuccess = (rec) => ({
  type: UPDATE_PRODUCT_LIST_SUCCESS,
  payload: rec,
});

export const updateProductListFail = (error) => ({
  type: UPDATE_PRODUCT_LIST_FAIL,
  payload: error,
});

export const addNewProductList = (rec) => ({
  type: ADD_NEW_PRODUCT_LIST,
  payload: rec,
});

export const addNewProductListSuccess = (rec) => ({
  type: ADD_NEW_PRODUCT_LIST_SUCCESS,
  payload: rec,
});

export const addNewProductListFail = (error) => ({
  type: ADD_NEW_PRODUCT_LIST_FAIL,
  payload: error,
});

export const deleteProductList = (rec) => ({
  type: DELETE_PRODUCT_LIST,
  payload: rec,
});

export const deleteProductListSuccess = (rec) => ({
  type: DELETE_PRODUCT_LIST_SUCCESS,
  payload: rec,
});

export const deleteProductListFail = (error) => ({
  type: DELETE_PRODUCT_LIST_FAIL,
  payload: error,
});

export const uploadProductImage = (rec) => ({
  type: UPLOAD_PRODUCT_IMAGE,
  payload: rec,
});

export const uploadProductImageSuccess = (rec) => ({
  type: UPLOAD_PRODUCT_IMAGE_SUCCESS,
  payload: rec,
});

export const uploadProductImageFail = (error) => ({
  type: UPLOAD_PRODUCT_IMAGE_FAIL,
  payload: error,
});

export const clearProductImages = () => ({
  type: CLEAR_PRODUCT_IMAGES,
});

export const clearSingleImage = (rec) => ({
  type: CLEAR_SINGLE_IMAGE,
  payload: rec,
});

export const resetStatus = () => ({
  type: RESET_STATUS,
});

export const updateProductStatus = (rec) => ({
  type: UPDATE_PRODUCT_STATUS,
  payload: rec,
});

export const updateProductStatusSuccess = (rec) => ({
  type: UPDATE_PRODUCT_STATUS_SUCCESS,
  payload: rec,
});

export const updateProductStatusFail = (error) => ({
  type: UPDATE_PRODUCT_STATUS_FAIL,
  payload: error,
});
