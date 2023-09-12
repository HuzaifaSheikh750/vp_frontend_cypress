import {
  ADD_CURRENCY_CODE,
  ADD_CURRENCY_CODE_FAIL,
  ADD_CURRENCY_CODE_SUCCESS,
  DELETE_CURRENCY_CODE,
  DELETE_CURRENCY_CODE_FAIL,
  DELETE_CURRENCY_CODE_SUCCESS,
  GET_CURRENCY_CODE,
  GET_CURRENCY_CODE_FAIL,
  GET_CURRENCY_CODE_SUCCESS,
  UPDATE_CURRENCY_CODE,
  UPDATE_CURRENCY_CODE_FAIL,
  UPDATE_CURRENCY_CODE_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  currencyCode: {},
  loading: false,
  error: "",
  message: "",
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const CurrencyCodeReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_CURRENCY_CODE:
      return { ...state, loading: true };
    case GET_CURRENCY_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
        currencyCode: payload,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false
      };
    case GET_CURRENCY_CODE_FAIL:
      return { ...state, loading: false, error: payload };
    case UPDATE_CURRENCY_CODE:
      return { ...state, loading: true };
    case UPDATE_CURRENCY_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        message: payload
      };
    case UPDATE_CURRENCY_CODE_FAIL:
      return { ...state, loading: false, error: payload };
    case ADD_CURRENCY_CODE:
      return { ...state, loading: true };
    case ADD_CURRENCY_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccess: true,
        message: payload
      };
    case ADD_CURRENCY_CODE_FAIL:
      return { ...state, loading: false, error: payload };
    case DELETE_CURRENCY_CODE:
      return { ...state, loading: true };
    case DELETE_CURRENCY_CODE_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
        message: payload
      };
    case DELETE_CURRENCY_CODE_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return { ...state };
  }
};

export default CurrencyCodeReducer;
