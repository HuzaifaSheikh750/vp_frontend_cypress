import {
  ADD_SITES,
  ADD_SITES_FAIL,
  ADD_SITES_SUCCESS,
  DELETE_SITES,
  DELETE_SITES_FAIL,
  DELETE_SITES_SUCCESS,
  GET_SITES,
  GET_SITES_FAIL,
  GET_SITES_SUCCESS,
  GET_SPECIFIC_SITES,
  GET_SPECIFIC_SITES_FAIL,
  GET_SPECIFIC_SITES_SUCCESS,
  UPDATE_SITES,
  UPDATE_SITES_FAIL,
  UPDATE_SITES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  Sites: {},
  Site : {},
  loading: false,
  error: "",
  message: "",
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const SitesReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_SITES:
      return { ...state, loading: true };
    case GET_SITES_SUCCESS:
      return {
        ...state,
        loading: false,
        Sites: payload,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false
      };
    case GET_SITES_FAIL:
      return { ...state, loading: false, error: payload };

    case GET_SPECIFIC_SITES:
      return { ...state, loading: true };
    case GET_SPECIFIC_SITES_SUCCESS:
      return {
        ...state,
        loading: false,
        Site: payload
      };
    case GET_SPECIFIC_SITES_FAIL:
      return { ...state, loading: false, error: payload };

    case UPDATE_SITES:
      return { ...state, loading: true };
    case UPDATE_SITES_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        message: payload
      };
    case UPDATE_SITES_FAIL:
      return { ...state, loading: false, error: payload };
    case ADD_SITES:
      return { ...state, loading: true };
    case ADD_SITES_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccess: true,
        message: payload
      };
    case ADD_SITES_FAIL:
      return { ...state, loading: false, error: payload };
    case DELETE_SITES:
      return { ...state, loading: true };
    case DELETE_SITES_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
        message: payload
      };
    case DELETE_SITES_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return { ...state };
  }
};

export default SitesReducer;
