import {
  DELETE_PURCHASE_AGREEMENT,
  DELETE_PURCHASE_AGREEMENT_FAIL,
  DELETE_PURCHASE_AGREEMENT_SUCCESS,
  GET_PURCHASE_AGREEMENT,
  GET_PURCHASE_AGREEMENT_FAIL,
  GET_PURCHASE_AGREEMENT_SUCCESS,
  GET_SPECIFIC_PURCHASE_AGREEMENT,
  GET_SPECIFIC_PURCHASE_AGREEMENT_FAIL,
  GET_SPECIFIC_PURCHASE_AGREEMENT_SUCCESS,
  POST_PURCHASE_AGREEMENT,
  POST_PURCHASE_AGREEMENT_FAIL,
  POST_PURCHASE_AGREEMENT_SUCCESS,
  RESET_PURCHASE_AGREEMENT_STATUS,
  UPDATE_PURCHASE_AGREEMENT,
  UPDATE_PURCHASE_AGREEMENT_FAIL,
  UPDATE_PURCHASE_AGREEMENT_SUCCESS
} from "./actionTypes";

export const getPurchaseAgreement = (payload) => ({
  type: GET_PURCHASE_AGREEMENT,
  payload
});

export const getPurchaseAgreementSuccess = (payload) => ({
  type: GET_PURCHASE_AGREEMENT_SUCCESS,
  payload
});

export const getPurchaseAgreementFail = (payload) => ({
  type: GET_PURCHASE_AGREEMENT_FAIL,
  payload
});

export const postPurchaseAgreement = (payload) => ({
  type: POST_PURCHASE_AGREEMENT,
  payload
});

export const postPurchaseAgreementSuccess = (payload) => ({
  type: POST_PURCHASE_AGREEMENT_SUCCESS,
  payload
});

export const postPurchaseAgreementFail = (payload) => ({
  type: POST_PURCHASE_AGREEMENT_FAIL,
  payload
});

export const updatePurchaseAgreement = (payload) => ({
  type: UPDATE_PURCHASE_AGREEMENT,
  payload
});

export const updatePurchaseAgreementSuccess = (payload) => ({
  type: UPDATE_PURCHASE_AGREEMENT_SUCCESS,
  payload
});

export const updatePurchaseAgreementFail = (payload) => ({
  type: UPDATE_PURCHASE_AGREEMENT_FAIL,
  payload
});

export const resetPurchaseAgreementStatus = () => ({
  type: RESET_PURCHASE_AGREEMENT_STATUS
});

export const deletePurchaseAgreement = (payload) => ({
  type: DELETE_PURCHASE_AGREEMENT,
  payload
});

export const deletePurchaseAgreementSuccess = (payload) => ({
  type: DELETE_PURCHASE_AGREEMENT_SUCCESS,
  payload
});

export const deletePurchaseAgreementFail = (payload) => ({
  type: DELETE_PURCHASE_AGREEMENT_FAIL,
  payload
});

export const getSpecificPurchaseAgreement = (payload) => ({
  type: GET_SPECIFIC_PURCHASE_AGREEMENT,
  payload
});

export const getSpecificPurchaseAgreementSuccess = (payload) => ({
  type: GET_SPECIFIC_PURCHASE_AGREEMENT_SUCCESS,
  payload
});

export const getSpecificPurchaseAgreementFail = (payload) => ({
  type: GET_SPECIFIC_PURCHASE_AGREEMENT_FAIL,
  payload
});
