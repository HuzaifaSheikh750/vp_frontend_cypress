import {
  DELETE_SOURCING,
  DELETE_SOURCING_FAIL,
  DELETE_SOURCING_SUCCESS,
  GET_SOURCING,
  GET_SOURCING_FAIL,
  GET_SOURCING_SUCCESS,
  GET_SPECIFIC_SOURCING,
  GET_SPECIFIC_SOURCING_FAIL,
  GET_SPECIFIC_SOURCING_SUCCESS,
  POST_SOURCING,
  POST_SOURCING_FAIL,
  POST_SOURCING_SUCCESS,
  RESET_SOURCING_STATUS,
  UPDATE_SOURCING,
  UPDATE_SOURCING_FAIL,
  UPDATE_SOURCING_SUCCESS
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
  sourcings: {},
  sourcing: {}
};

const sourcingReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SOURCING:
      return {
        ...state,
        loading: true,
        error: "",
        added: false
      };

    case GET_SOURCING_SUCCESS:
      return {
        ...state,
        loading: false,
        sourcings: action.payload
      };
    case GET_SOURCING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_SOURCING:
      return {
        ...state,
        loadingForAdd: true,
        error: "",
        added: false
      };
    case POST_SOURCING_SUCCESS:
      return {
        ...state,
        loadingForAdd: false,
        added: true
      };
    case POST_SOURCING_FAIL:
      return {
        ...state,
        loadingForAdd: false,
        error: action.payload,
        added: false
      };
    case UPDATE_SOURCING:
      return {
        ...state,
        loadingForUpdate: true,
        error: "",
        updated: false
      };
    case UPDATE_SOURCING_SUCCESS:
      return {
        ...state,
        loadingForUpdate: false,
        updated: true
      };
    case UPDATE_SOURCING_FAIL:
      return {
        ...state,
        loadingForUpdate: false,
        error: action.payload,
        updated: false
      };

    case RESET_SOURCING_STATUS:
      return {
        ...state,
        loadingForAdd: false,
        loadingForDelete: false,
        loadingForUpdate: false,
        added: false,
        updated: false,
        deleted: false
      };

    case DELETE_SOURCING:
      return {
        ...state,
        loadingForDelete: true,
        error: "",
        deleted: false
      };

    case DELETE_SOURCING_SUCCESS:
      return {
        ...state,
        loadingForDelete: false,
        deleted: true
      };

    case DELETE_SOURCING_FAIL:
      return {
        ...state,
        loadingForDelete: false,
        error: action.payload,
        deleted: false
      };

    case GET_SPECIFIC_SOURCING:
      return {
        ...state,
        loading: true,
        error: ""
      };

    case GET_SPECIFIC_SOURCING_SUCCESS:
      return {
        ...state,
        loading: false,
        sourcing: action.payload
      };

    case GET_SPECIFIC_SOURCING_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default sourcingReducer;
