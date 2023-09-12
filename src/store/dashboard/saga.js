import { call, put, takeEvery } from "redux-saga/effects";

// Dashboard Redux States
import {
  GET_TOTAL_ORDERS,
  GET_OPEN_ORDERS,
  GET_CANCEL_ORDERS,
  GET_TOTAL_ORDERS_PAYMENT,
  GET_TOP_PRODUCTS,
  GET_SELL_ORDER_REPORT,
  GET_MONTHLY_ORDER_REPORT,
} from "./actionTypes";
import {
  getTotalOrdersSuccess,
  getTotalOrdersFail,
  getOpenOrdersSuccess,
  getOpenOrdersFail,
  getCancelOrdersSuccess,
  getCancelOrdersFail,
  getTotalOrdersPaymentSuccess,
  getTotalOrdersPaymentFail,
  getTopProductsSuccess,
  getTopProductsFail,
  getSellOrderReportSuccess,
  getSellOrderReportFail,
  getMonthlyOrderReportSuccess,
  getMonthlyOrderReportFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  TotalOrders,
  OpenOrders,
  CancelOrders,
  TotalOrdersPayment,
  MonthTopProducts,
  MonthlyOrderReport,
  SalesOrderReportHistory,
} from "../../helpers/backend_helper";

function* fetchTotalOrders({ payload: rec }) {
  try {
    const response = yield call(TotalOrders, rec);
    yield put(getTotalOrdersSuccess(response));
  } catch (error) {
    yield put(getTotalOrdersFail(error));
  }
}

function* fetchOpenOrders({ payload: rec }) {
  try {
    const response = yield call(OpenOrders, rec);
    yield put(getOpenOrdersSuccess(response));
  } catch (error) {
    yield put(getOpenOrdersFail(error));
  }
}

function* fetchCancelOrders({ payload: rec }) {
  try {
    const response = yield call(CancelOrders, rec);
    yield put(getCancelOrdersSuccess(response));
  } catch (error) {
    yield put(getCancelOrdersFail(error));
  }
}

function* fetchTotalOrdersPayment({ payload: rec }) {
  try {
    const response = yield call(TotalOrdersPayment, rec);
    yield put(getTotalOrdersPaymentSuccess(response));
  } catch (error) {
    yield put(getTotalOrdersPaymentFail(error));
  }
}

function* fetchTopProducts({ payload: rec }) {
  try {
    const response = yield call(MonthTopProducts, rec);
    yield put(getTopProductsSuccess(response));
  } catch (error) {
    yield put(getTopProductsFail(error));
  }
}

function* fetchSalesReport({ payload: rec }) {
  try {
    const response = yield call(SalesOrderReportHistory, rec);
    yield put(getSellOrderReportSuccess(response));
  } catch (error) {
    yield put(getSellOrderReportFail(error));
  }
}

function* fetchOrderReport({ payload: rec }) {
  try {
    const response = yield call(MonthlyOrderReport, rec);
    yield put(getMonthlyOrderReportSuccess(response));
  } catch (error) {
    yield put(getMonthlyOrderReportFail(error));
  }
}

function* DashboardSaga() {
  yield takeEvery(GET_TOTAL_ORDERS, fetchTotalOrders);
  yield takeEvery(GET_OPEN_ORDERS, fetchOpenOrders);
  yield takeEvery(GET_CANCEL_ORDERS, fetchCancelOrders);
  yield takeEvery(GET_TOTAL_ORDERS_PAYMENT, fetchTotalOrdersPayment);
  yield takeEvery(GET_TOP_PRODUCTS, fetchTopProducts);
  yield takeEvery(GET_SELL_ORDER_REPORT, fetchSalesReport);
  yield takeEvery(GET_MONTHLY_ORDER_REPORT, fetchOrderReport);
}

export default DashboardSaga;
