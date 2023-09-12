import {
  GET_PLAN,
  GET_PLAN_FAIL,
  GET_PLAN_SUCCESS,
  RESET_ERROR,
  RESET_ERROR_PLAN,
  UPDATE_PLAN,
  UPDATE_PLAN_FAIL,
  UPDATE_PLAN_SUCCESS
} from "./actionTypes";

export const getAllPlan = () => ({
  type: GET_PLAN
});

export const getPlanSuccess = (plan) => ({
  type: GET_PLAN_SUCCESS,
  payload: plan
});

export const getPlanFail = (error) => ({
  type: GET_PLAN_FAIL,
  payload: error
});

export const updatePlan = (plan) => ({
  type: UPDATE_PLAN,
  payload: plan
});

export const updatePlanSuccess = (plan) => ({
  type: UPDATE_PLAN_SUCCESS,
  payload: plan
});

export const updatePlanFail = (error) => ({
  type: UPDATE_PLAN_FAIL,
  payload: error
});

export const clearResponse = () => ({
  type: RESET_ERROR
});

export const clearError = () => ({
  type: RESET_ERROR_PLAN
});
