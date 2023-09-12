import {
  DELETE_PURCHASE_AGREEMENT,
  DELETE_PURCHASE_AGREEMENT_FAIL,
  DELETE_PURCHASE_AGREEMENT_SUCCESS,
  GET_PURCHASE_AGREEMENT,
  GET_PURCHASE_AGREEMENT_FAIL,
  GET_PURCHASE_AGREEMENT_SUCCESS,
  GET_SPECIFIC_PURCHASE_AGREEMENT,
  GET_SPECIFIC_PURCHASE_AGREEMENT_FAIL,
  GET_SPECIFIC_PURCHASE_AGREEMENT_SUCCESS,
  POST_PURCHASE_AGREEMENT,
  POST_PURCHASE_AGREEMENT_FAIL,
  POST_PURCHASE_AGREEMENT_SUCCESS,
  RESET_PURCHASE_AGREEMENT_STATUS,
  UPDATE_PURCHASE_AGREEMENT,
  UPDATE_PURCHASE_AGREEMENT_FAIL,
  UPDATE_PURCHASE_AGREEMENT_SUCCESS
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
  purchaseAgreements: {},
  purchaseAgreement: {}
};

const purchaseAgreementReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PURCHASE_AGREEMENT:
      return {
        ...state,
        loading: true,
        error: "",
        added: false
      };

    case GET_PURCHASE_AGREEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        purchaseAgreements: action.payload
      };
    case GET_PURCHASE_AGREEMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case POST_PURCHASE_AGREEMENT:
      return {
        ...state,
        loadingForAdd: true,
        error: "",
        added: false
      };
    case POST_PURCHASE_AGREEMENT_SUCCESS:
      return {
        ...state,
        loadingForAdd: false,
        added: true
      };
    case POST_PURCHASE_AGREEMENT_FAIL:
      return {
        ...state,
        loadingForAdd: false,
        error: action.payload,
        added: false
      };
    case UPDATE_PURCHASE_AGREEMENT:
      return {
        ...state,
        loadingForUpdate: true,
        error: "",
        updated: false
      };
    case UPDATE_PURCHASE_AGREEMENT_SUCCESS:
      return {
        ...state,
        loadingForUpdate: false,
        updated: true
      };
    case UPDATE_PURCHASE_AGREEMENT_FAIL:
      return {
        ...state,
        loadingForUpdate: false,
        error: action.payload,
        updated: false
      };

    case RESET_PURCHASE_AGREEMENT_STATUS:
      return {
        ...state,
        loadingForAdd: false,
        loadingForDelete: false,
        loadingForUpdate: false,
        added: false,
        updated: false,
        deleted: false
      };

    case DELETE_PURCHASE_AGREEMENT:
      return {
        ...state,
        loadingForDelete: true,
        error: "",
        deleted: false
      };

    case DELETE_PURCHASE_AGREEMENT_SUCCESS:
      return {
        ...state,
        loadingForDelete: false,
        deleted: true
      };

    case DELETE_PURCHASE_AGREEMENT_FAIL:
      return {
        ...state,
        loadingForDelete: false,
        error: action.payload,
        deleted: false
      };

    case GET_SPECIFIC_PURCHASE_AGREEMENT:
      return {
        ...state,
        loading: true,
        error: ""
      };

    case GET_SPECIFIC_PURCHASE_AGREEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        purchaseAgreement: action.payload
      };

    case GET_SPECIFIC_PURCHASE_AGREEMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default purchaseAgreementReducer;
