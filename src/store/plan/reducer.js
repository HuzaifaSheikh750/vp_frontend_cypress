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

const INIT_STATE = {
  plans: null,
  loading: false,
  result: 0, // 0: no result, 1: success, 2: fail
  error: null,
  updateerror: null
};

const PlanReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PLAN_SUCCESS:
      return {
        ...state,
        plans: action.payload.plans
      };

    case GET_PLAN_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case UPDATE_PLAN:
      return {
        ...state,
        loading: true,
        updateerror: null,
        result: 0
      };

    case UPDATE_PLAN_SUCCESS:
      return {
        ...state,
        loading: false,
        result: 1,
        updateerror: null
      };

    case UPDATE_PLAN_FAIL:
      return {
        ...state,
        loading: false,
        result: 2,
        updateerror: action.payload
      };

    case RESET_ERROR:
      return {
        ...state,
        error: null,
        result: 0
      };

    case RESET_ERROR_PLAN:
      return {
        ...state,
        updateerror: null,
        result: 0
      };

    default:
      return state;
  }
};

export default PlanReducer;
