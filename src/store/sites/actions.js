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
  UPDATE_SITES_SUCCESS
} from "./actionTypes";

export const getSites = (payload) => ({
  type: GET_SITES,
  payload
});

export const getSitesSuccess = (payload) => ({
  type: GET_SITES_SUCCESS,
  payload
});

export const getSitesFail = (payload) => ({
  type: GET_SITES_FAIL,
  payload
});

export const getSpecificSites = (payload) => ({
  type: GET_SPECIFIC_SITES,

  payload
});

export const getSpecificSitesSuccess = (payload) => ({
  type: GET_SPECIFIC_SITES_SUCCESS,
  payload
});

export const getSpecificSitesFail = (payload) => ({
  type: GET_SPECIFIC_SITES_FAIL,
  payload
});




export const updateSites = (payload) => ({
  type: UPDATE_SITES,
  payload
});

export const updateSitesSuccess = (payload) => ({
  type: UPDATE_SITES_SUCCESS,
  payload
});

export const updateSitesFail = (payload) => ({
  type: UPDATE_SITES_FAIL,
  payload
});

export const addSites = (payload) => ({
  type: ADD_SITES,
  payload
});

export const addSitesSuccess = (payload) => ({
  type: ADD_SITES_SUCCESS,
  payload
});

export const addSitesFail = (payload) => ({
  type: ADD_SITES_FAIL,
  payload
});

export const deleteSites = (payload) => ({
  type: DELETE_SITES,
  payload
});

export const deleteSitesSuccess = (payload) => ({
  type: DELETE_SITES_SUCCESS,
  payload
});

export const deleteSitesFail = (payload) => ({
  type: DELETE_SITES_FAIL,
  payload
});
