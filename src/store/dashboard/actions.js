import {
  GET_TOTAL_ORDERS,
  GET_TOTAL_ORDERS_SUCCESS,
  GET_TOTAL_ORDERS_FAIL,
  GET_OPEN_ORDERS,
  GET_OPEN_ORDERS_SUCCESS,
  GET_OPEN_ORDERS_FAIL,
  GET_CANCEL_ORDERS,
  GET_CANCEL_ORDERS_SUCCESS,
  GET_CANCEL_ORDERS_FAIL,
  GET_TOTAL_ORDERS_PAYMENT,
  GET_TOTAL_ORDERS_PAYMENT_SUCCESS,
  GET_TOTAL_ORDERS_PAYMENT_FAIL,
  GET_TOP_PRODUCTS,
  GET_TOP_PRODUCTS_SUCCESS,
  GET_TOP_PRODUCTS_FAIL,
  GET_SELL_ORDER_REPORT,
  GET_SELL_ORDER_REPORT_SUCCESS,
  GET_SELL_ORDER_REPORT_FAIL,
  GET_MONTHLY_ORDER_REPORT,
  GET_MONTHLY_ORDER_REPORT_SUCCESS,
  GET_MONTHLY_ORDER_REPORT_FAIL,
} from "./actionTypes";

export const getTotalOrders = (rec) => ({
  type: GET_TOTAL_ORDERS,
  payload: rec,
});

export const getTotalOrdersSuccess = (rec) => ({
  type: GET_TOTAL_ORDERS_SUCCESS,
  payload: rec,
});

export const getTotalOrdersFail = (error) => ({
  type: GET_TOTAL_ORDERS_FAIL,
  payload: error,
});

export const getTotalOrdersPayment = (rec) => ({
  type: GET_TOTAL_ORDERS_PAYMENT,
  payload: rec,
});

export const getTotalOrdersPaymentSuccess = (rec) => ({
  type: GET_TOTAL_ORDERS_PAYMENT_SUCCESS,
  payload: rec,
});

export const getTotalOrdersPaymentFail = (error) => ({
  type: GET_TOTAL_ORDERS_PAYMENT_FAIL,
  payload: error,
});

export const getOpenOrders = (rec) => ({
  type: GET_OPEN_ORDERS,
  payload: rec,
});

export const getOpenOrdersSuccess = (rec) => ({
  type: GET_OPEN_ORDERS_SUCCESS,
  payload: rec,
});

export const getOpenOrdersFail = (error) => ({
  type: GET_OPEN_ORDERS_FAIL,
  payload: error,
});

export const getCancelOrders = (rec) => ({
  type: GET_CANCEL_ORDERS,
  payload: rec,
});

export const getCancelOrdersSuccess = (rec) => ({
  type: GET_CANCEL_ORDERS_SUCCESS,
  payload: rec,
});

export const getCancelOrdersFail = (error) => ({
  type: GET_CANCEL_ORDERS_FAIL,
  payload: error,
});

export const getTopProducts = (rec) => ({
  type: GET_TOP_PRODUCTS,
  payload: rec,
});

export const getTopProductsSuccess = (rec) => ({
  type: GET_TOP_PRODUCTS_SUCCESS,
  payload: rec,
});

export const getTopProductsFail = (error) => ({
  type: GET_TOP_PRODUCTS_FAIL,
  payload: error,
});

export const getSellOrderReport = (rec) => ({
  type: GET_SELL_ORDER_REPORT,
  payload: rec,
});

export const getSellOrderReportSuccess = (rec) => ({
  type: GET_SELL_ORDER_REPORT_SUCCESS,
  payload: rec,
});

export const getSellOrderReportFail = (error) => ({
  type: GET_SELL_ORDER_REPORT_FAIL,
  payload: error,
});

export const getMonthlyOrderReport = (rec) => ({
  type: GET_MONTHLY_ORDER_REPORT,
  payload: rec,
});

export const getMonthlyOrderReportSuccess = (rec) => ({
  type: GET_MONTHLY_ORDER_REPORT_SUCCESS,
  payload: rec,
});

export const getMonthlyOrderReportFail = (error) => ({
  type: GET_MONTHLY_ORDER_REPORT_FAIL,
  payload: error,
});
