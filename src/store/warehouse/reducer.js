import {
  ADD_WAREHOUSE,
  ADD_WAREHOUSE_FAIL,
  ADD_WAREHOUSE_SUCCESS,
  DELETE_WAREHOUSE,
  DELETE_WAREHOUSE_FAIL,
  DELETE_WAREHOUSE_SUCCESS,
  GET_WAREHOUSE,
  GET_WAREHOUSE_FAIL,
  GET_WAREHOUSE_SUCCESS,
  UPDATE_WAREHOUSE,
  UPDATE_WAREHOUSE_FAIL,
  UPDATE_WAREHOUSE_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  Warehouse: {},
  loading: false,
  error: "",
  message: "",
  addSuccess: false,
  updateSuccess: false,
  deleteSuccess: false
};

const WarehouseReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_WAREHOUSE:
      return { ...state, loading: true };
    case GET_WAREHOUSE_SUCCESS:
      return {
        ...state,
        loading: false,
        Warehouse: payload,
        addSuccess: false,
        updateSuccess: false,
        deleteSuccess: false
      };
    case GET_WAREHOUSE_FAIL:
      return { ...state, loading: false, error: payload };
    case UPDATE_WAREHOUSE:
      return { ...state, loading: true };
    case UPDATE_WAREHOUSE_SUCCESS:
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        message: payload
      };
    case UPDATE_WAREHOUSE_FAIL:
      return { ...state, loading: false, error: payload };
    case ADD_WAREHOUSE:
      return { ...state, loading: true };
    case ADD_WAREHOUSE_SUCCESS:
      return {
        ...state,
        loading: false,
        addSuccess: true,
        message: payload
      };
    case ADD_WAREHOUSE_FAIL:
      return { ...state, loading: false, error: payload };
    case DELETE_WAREHOUSE:
      return { ...state, loading: true };
    case DELETE_WAREHOUSE_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteSuccess: true,
        message: payload
      };
    case DELETE_WAREHOUSE_FAIL:
      return { ...state, loading: false, error: payload };
    default:
      return { ...state };
  }
};

export default WarehouseReducer;
