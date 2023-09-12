import {
  DELETE_INVOICE,
  DELETE_INVOICE_FAIL,
  DELETE_INVOICE_SUCCESS,
  GET_INVOICE,
  GET_INVOICE_FAIL,
  GET_INVOICE_SUCCESS,
  GET_SPECIFIC_INVOICE,
  GET_SPECIFIC_INVOICE_FAIL,
  GET_SPECIFIC_INVOICE_SUCCESS,
  POST_INVOICE,
  POST_INVOICE_FAIL,
  POST_INVOICE_SUCCESS,
  RESET_INVOICE_STATUS,
  UPDATE_INVOICE,
  UPDATE_INVOICE_FAIL,
  UPDATE_INVOICE_SUCCESS,
} from "./actionTypes";

export const getInvoice = (payload) => ({
  type: GET_INVOICE,
  payload,
});

export const getInvoiceSuccess = (payload) => ({
  type: GET_INVOICE_SUCCESS,
  payload,
});

export const getInvoiceFail = (payload) => ({
  type: GET_INVOICE_FAIL,
  payload,
});

export const postInvoice = (payload) => ({
  type: POST_INVOICE,
  payload,
});

export const postInvoiceSuccess = (payload) => ({
  type: POST_INVOICE_SUCCESS,
  payload,
});

export const postInvoiceFail = (payload) => ({
  type: POST_INVOICE_FAIL,
  payload,
});

export const updateInvoice = (payload) => ({
  type: UPDATE_INVOICE,
  payload,
});

export const updateInvoiceSuccess = (payload) => ({
  type: UPDATE_INVOICE_SUCCESS,
  payload,
});

export const updateInvoiceFail = (payload) => ({
  type: UPDATE_INVOICE_FAIL,
  payload,
});

export const resetInvoiceStatus = () => ({
  type: RESET_INVOICE_STATUS,
});

export const deleteInvoice = (payload) => ({
  type: DELETE_INVOICE,
  payload,
});

export const deleteInvoiceSuccess = (payload) => ({
  type: DELETE_INVOICE_SUCCESS,
  payload,
});

export const deleteInvoiceFail = (payload) => ({
  type: DELETE_INVOICE_FAIL,
  payload,
});

export const getSpecificInvoice = (payload) => ({
  type: GET_SPECIFIC_INVOICE,
  payload,
});

export const getSpecificInvoiceSuccess = (payload) => ({
  type: GET_SPECIFIC_INVOICE_SUCCESS,
  payload,
});

export const getSpecificInvoiceFail = (payload) => ({
  type: GET_SPECIFIC_INVOICE_FAIL,
  payload,
});
