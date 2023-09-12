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

export const getSourcing = (payload) => ({
  type: GET_SOURCING,
  payload
});

export const getSourcingSuccess = (payload) => ({
  type: GET_SOURCING_SUCCESS,
  payload
});

export const getSourcingFail = (payload) => ({
  type: GET_SOURCING_FAIL,
  payload
});

export const postSourcing = (payload) => ({
  type: POST_SOURCING,
  payload
});

export const postSourcingSuccess = (payload) => ({
  type: POST_SOURCING_SUCCESS,
  payload
});

export const postSourcingFail = (payload) => ({
  type: POST_SOURCING_FAIL,
  payload
});

export const updateSourcing = (payload) => ({
  type: UPDATE_SOURCING,
  payload
});

export const updateSourcingSuccess = (payload) => ({
  type: UPDATE_SOURCING_SUCCESS,
  payload
});

export const updateSourcingFail = (payload) => ({
  type: UPDATE_SOURCING_FAIL,
  payload
});

export const resetSourcingStatus = () => ({
  type: RESET_SOURCING_STATUS
});

export const deleteSourcing = (payload) => ({
  type: DELETE_SOURCING,
  payload
});

export const deleteSourcingSuccess = (payload) => ({
  type: DELETE_SOURCING_SUCCESS,
  payload
});

export const deleteSourcingFail = (payload) => ({
  type: DELETE_SOURCING_FAIL,
  payload
});

export const getSpecificSourcing = (payload) => ({
  type: GET_SPECIFIC_SOURCING,
  payload
});

export const getSpecificSourcingSuccess = (payload) => ({
  type: GET_SPECIFIC_SOURCING_SUCCESS,
  payload
});

export const getSpecificSourcingFail = (payload) => ({
  type: GET_SPECIFIC_SOURCING_FAIL,
  payload
});
