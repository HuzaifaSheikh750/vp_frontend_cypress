import {
  ADD_BANKING_INFO,
  ADD_NEW_SHIPPING_INFO,
  ADD_NEW_USER,
  ADD_VENDOR,
  DELETE_BANKING_INFO,
  DELETE_SHIPPING_INFO,
  DELETE_USER,
  DELETE_VENDOR,
  GET_ALL_SHIPPING_INFO,
  GET_ALL_VENDOR,
  GET_BANKING_INFO,
  GET_QUANTITY,
  GET_SHIPPING_INFO,
  GET_SPECIFIC_USER,
  GET_USERS,
  GET_VENDOR,
  UPDATE_BANKING_INFO,
  UPDATE_NEW_USER,
  UPDATE_REMAINING_QUANTITY,
  UPDATE_SHIPPING_INFO,
  UPDATE_VENDOR,
} from "./actionTypes";
import {
  addBankingInfoApi,
  addNewUserCall,
  addNewVendorCall,
  deleteBankingInfoApi,
  deleteUserCall,
  deleteVendorCall,
  getAllVendorCall,
  getBankingInfoApi,
  getQuantityCall,
  getUsersCall,
  updateBankingInfoApi,
  updateRemainingQuantityCall,
  updateUserCall,
  updateVendorCall,
} from "../../helpers/backend_helper";
import {
  addBankingInfoFail,
  addBankingInfoSuccess,
  addNewShippingInfoFail,
  addNewShippingInfoSuccess,
  addNewUserFail,
  addNewUserSuccess,
  addVendorFail,
  addVendorSuccess,
  deleteBankingInfoFail,
  deleteBankingInfoSuccess,
  deleteShippingInfoFail,
  deleteShippingInfoSuccess,
  deleteUserFail,
  deleteUserSuccess,
  deleteVendorFail,
  deleteVendorSuccess,
  getAllShippingInfoFail,
  getAllShippingInfoSuccess,
  getAllVendorFail,
  getAllVendorSuccess,
  getBankingInfoFail,
  getBankingInfoSuccess,
  getQuantityFail,
  getQuantitySuccess,
  getShippingInfoFail,
  getShippingInfoSuccess,
  getSpecificUserFail,
  getSpecificUserSuccess,
  getUsersFail,
  getUsersSuccess,
  getVendorFail,
  getVendorSuccess,
  updateBankingInfoFail,
  updateBankingInfoSuccess,
  updateRemainingQuantityFail,
  updateRemainingQuantitySuccess,
  updateShippingInfoFail,
  updateShippingInfoSuccess,
  updateUserFail,
  updateUserSuccess,
  updateVendorFail,
  updateVendorSuccess,
} from "./actions";
import { call, put, takeEvery } from "redux-saga/effects";

function* fetchUsers(action) {
  try {
    const response = yield call(getUsersCall, action.payload);
    yield put(getUsersSuccess(response.data));
  } catch (error) {
    yield put(getUsersFail(error));
  }
}

function* fetchSpecificUser(action) {
  try {
    const response = yield call(getUsersCall, action.payload);
    yield put(getSpecificUserSuccess(response.data));
  } catch (error) {
    yield put(getSpecificUserFail(error));
  }
}

function* onAddNewUser(action) {
  try {
    const response = yield call(addNewUserCall, action.payload);
    if (
      response.statusCode === 201 &&
      response.data === "This user already exists"
    ) {
      yield put(addNewUserFail(response.data));
    } else {
      yield put(addNewUserSuccess(response.data));
    }
  } catch (error) {
    yield put(addNewUserFail(error));
  }
}

function* onUpdateUser(action) {
  try {
    const response = yield call(updateUserCall, action.payload);
    yield put(updateUserSuccess(response));
  } catch (error) {
    yield put(updateUserFail(error));
  }
}

function* onDeleteUser(action) {
  try {
    const response = yield call(deleteUserCall, action.payload);
    yield put(deleteUserSuccess(response));
  } catch (error) {
    yield put(deleteUserFail(error));
  }
}

function* getQuantity(action) {
  try {
    const response = yield call(getQuantityCall, action.payload);
    yield put(getQuantitySuccess(response?.data?.usersRemaining));
  } catch (error) {
    yield put(getQuantityFail(error));
  }
}

function* updateRemainingQuantity(action) {
  try {
    const response = yield call(updateRemainingQuantityCall, action.payload);
    // 200 is the status code for success

    if (response?.status === 200) {
      yield put(updateRemainingQuantitySuccess(action.payload.quantity));
    }
  } catch (error) {
    if (error?.response?.status === 400) {
      yield put(updateRemainingQuantityFail(error?.response?.data?.message));
    }
    //  yield put(updateRemainingQuantityFail(error));
  }
}

// function* updateShippingInfo(action) {
//   try {
//     const response = yield call(UpdateShippingInfo, action.payload);
//     // 200 is the status code for success

//     if (response?.status === 200) {
//       yield put(updateShippingInfoSuccess(action.payload));
//     }
//   } catch (error) {
//     if (error?.response?.status === 400) {
//       yield put(updateShippingInfoFail(error?.response?.data?.message));
//     }
//     //  yield put(updateRemainingQuantityFail(error));
//   }
// }

// function* addNewShippingInfo(action) {
//   try {
//     const response = yield call(AdddShippingInfo, action.payload);
//     // 200 is the status code for success

