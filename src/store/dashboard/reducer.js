import {
  GET_CANCEL_ORDERS,
  GET_CANCEL_ORDERS_FAIL,
  GET_CANCEL_ORDERS_SUCCESS,
  GET_MONTHLY_ORDER_REPORT,
  GET_MONTHLY_ORDER_REPORT_FAIL,
  GET_MONTHLY_ORDER_REPORT_SUCCESS,
  GET_OPEN_ORDERS,
  GET_OPEN_ORDERS_FAIL,
  GET_OPEN_ORDERS_SUCCESS,
  GET_SELL_ORDER_REPORT,
  GET_SELL_ORDER_REPORT_FAIL,
  GET_SELL_ORDER_REPORT_SUCCESS,
  GET_TOP_PRODUCTS,
  GET_TOP_PRODUCTS_FAIL,
  GET_TOP_PRODUCTS_SUCCESS,
  GET_TOTAL_ORDERS,
  GET_TOTAL_ORDERS_FAIL,
  GET_TOTAL_ORDERS_PAYMENT,
  GET_TOTAL_ORDERS_PAYMENT_FAIL,
  GET_TOTAL_ORDERS_PAYMENT_SUCCESS,
  GET_TOTAL_ORDERS_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  TotalOrders: {},
  OpenOrders: {},
  CancelOrders: {},
  TotalOrdersPayment: {},
  TopProducts: [],
  SalesReport: [],
  OrderReport: [],

  TotalOrdersLoading: false,
  TotalOrdersLoadingError: null,

  OpenOrdersLoading: false,
  OpenOrdersLoadingError: null,

  CancelOrdersLoading: false,
  CancelOrdersLoadingError: null,

  TotalOrdersPaymentLoading: false,
  TotalOrdersPaymentLoadingError: null,

  TopProductsLoading: false,
  TopProductsLoadingError: null,

  SalesReportLoading: false,
  SalesReportLoadingError: null,

  OrderReportLoading: false,
  OrderReportLoadingError: null
};

const DashboardReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TOTAL_ORDERS:
      return {
        ...state,
        TotalOrdersLoading: true,
        TotalOrdersLoadingError: null
      };

    case GET_TOTAL_ORDERS_SUCCESS:
      return {
        ...state,
        TotalOrders: action.payload,
        TotalOrdersLoading: false,
        TotalOrdersLoadingError: null
      };

    case GET_TOTAL_ORDERS_FAIL:
      return {
        ...state,
        TotalOrdersLoading: false,
        TotalOrdersLoadingError: action.payload
      };

    case GET_TOTAL_ORDERS_PAYMENT:
      return {
        ...state,
        TotalOrdersPaymentLoading: true,
        TotalOrdersPaymentLoadingError: null
      };

    case GET_TOTAL_ORDERS_PAYMENT_SUCCESS:
      return {
        ...state,
        TotalOrdersPayment: action.payload,
        TotalOrdersPaymentLoading: false,
        TotalOrdersPaymentLoadingError: null
      };

    case GET_TOTAL_ORDERS_PAYMENT_FAIL:
      return {
        ...state,
        TotalOrdersPaymentLoading: false,
        TotalOrdersPaymentLoadingError: action.payload
      };

    case GET_OPEN_ORDERS:
      return {
        ...state,
        OpenOrdersLoading: true,
        OpenOrdersLoadingError: null
      };

    case GET_OPEN_ORDERS_SUCCESS:
      return {
        ...state,
        OpenOrders: action.payload,
        OpenOrdersLoading: false,
        OpenOrdersLoadingError: null
      };

    case GET_OPEN_ORDERS_FAIL:
      return {
        ...state,
        OpenOrdersLoading: false,
        OpenOrdersLoadingError: action.payload
      };

    case GET_CANCEL_ORDERS:
      return {
        ...state,
        CancelOrdersLoading: true,
        CancelOrdersLoadingError: null
      };

    case GET_CANCEL_ORDERS_SUCCESS:
      return {
        ...state,
        CancelOrders: action.payload,
        CancelOrdersLoading: false,
        CancelOrdersLoadingError: null
      };

    case GET_CANCEL_ORDERS_FAIL:
      return {
        ...state,
        CancelOrdersLoading: false,
        CancelOrdersLoadingError: action.payload
      };

    case GET_TOP_PRODUCTS:
      return {
        ...state,
        TopProductsLoading: true,
        TopProductsLoadingError: null
      };

    case GET_TOP_PRODUCTS_SUCCESS:
      return {
        ...state,
        TopProducts: action.payload,
        TopProductsLoading: false,
        TopProductsLoadingError: null
      };

    case GET_TOP_PRODUCTS_FAIL:
      return {
        ...state,
        TopProductsLoading: false,
        TopProductsLoadingError: action.payload
      };

    case GET_SELL_ORDER_REPORT:
      return {
        ...state,
        SalesReportLoading: true,
        SalesReportLoadingError: null
      };

    case GET_SELL_ORDER_REPORT_SUCCESS:
      return {
        ...state,
        SalesReport: action.payload,
        SalesReportLoading: false,
        SalesReportLoadingError: null
      };

    case GET_SELL_ORDER_REPORT_FAIL:
      return {
        ...state,
        SalesReportLoading: false,
        SalesReportLoadingError: action.payload
      };

    case GET_MONTHLY_ORDER_REPORT:
      return {
        ...state,
        OrderReportLoading: true,
        OrderReportLoadingError: null
      };

    case GET_MONTHLY_ORDER_REPORT_SUCCESS:
      return {
        ...state,
        OrderReport: action.payload,
        OrderReportLoading: false,
        OrderReportLoadingError: null
      };

    case GET_MONTHLY_ORDER_REPORT_FAIL:
      return {
        ...state,
        OrderReportLoading: false,
        OrderReportLoadingError: action.payload
      };

    default:
      return state;
  }
};

export default DashboardReducer;
