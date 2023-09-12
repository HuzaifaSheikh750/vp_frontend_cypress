import { ADD_NEW_CONTACT, GET_ALL_CONTACT, GET_CONTACT_DETAILS, UPLOAD_IMAGE } from "./actionTypes";
import { addContactApi, getContactApi, uploadImages } from "../../helpers/backend_helper";
import {
  addNewContactFail,
  addNewContactSuccess,
  getAllContactFail,
  getAllContactSuccess,
  getContactDetailsFail,
  getContactDetailsSuccess,
  uploadImageFail,
  uploadImageSuccess
} from "./actions";
import { call, put, takeEvery } from "redux-saga/effects";

function* onAddNewContact({ payload: rec }) {
  try {
    const response = yield call(addContactApi, rec);
    yield put(addNewContactSuccess(response));
  } catch (error) {
    yield put(addNewContactFail(error));
  }
}

function* UploadImage(action) {
  try {
    const response = yield call(uploadImages, action.payload);

    yield put(uploadImageSuccess(response));
  } catch (error) {
    yield put(uploadImageFail(error));
  }
}

function* onGetAllContact({ payload: rec }) {
  try {
    const response = yield call(getContactApi, rec);
    yield put(getAllContactSuccess(response.data));
  } catch (error) {
    yield put(getAllContactFail(error));
  }
}

function* onGetContactDetails({ payload: rec }) {
  try {
    const response = yield call(getContactApi, rec);

    yield put(getContactDetailsSuccess(response));
  } catch (error) {
    yield put(getContactDetailsFail(error));
  }
}

function* HelpSaga() {
  yield takeEvery(ADD_NEW_CONTACT, onAddNewContact);
  yield takeEvery(UPLOAD_IMAGE, UploadImage);
  yield takeEvery(GET_ALL_CONTACT, onGetAllContact);
  yield takeEvery(GET_CONTACT_DETAILS, onGetContactDetails);
}

export default HelpSaga;
