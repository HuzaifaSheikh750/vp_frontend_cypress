import {
  ADD_NEW_SALES_ORDER_LIST_FAIL,
  ADD_NEW_SALES_ORDER_LIST_SUCCESS,
  CLEAR_SALES_ORDER_LIST,
  DELETE_SALES_ORDER_LIST,
  DELETE_SALES_ORDER_LIST_FAIL,
  DELETE_SALES_ORDER_LIST_SUCCESS,
  GET_SALES_ORDER_LIST,
  GET_SALES_ORDER_LIST_FAIL,
  GET_SALES_ORDER_LIST_SUCCESS,
  UPDATE_SALES_ORDER_LIST_FAIL,
  UPDATE_SALES_ORDER_LIST_SUCCESS,
  UPDATE_SALES_ORDER_STATUS,
  UPDATE_SALES_ORDER_STATUS_FAIL,
  UPDATE_SALES_ORDER_STATUS_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  salesOrderLists: [],
  updated: false,
  deleted: false
};

const SalesOrderListReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_NEW_SALES_ORDER_LIST_SUCCESS:
      return {
        ...state,
        salesOrderLists: [...state.salesOrderLists, action.payload]
      };

    case ADD_NEW_SALES_ORDER_LIST_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case GET_SALES_ORDER_LIST:
      return {
        ...state,
        updated: false,
        deleted: false
      };

    case GET_SALES_ORDER_LIST_SUCCESS:
      return action.payload
        ? {
            ...state,
            salesOrderLists: action.payload
          }
        : {
            ...state,
            salesOrderLists: { message: "No Content Found" }
          };

    // return {
    //   ...state,
    //   salesOrderLists: action.payload,
    // };

    case GET_SALES_ORDER_LIST_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case UPDATE_SALES_ORDER_LIST_SUCCESS:
      return {
        ...state,
        salesOrderLists: state.salesOrderLists.map((data) => {
          return data.code.toString() === action.payload.data.code.toString()
            ? { data, ...action.payload.data }
            : data;
        })
      };

    case UPDATE_SALES_ORDER_LIST_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case DELETE_SALES_ORDER_LIST:
      return {
        ...state,
        deleted: false
      };

    case DELETE_SALES_ORDER_LIST_SUCCESS:
      return {
        ...state,
        deleted: true

        // salesOrderLists: state.salesOrderLists.filter(
        //   (data) => data.code.toString() !== action.payload.data.code.toString()
        // )
      };

    case DELETE_SALES_ORDER_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
        deleted: false
      };

    case UPDATE_SALES_ORDER_STATUS:
      return {
        ...state,
        updated: false
      };

    case UPDATE_SALES_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        updated: true
      };

    case UPDATE_SALES_ORDER_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
        updated: false
      };

    case CLEAR_SALES_ORDER_LIST:
      return {
        ...state,
        salesOrderLists: []
      };

    // salesOrderLists: state.salesOrderLists.docs.map((data) => {

    default:
      return state;
  }
};

export default SalesOrderListReducer;
