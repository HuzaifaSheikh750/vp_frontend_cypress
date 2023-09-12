import {
  ADD_SALES_UNIT,
  ADD_SALES_UNIT_FAIL,
  ADD_SALES_UNIT_SUCCESS,
  DELETE_SALES_UNIT,
  DELETE_SALES_UNIT_FAIL,
  DELETE_SALES_UNIT_SUCCESS,
  GET_SALES_UNIT,
  GET_SALES_UNIT_FAIL,
  GET_SALES_UNIT_SUCCESS,
  UPDATE_SALES_UNIT,
  UPDATE_SALES_UNIT_FAIL,
  UPDATE_SALES_UNIT_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  salesUnit: {},
  loading: false,
  error: "",
  message: "",
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const SalesUnitReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_SALES_UNIT:
      return { ...state, loading: true };
    case GET_SALES_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        salesUnit: payload,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false
      };
    case GET_SALES_UNIT_FAIL:
      return { ...state, loading: false, error: payload };
    case UPDATE_SALES_UNIT:
      return { ...state, loading: true };
    case UPDATE_SALES_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        message: payload
      };
    case UPDATE_SALES_UNIT_FAIL:
      return { ...state, loading: false, error: payload };
    case ADD_SALES_UNIT:
      return { ...state, loading: true };
    case ADD_SALES_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccess: true,
        message: payload
      };
    case ADD_SALES_UNIT_FAIL:
      return { ...state, loading: false, error: payload };
    case DELETE_SALES_UNIT:
      return { ...state, loading: true };
    case DELETE_SALES_UNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
        message: payload
      };
    case DELETE_SALES_UNIT_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return { ...state };
  }
};

export default SalesUnitReducer;
