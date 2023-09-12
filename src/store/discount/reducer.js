import {
  ADD_DISCOUNT,
  ADD_DISCOUNT_FAIL,
  ADD_DISCOUNT_SUCCESS,
  DELETE_DISCOUNT,
  DELETE_DISCOUNT_FAIL,
  DELETE_DISCOUNT_SUCCESS,
  GET_DISCOUNT,
  GET_DISCOUNT_FAIL,
  GET_DISCOUNT_SUCCESS,
  UPDATE_DISCOUNT,
  UPDATE_DISCOUNT_FAIL,
  UPDATE_DISCOUNT_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  Discount: {},
  loading: false,
  error: "",
  message: "",
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

const DiscountReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_DISCOUNT:
      return { ...state, loading: true };
    case GET_DISCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        Discount: payload,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
      };
    case GET_DISCOUNT_FAIL:
      return { ...state, loading: false, error: payload };
    case UPDATE_DISCOUNT:
      return { ...state, loading: true };
    case UPDATE_DISCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        message: payload,
      };
    case UPDATE_DISCOUNT_FAIL:
      return { ...state, loading: false, error: payload };
    case ADD_DISCOUNT:
      return { ...state, loading: true };
    case ADD_DISCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccess: true,
        message: payload,
      };
    case ADD_DISCOUNT_FAIL:
      return { ...state, loading: false, error: payload };
    case DELETE_DISCOUNT:
      return { ...state, loading: true };
    case DELETE_DISCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
        message: payload,
      };
    case DELETE_DISCOUNT_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return { ...state };
  }
};

export default DiscountReducer;
