import {
  ADD_NEW_TRANSACTION_HISTORY,
  ADD_NEW_TRANSACTION_HISTORY_FAIL,
  ADD_NEW_TRANSACTION_HISTORY_SUCCESS,
  DELETE_TRANSACTION_HISTORY,
  DELETE_TRANSACTION_HISTORY_FAIL,
  DELETE_TRANSACTION_HISTORY_SUCCESS,
  EXPORT_TOTAL_TRANSACTIONS,
  EXPORT_TOTAL_TRANSACTIONS_FAIL,
  EXPORT_TOTAL_TRANSACTIONS_SUCCESS,
  GET_TRANSACTION_HISTORY,
  GET_TRANSACTION_HISTORY_FAIL,
  GET_TRANSACTION_HISTORY_SUCCESS,
  SAVE_INVOICE_FILTERS,
  UPDATE_TRANSACTION_HISTORY,
  UPDATE_TRANSACTION_HISTORY_FAIL,
  UPDATE_TRANSACTION_HISTORY_SUCCESS
} from "./actionTypes";

export const getTransactionHistory = (rec) => ({
  type: GET_TRANSACTION_HISTORY,
  payload: rec
});

export const getTransactionHistorySuccess = (rec) => ({
  type: GET_TRANSACTION_HISTORY_SUCCESS,
  payload: rec
});

export const getTransactionHistoryFail = (error) => ({
  type: GET_TRANSACTION_HISTORY_FAIL,
  payload: error
});

export const updateTransactionHistory = (rec) => ({
  type: UPDATE_TRANSACTION_HISTORY,
  payload: rec
});

export const updateTransactionHistorySuccess = (rec) => ({
  type: UPDATE_TRANSACTION_HISTORY_SUCCESS,
  payload: rec
});

export const updateTransactionHistoryFail = (error) => ({
  type: UPDATE_TRANSACTION_HISTORY_FAIL,
  payload: error
});

export const addNewTransactionHistory = (rec) => ({
  type: ADD_NEW_TRANSACTION_HISTORY,
  payload: rec
});

export const addNewTransactionHistorySuccess = (rec) => ({
  type: ADD_NEW_TRANSACTION_HISTORY_SUCCESS,
  payload: rec
});

export const addNewTransactionHistoryFail = (error) => ({
  type: ADD_NEW_TRANSACTION_HISTORY_FAIL,
  payload: error
});

export const deleteTransactionHistory = (rec) => ({
  type: DELETE_TRANSACTION_HISTORY,
  payload: rec
});

export const deleteTransactionHistorySuccess = (rec) => ({
  type: DELETE_TRANSACTION_HISTORY_SUCCESS,
  payload: rec
});

export const deleteTransactionHistoryFail = (error) => ({
  type: DELETE_TRANSACTION_HISTORY_FAIL,
  payload: error
});

export const exportTotalTransactions = (rec) => ({
  type: EXPORT_TOTAL_TRANSACTIONS,
  payload: rec
});

export const exportTotalTransactionsSuccess = (rec) => ({
  type: EXPORT_TOTAL_TRANSACTIONS_SUCCESS,
  payload: rec
});

export const exportTotalTransactionsFail = (error) => ({
  type: EXPORT_TOTAL_TRANSACTIONS_FAIL,
  payload: error
});

export const saveInvoiceFilters = (rec) => ({
  type: SAVE_INVOICE_FILTERS,
  payload: rec
});
