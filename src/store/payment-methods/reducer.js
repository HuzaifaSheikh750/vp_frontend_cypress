import {
  ADD_PAYMENT_METHOD,
  ADD_PAYMENT_METHOD_FAIL,
  ADD_PAYMENT_METHOD_SUCCESS,
  DELETE_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD_FAIL,
  DELETE_PAYMENT_METHOD_SUCCESS,
  GET_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_FAIL,
  GET_PAYMENT_METHOD_SUCCESS,
  UPDATE_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD_FAIL,
  UPDATE_PAYMENT_METHOD_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PaymentMethod: {},
  loading: false,
  error: "",
  message: "",
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const PaymentMethodReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PAYMENT_METHOD:
      return { ...state, loading: true };
    case GET_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        loading: false,
        PaymentMethod: payload,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false
      };
    case GET_PAYMENT_METHOD_FAIL:
      return { ...state, loading: false, error: payload };
    case UPDATE_PAYMENT_METHOD:
      return { ...state, loading: true };
    case UPDATE_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        message: payload
      };
    case UPDATE_PAYMENT_METHOD_FAIL:
      return { ...state, loading: false, error: payload };
    case ADD_PAYMENT_METHOD:
      return { ...state, loading: true };
    case ADD_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccess: true,
        message: payload
      };
    case ADD_PAYMENT_METHOD_FAIL:
      return { ...state, loading: false, error: payload };
    case DELETE_PAYMENT_METHOD:
      return { ...state, loading: true };
    case DELETE_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
        message: payload
      };
    case DELETE_PAYMENT_METHOD_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return { ...state };
  }
};

export default PaymentMethodReducer;
