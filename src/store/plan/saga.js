import {
  GET_PLAN,
  GET_PLAN_FAIL,
  GET_PLAN_SUCCESS,
  UPDATE_PLAN,
  UPDATE_PLAN_FAIL,
  UPDATE_PLAN_SUCCESS
} from "./actionTypes";
import { call, put, takeEvery } from "redux-saga/effects";
import { getPlanCall, updatePlanCall } from "../../helpers/backend_helper";
import { getPlanFail, getPlanSuccess, updatePlanFail, updatePlanSuccess } from "./actions";

function* fetchPlan({ payload: planId }) {
  try {
    const response = yield call(getPlanCall, planId);
    // const response = {
    //   status: 200,
    //   data: {
    //     message: "Get all the plans",
    //     plans: [
    //       {
    //         planId: "basic",
    //         name: "Basic",
    //         min_users_allowed: 5,
    //         details: {
    //           functionality_allowed: [
    //             "Create sales orders, re-order",
    //             "Account statement",
    //             "View invoices",
    //             "Notifications",
    //             "View product catalogue",
    //             "One admin user included"
    //           ],
    //           pricing_details: [
    //             {
    //               billing_term: "1-month",
    //               price: 6,
    //               payment_type: "one-time payment"
    //             },
    //             {
    //               billing_term: "1-year",
    //               price: 5,
    //               payment_type: "per month"
    //             },
    //             {
    //               billing_term: "2-year",
    //               price: 4,
    //               payment_type: "per month"
    //             },
    //             {
    //               billing_term: "3-year",
    //               price: 3,
    //               payment_type: "per month"
    //             }
    //           ]
    //         }
    //       },
    //       {
    //         planId: "advance",
    //         name: "Advance",
    //         min_users_allowed: 5,
    //         details: {
    //           functionality_allowed: [
    //             "Create sales orders, re-order",
    //             "Account statement",
    //             "View invoices",
    //             "Notifications",
    //             "View product catalogue",
    //             "One admin user included",
    //             "Pay invoices",
    //             "Shopping cart experience"
    //           ],
    //           pricing_details: [
    //             {
    //               billing_term: "1-month",
    //               price: 8,
    //               payment_type: "one-time payment"
    //             },
    //             {
    //               billing_term: "1-year",
    //               price: 7,
    //               payment_type: "per month"
    //             },
    //             {
    //               billing_term: "2-year",
    //               price: 6,
    //               payment_type: "per month"
    //             },
    //             {
    //               billing_term: "3-year",
    //               price: 5,
    //               payment_type: "per month"
    //             }
    //           ]
    //         }
    //       }
    //     ]
    //   }
    // };

    yield put(getPlanSuccess(response.data));
  } catch (error) {
    yield put(getPlanFail(error));
  }
}

function* updatePlan({ payload: plan }) {
  try {
    //
    const response = yield call(updatePlanCall, plan);
    // wait for 2 min to simulate the api call
    // yield new Promise((resolve) => setTimeout(resolve, 2000));
    // const response = {
    //   status: 200
    // };

    if (response?.status === 200) {
      yield put(updatePlanSuccess(response));
    }
  } catch (error) {
    if (error?.response?.status === 400) {
      yield put(updatePlanFail(error?.response?.data?.message));
    }
    //  yield put(updatePlanFail(error));
  }
}

function* PlanSaga() {
  yield takeEvery(GET_PLAN, fetchPlan);
  yield takeEvery(UPDATE_PLAN, updatePlan);
}

export default PlanSaga;
