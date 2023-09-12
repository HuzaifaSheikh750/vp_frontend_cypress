import {
  ADD_PAYMENT_TERM,
  ADD_PAYMENT_TERM_FAIL,
  ADD_PAYMENT_TERM_SUCCESS,
  DELETE_PAYMENT_TERM,
  DELETE_PAYMENT_TERM_FAIL,
  DELETE_PAYMENT_TERM_SUCCESS,
  GET_PAYMENT_TERM,
  GET_PAYMENT_TERM_FAIL,
  GET_PAYMENT_TERM_SUCCESS,
  UPDATE_PAYMENT_TERM,
  UPDATE_PAYMENT_TERM_FAIL,
  UPDATE_PAYMENT_TERM_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PaymentTerm: {},
  loading: false,
  error: "",
  message: "",
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const PaymentTermReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PAYMENT_TERM:
      return { ...state, loading: true };
    case GET_PAYMENT_TERM_SUCCESS:
      return {
        ...state,
        loading: false,
        PaymentTerm: payload,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false
      };
    case GET_PAYMENT_TERM_FAIL:
      return { ...state, loading: false, error: payload };
    case UPDATE_PAYMENT_TERM:
      return { ...state, loading: true };
    case UPDATE_PAYMENT_TERM_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        message: payload
      };
    case UPDATE_PAYMENT_TERM_FAIL:
      return { ...state, loading: false, error: payload };
    case ADD_PAYMENT_TERM:
      return { ...state, loading: true };
    case ADD_PAYMENT_TERM_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccess: true,
        message: payload
      };
    case ADD_PAYMENT_TERM_FAIL:
      return { ...state, loading: false, error: payload };
    case DELETE_PAYMENT_TERM:
      return { ...state, loading: true };
    case DELETE_PAYMENT_TERM_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
        message: payload
      };
    case DELETE_PAYMENT_TERM_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return { ...state };
  }
};

export default PaymentTermReducer;
