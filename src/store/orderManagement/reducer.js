import {
  ADD_NEW_ORDER_MANAGEMENT,
  ADD_NEW_ORDER_MANAGEMENT_FAIL,
  ADD_NEW_ORDER_MANAGEMENT_SUCCESS,
  DELETE_ORDER_MANAGEMENT_FAIL,
  DELETE_ORDER_MANAGEMENT_SUCCESS,
  EXPORT_ALL_ORDERS_FAIL,
  EXPORT_ALL_ORDERS_SUCCESS,
  GET_ORDER_DETAILS_FAIL,
  GET_ORDER_DETAILS_SUCCESS,
  GET_ORDER_MANAGEMENT,
  GET_ORDER_MANAGEMENT_FAIL,
  GET_ORDER_MANAGEMENT_SUCCESS,
  SAVE_FILTERS,
  UPDATE_ORDER_MANAGEMENT_FAIL,
  UPDATE_ORDER_MANAGEMENT_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  orderManagements: [],
  orderDetailsState: {},
  allOrders: [],
  SavedDateRange: "",
  SavedOrderId: "",
  SavedStatus: "",
  added: false
};

const OrderManagementReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        orderDetailsState: action.payload
      };

    case GET_ORDER_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case ADD_NEW_ORDER_MANAGEMENT:
      return {
        ...state,
        added: false
      };

    case ADD_NEW_ORDER_MANAGEMENT_SUCCESS:
      return {
        ...state,
        added: true
        // orderManagements: [...state.orderManagements, action.payload]
      };

    case ADD_NEW_ORDER_MANAGEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
        added: false
      };

    case GET_ORDER_MANAGEMENT:
      return {
        ...state,
        added: false
      };

    case GET_ORDER_MANAGEMENT_SUCCESS:
      return action.payload
        ? {
            ...state,
            orderManagements: action.payload,
            added: false
          }
        : {
            ...state,
            orderManagements: { message: "No Content Found" },
            added: false
          };

    // return {
    //   ...state,
    //   orderManagements: action.payload,
    // };

    case GET_ORDER_MANAGEMENT_FAIL:
      return {
        ...state,
        error: action.payload,
        added: false
      };

    case UPDATE_ORDER_MANAGEMENT_SUCCESS:
      return {
        ...state,
        orderManagements: state.orderManagements.map((data) => {
          return data.code.toString() === action.payload.data.code.toString()
            ? { data, ...action.payload.data }
            : data;
        })
      };

    case UPDATE_ORDER_MANAGEMENT_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case DELETE_ORDER_MANAGEMENT_SUCCESS:
      return {
        ...state,
        orderManagements: state.orderManagements.filter(
          (data) => data.code.toString() !== action.payload.data.code.toString()
        )
      };

    case DELETE_ORDER_MANAGEMENT_FAIL:
      return {
        ...state,
        error: action.payload
      };

    // case EXPORT_ALL_ORDERS:
    //   return {};

    case EXPORT_ALL_ORDERS_SUCCESS:
      return {
        ...state,
        allOrders: action.payload
      };

    case EXPORT_ALL_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case SAVE_FILTERS:
      return {
        ...state,
        SavedDateRange: action.payload.SavedDateRange,
        SavedOrderId: action.payload.SavedOrderId,
        SavedStatus: action.payload.SavedStatus
      };

    default:
      return state;
  }
};

export default OrderManagementReducer;
