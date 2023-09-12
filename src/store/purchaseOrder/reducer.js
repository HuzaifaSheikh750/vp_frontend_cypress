import {
  DELETE_PURCHASE_ORDER,
  DELETE_PURCHASE_ORDER_FAIL,
  DELETE_PURCHASE_ORDER_SUCCESS,
  GET_PURCHASE_ORDER,
  GET_PURCHASE_ORDER_FAIL,
  GET_PURCHASE_ORDER_SUCCESS,
  GET_SPECIFIC_PURCHASE_ORDER,
  GET_SPECIFIC_PURCHASE_ORDER_FAIL,
  GET_SPECIFIC_PURCHASE_ORDER_SUCCESS,
  POST_PURCHASE_ORDER,
  POST_PURCHASE_ORDER_FAIL,
  POST_PURCHASE_ORDER_SUCCESS,
  RESET_PURCHASE_ORDER_STATUS,
  UPDATE_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER_FAIL,
  UPDATE_PURCHASE_ORDER_SUCCESS
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
  purchaseOrders: {},
  purchaseOrder: {}
};

const PurchaseOrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PURCHASE_ORDER:
      return {
        ...state,
        loading: true,
        error: "",
        added: false
      };

    case GET_PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        purchaseOrders: action.payload
      };
    case GET_PURCHASE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_PURCHASE_ORDER:
      return {
        ...state,
        loadingForAdd: true,
        error: "",
        added: false
      };
    case POST_PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loadingForAdd: false,
        added: true
      };
    case POST_PURCHASE_ORDER_FAIL:
      return {
        ...state,
        loadingForAdd: false,
        error: action.payload,
        added: false
      };
    case UPDATE_PURCHASE_ORDER:
      return {
        ...state,
        loadingForUpdate: true,
        error: "",
        updated: false
      };
    case UPDATE_PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loadingForUpdate: false,
        updated: true
      };
    case UPDATE_PURCHASE_ORDER_FAIL:
      return {
        ...state,
        loadingForUpdate: false,
        error: action.payload,
        updated: false
      };

    case RESET_PURCHASE_ORDER_STATUS:
      return {
        ...state,
        loadingForAdd: false,
        loadingForDelete: false,
        loadingForUpdate: false,
        added: false,
        updated: false,
        deleted: false
      };

    case DELETE_PURCHASE_ORDER:
      return {
        ...state,
        loadingForDelete: true,
        error: "",
        deleted: false
      };

    case DELETE_PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loadingForDelete: false,
        deleted: true
      };

    case DELETE_PURCHASE_ORDER_FAIL:
      return {
        ...state,
        loadingForDelete: false,
        error: action.payload,
        deleted: false
      };

    case GET_SPECIFIC_PURCHASE_ORDER:
      return {
        ...state,
        loading: true,
        error: ""
      };

    case GET_SPECIFIC_PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        purchaseOrder: action.payload
      };

    case GET_SPECIFIC_PURCHASE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default PurchaseOrderReducer;