//     if (response?.status === 200) {
//       yield put(addNewShippingInfoSuccess(action.payload));
//     }

//     if (response?.status === 400) {
//       yield put(addNewShippingInfoFail(response?.data?.message));
//     }
//   } catch (error) {
//     if (error?.response?.status === 400) {
//       yield put(addNewShippingInfoFail(error?.response?.data?.message));
//     }
//     //  yield put(updateRemainingQuantityFail(error));
//   }
// }

// function* delShippingInfo(action) {
//   try {
//     const response = yield call(deleteShippingInfo, action.payload);
//     // 200 is the status code for success

//     if (response?.status === 200) {
//       yield put(deleteShippingInfoSuccess(action.payload));
//     }
//   } catch (error) {
//     if (error?.response?.status === 400) {
//       yield put(deleteShippingInfoFail(error?.response?.data?.message));
//     }
//     //  yield put(updateRemainingQuantityFail(error));
//   }
// }

// function* fetchShippingInfo(action) {
//   try {
//     const response = yield call(getShippingInfo, action.payload);
//     yield put(getShippingInfoSuccess(response?.data));
//   } catch (error) {
//     yield put(getShippingInfoFail(error));
//   }
// }

// function* fetchAllShippingInfo(action) {
//   try {
//     const response = yield call(getShippingInfoList, action.payload);
//     yield put(getAllShippingInfoSuccess(response?.data));
//   } catch (error) {
//     yield put(getAllShippingInfoFail(error));
//   }
// }

function* addNewVendor(action) {
  try {
    const response = yield call(addNewVendorCall, action.payload);
    yield put(addVendorSuccess(response.data));
  } catch (error) {
    yield put(addVendorFail(error));
  }
}

function* updateVendor(action) {
  try {
    const response = yield call(updateVendorCall, action.payload);
    yield put(updateVendorSuccess(response));
  } catch (error) {
    yield put(updateVendorFail(error));
  }
}

function* deleteVendor(action) {
  try {
    const response = yield call(deleteVendorCall, action.payload);
    yield put(deleteVendorSuccess(response));
  } catch (error) {
    yield put(deleteVendorFail(error));
  }
}

function* getAllVendor(action) {
  try {
    const response = yield call(getAllVendorCall, action.payload);
    yield put(getAllVendorSuccess(response));
  } catch (error) {
    yield put(getAllVendorFail(error));
  }
}

function* getSpecificVendor(action) {
  try {
    const response = yield call(getAllVendorCall, action.payload);
    yield put(getVendorSuccess(response.data));
  } catch (error) {
    yield put(getVendorFail(error));
  }
}

function* addBankingInfo(action) {
  try {
    const response = yield call(addBankingInfoApi, action.payload);
    yield put(addBankingInfoSuccess(response));
  } catch (error) {
    yield put(addBankingInfoFail(error));
  }
}

function* deleteBankingInfo(action) {
  try {
    const response = yield call(deleteBankingInfoApi, action.payload);
    yield put(deleteBankingInfoSuccess(response));
  } catch (error) {
    yield put(deleteBankingInfoFail(error));
  }
}

function* getBankingInfo(action) {
  try {
    const response = yield call(getBankingInfoApi, action.payload);
    yield put(getBankingInfoSuccess(response));
  } catch (error) {
    yield put(getBankingInfoFail(error));
  }
}

function* updateBankingInfo(action) {
  try {
    const response = yield call(updateBankingInfoApi, action.payload);
    yield put(updateBankingInfoSuccess(response));
  } catch (error) {
    yield put(updateBankingInfoFail(error));
  }
}

function* manageUsersSaga() {
  yield takeEvery(GET_USERS, fetchUsers);
  yield takeEvery(ADD_NEW_USER, onAddNewUser);
  yield takeEvery(UPDATE_NEW_USER, onUpdateUser);
  yield takeEvery(DELETE_USER, onDeleteUser);
  yield takeEvery(GET_QUANTITY, getQuantity);
  yield takeEvery(UPDATE_REMAINING_QUANTITY, updateRemainingQuantity);
  yield takeEvery(GET_SPECIFIC_USER, fetchSpecificUser);
  // yield takeEvery(UPDATE_SHIPPING_INFO, updateShippingInfo);
  // yield takeEvery(ADD_NEW_SHIPPING_INFO, addNewShippingInfo);
  // yield takeEvery(DELETE_SHIPPING_INFO, delShippingInfo);
  // yield takeEvery(GET_SHIPPING_INFO, fetchShippingInfo);
  // yield takeEvery(GET_ALL_SHIPPING_INFO, fetchAllShippingInfo);
  yield takeEvery(ADD_VENDOR, addNewVendor);
  yield takeEvery(UPDATE_VENDOR, updateVendor);
  yield takeEvery(DELETE_VENDOR, deleteVendor);
  yield takeEvery(GET_ALL_VENDOR, getAllVendor);
  yield takeEvery(ADD_BANKING_INFO, addBankingInfo);
  yield takeEvery(DELETE_BANKING_INFO, deleteBankingInfo);
  yield takeEvery(GET_BANKING_INFO, getBankingInfo);
  yield takeEvery(UPDATE_BANKING_INFO, updateBankingInfo);
  yield takeEvery(GET_VENDOR, getSpecificVendor);
}

export default manageUsersSaga;
