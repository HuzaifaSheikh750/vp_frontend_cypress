import { GET_VENDOR_LIST, GET_VENDOR_LIST_FAIL, GET_VENDOR_LIST_SUCCESS } from "./actionTypes";

const initialState = {
  vendors: [],
  vendor: {},
  loading: false,
  error: null
};

export default function vendorReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VENDOR_LIST:
      return {
        ...state,
        loading: true
      };
    case GET_VENDOR_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        vendors: action.payload
      };
    case GET_VENDOR_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
