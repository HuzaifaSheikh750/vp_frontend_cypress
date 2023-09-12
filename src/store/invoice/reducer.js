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

const INIT_STATE = {
  loading: false,
  error: "",
  added: false,
  updated: false,
  deleted: false,
  loadingForAdd: false,
  loadingForUpdate: false,
  loadingForDelete: false,
  invoices: {},
  invoice: {},
};

const PurchaseOrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INVOICE:
      return {
        ...state,
        loading: true,
        error: "",
        added: false,
      };

    case GET_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        invoices: action.payload,
      };
    case GET_INVOICE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case POST_INVOICE:
      return {
        ...state,
        loadingForAdd: true,
        error: "",
        added: false,
      };
    case POST_INVOICE_SUCCESS:
      return {
        ...state,
        loadingForAdd: false,
        added: true,
      };
    case POST_INVOICE_FAIL:
      return {
        ...state,
        loadingForAdd: false,
        error: action.payload,
        added: false,
      };
    case UPDATE_INVOICE:
      return {
        ...state,
        loadingForUpdate: true,
        error: "",
        updated: false,
      };
    case UPDATE_INVOICE_SUCCESS:
      return {
        ...state,
        loadingForUpdate: false,
        updated: true,
      };
    case UPDATE_INVOICE_FAIL:
      return {
        ...state,
        loadingForUpdate: false,
        error: action.payload,
        updated: false,
      };

    case RESET_INVOICE_STATUS:
      return {
        ...state,
        loadingForAdd: false,
        loadingForDelete: false,
        loadingForUpdate: false,
        added: false,
        updated: false,
        deleted: false,
      };

    case DELETE_INVOICE:
      return {
        ...state,
        loadingForDelete: true,
        error: "",
        deleted: false,
      };

    case DELETE_INVOICE_SUCCESS:
      return {
        ...state,
        loadingForDelete: false,
        deleted: true,
      };

    case DELETE_INVOICE_FAIL:
      return {
        ...state,
        loadingForDelete: false,
        error: action.payload,
        deleted: false,
      };

    case GET_SPECIFIC_INVOICE:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case GET_SPECIFIC_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        invoice: action.payload,
      };

    case GET_SPECIFIC_INVOICE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default PurchaseOrderReducer;
