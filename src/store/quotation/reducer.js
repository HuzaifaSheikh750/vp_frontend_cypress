import {
  DELETE_QUOTATION,
  DELETE_QUOTATION_FAIL,
  DELETE_QUOTATION_SUCCESS,
  GET_QUOTATION,
  GET_QUOTATION_FAIL,
  GET_QUOTATION_SUCCESS,
  GET_REASONING_LIST,
  GET_REASONING_LIST_FAIL,
  GET_REASONING_LIST_SUCCESS,
  GET_SPECIFIC_QUOTATION,
  GET_SPECIFIC_QUOTATION_FAIL,
  GET_SPECIFIC_QUOTATION_SUCCESS,
  POST_QUOTATION,
  POST_QUOTATION_FAIL,
  POST_QUOTATION_SUCCESS,
  RESET_QUOTATION_STATUS,
  UPDATE_QUOTATION,
  UPDATE_QUOTATION_FAIL,
  UPDATE_QUOTATION_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  loading: false,
  error: "",
  added: false,
  updated: false,
  deleted: false,
  loadingForAdd: false,
  loadingForUpdate: false,
  loadingForDelete: false,
  quotations: {},
  quotation: {},
  reasoningList: [],
};

const quotationReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_QUOTATION:
      return {
        ...state,
        loading: true,
        error: "",
        added: false,
      };

    case GET_QUOTATION_SUCCESS:
      return {
        ...state,
        loading: false,
        quotations: action.payload,
      };
    case GET_QUOTATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case POST_QUOTATION:
      return {
        ...state,
        loadingForAdd: true,
        error: "",
        added: false,
      };
    case POST_QUOTATION_SUCCESS:
      return {
        ...state,
        loadingForAdd: false,
        added: true,
      };
    case POST_QUOTATION_FAIL:
      return {
        ...state,
        loadingForAdd: false,
        error: action.payload,
        added: false,
      };
    case UPDATE_QUOTATION:
      return {
        ...state,
        loadingForUpdate: true,
        error: "",
        updated: false,
      };
    case UPDATE_QUOTATION_SUCCESS:
      return {
        ...state,
        loadingForUpdate: false,
        updated: true,
      };
    case UPDATE_QUOTATION_FAIL:
      return {
        ...state,
        loadingForUpdate: false,
        error: action.payload,
        updated: false,
      };

    case RESET_QUOTATION_STATUS:
      return {
        ...state,
        loadingForAdd: false,
        loadingForDelete: false,
        loadingForUpdate: false,
        added: false,
        updated: false,
        deleted: false,
      };

    case DELETE_QUOTATION:
      return {
        ...state,
        loadingForDelete: true,
        error: "",
        deleted: false,
      };

    case DELETE_QUOTATION_SUCCESS:
      return {
        ...state,
        loadingForDelete: false,
        deleted: true,
      };

    case DELETE_QUOTATION_FAIL:
      return {
        ...state,
        loadingForDelete: false,
        error: action.payload,
        deleted: false,
      };

    case GET_SPECIFIC_QUOTATION:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case GET_SPECIFIC_QUOTATION_SUCCESS:
      return {
        ...state,
        loading: false,
        quotation: action.payload,
      };

    case GET_SPECIFIC_QUOTATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_REASONING_LIST:
      return {
        ...state,
      };

    case GET_REASONING_LIST_SUCCESS:
      return {
        ...state,
        reasoningList: action.payload,
      };

    case GET_REASONING_LIST_FAIL:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default quotationReducer;
