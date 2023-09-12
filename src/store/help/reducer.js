import {
  ADD_NEW_CONTACT_FAIL,
  ADD_NEW_CONTACT_SUCCESS,
  CLEAR_ALL_IMAGE,
  CLEAR_IMAGE,
  GET_ALL_CONTACT_FAIL,
  GET_ALL_CONTACT_SUCCESS,
  GET_CONTACT_DETAILS_FAIL,
  GET_CONTACT_DETAILS_SUCCESS,
  UPLOAD_IMAGE,
  UPLOAD_IMAGE_FAIL,
  UPLOAD_IMAGE_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  contacts: {},
  contact: {},
  urls: [],
  error: null,
  loading: false,
  posted: false
};

const HelpReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_NEW_CONTACT_SUCCESS:
      return {
        ...state,
        // contact: [...state.contact, action.payload],
        posted: true
      };

    case ADD_NEW_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
        posted: false
      };

    case UPLOAD_IMAGE:
      return {
        ...state,
        loading: true,
        error: null,
        urls: null
      };

    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        urls: action.payload,
        loading: false,
        error: null
      };

    case UPLOAD_IMAGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case CLEAR_IMAGE:
      const urls = state.urls;

      if (urls.length > 0) {
        urls.filter((url) => url.filename.indexOf(action.payload) === -1);
      }
      return {
        ...state,
        urls,
        posted: false
      };

    case CLEAR_ALL_IMAGE:
      return {
        ...state,
        urls: [],
        posted: false
      };

    case GET_ALL_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: action.payload
      };

    case GET_ALL_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case GET_CONTACT_DETAILS_SUCCESS:
      return {
        ...state,
        contact: action.payload
      };

    case GET_CONTACT_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case GET_CONTACT_DETAILS_SUCCESS:
      return {
        ...state,
        contact: action.payload
      };

    case GET_CONTACT_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};

export default HelpReducer;
