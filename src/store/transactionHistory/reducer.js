import {
  ADD_NEW_TRANSACTION_HISTORY_FAIL,
  ADD_NEW_TRANSACTION_HISTORY_SUCCESS,
  DELETE_TRANSACTION_HISTORY_FAIL,
  DELETE_TRANSACTION_HISTORY_SUCCESS,
  EXPORT_TOTAL_TRANSACTIONS_FAIL,
  EXPORT_TOTAL_TRANSACTIONS_SUCCESS,
  GET_TRANSACTION_HISTORY_FAIL,
  GET_TRANSACTION_HISTORY_SUCCESS,
  SAVE_INVOICE_FILTERS,
  UPDATE_TRANSACTION_HISTORY_FAIL,
  UPDATE_TRANSACTION_HISTORY_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  TransactionHistorys: [],
  totalTransactions: [],
  SavedDateRange: "",
  SavedPaymentId: "",
  SavedPaymentStatus: ""
};

const TransactionHistoryReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_NEW_TRANSACTION_HISTORY_SUCCESS:
      return {
        ...state,
        TransactionHistorys: [...state.TransactionHistory, action.payload]
      };

    case ADD_NEW_TRANSACTION_HISTORY_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case GET_TRANSACTION_HISTORY_SUCCESS:
      return action.payload
        ? {
            ...state,
            TransactionHistorys: action.payload
          }
        : {
            ...state,
            TransactionHistorys: { message: "No Content Found" }
          };

    case GET_TRANSACTION_HISTORY_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case UPDATE_TRANSACTION_HISTORY_SUCCESS:
      return {
        ...state,
        TransactionHistorys: state.TransactionHistory.map((data) => {
          return data.code.toString() === action.payload.data.code.toString()
            ? { data, ...action.payload.data }
            : data;
        })
      };

    case UPDATE_TRANSACTION_HISTORY_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case DELETE_TRANSACTION_HISTORY_SUCCESS:
      return {
        ...state,
        TransactionHistorys: state.TransactionHistory.filter(
          (data) => data.code.toString() !== action.payload.data.code.toString()
        )
      };
    case DELETE_TRANSACTION_HISTORY_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case EXPORT_TOTAL_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        totalTransactions: action.payload
      };

    case EXPORT_TOTAL_TRANSACTIONS_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case SAVE_INVOICE_FILTERS:
      return {
        ...state,
        SavedDateRange: action.payload.dateRange,
        SavedPaymentId: action.payload.paymentId,
        SavedPaymentStatus: action.payload.paymentStatus
      };

    default:
      return state;
  }
};

export default TransactionHistoryReducer;
