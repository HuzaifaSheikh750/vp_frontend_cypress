import {
  ADD_NEW_CONTACT,
  ADD_NEW_CONTACT_FAIL,
  ADD_NEW_CONTACT_SUCCESS,
  CLEAR_ALL_IMAGE,
  CLEAR_IMAGE,
  GET_ALL_CONTACT,
  GET_ALL_CONTACT_FAIL,
  GET_ALL_CONTACT_SUCCESS,
  GET_CONTACT_DETAILS,
  GET_CONTACT_DETAILS_FAIL,
  GET_CONTACT_DETAILS_SUCCESS,
  UPLOAD_IMAGE,
  UPLOAD_IMAGE_FAIL,
  UPLOAD_IMAGE_SUCCESS
} from "./actionTypes";

export const addNewContact = (rec) => ({
  type: ADD_NEW_CONTACT,
  payload: rec
});

export const addNewContactSuccess = (rec) => ({
  type: ADD_NEW_CONTACT_SUCCESS,
  payload: rec
});

export const addNewContactFail = (error) => ({
  type: ADD_NEW_CONTACT_FAIL,
  payload: error
});

export const uploadImage = (rec) => ({
  type: UPLOAD_IMAGE,
  payload: rec
});

export const uploadImageSuccess = (rec) => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: rec
});

export const uploadImageFail = (error) => ({
  type: UPLOAD_IMAGE_FAIL,
  payload: error
});

export const clearImage = (rec) => ({
  type: CLEAR_IMAGE,
  payload: rec
});

export const clearAllImage = (rec) => ({
  type: CLEAR_ALL_IMAGE,
  payload: rec
});

export const getAllContact = (rec) => ({
  type: GET_ALL_CONTACT,
  payload: rec
});

export const getAllContactSuccess = (rec) => ({
  type: GET_ALL_CONTACT_SUCCESS,
  payload: rec
});

export const getAllContactFail = (error) => ({
  type: GET_ALL_CONTACT_FAIL,
  payload: error
});

export const getContactDetails = (rec) => ({
  type: GET_CONTACT_DETAILS,
  payload: rec
});

export const getContactDetailsSuccess = (rec) => ({
  type: GET_CONTACT_DETAILS_SUCCESS,
  payload: rec
});

export const getContactDetailsFail = (error) => ({
  type: GET_CONTACT_DETAILS_FAIL,
  payload: error
});
