import * as Yup from "yup";

import {
  Alert,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  Tippy,
} from "@/base-components";
import { Fragment, useEffect, useState } from "react";
import {
  clearQtyError,
  getQuantity,
  addNewUser as onAddNewUser,
  deleteUser as onDeleteUser,
  getUsers as onGetUsers,
  getVendorList as onGetVendor,
  updateUser as onUpdateUser,
  quantityChange,
  resetUser,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { Columns } from "./Columns";
import DataTable from "react-data-table-component";
import QuantityModal from "./QuantityModal";
import Select from "react-select";
import { keyValue } from "../../utils/keyvalue";
import { keyValue as kv } from "@/utils";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [submit, setSubmit] = useState(false);
  const [deleteModalPreview, setDeleteModalPreview] = useState({
    show: false,
    data: null,
  });
  // const [usersData, setUsersData] = useState([]);
  // const { users, updated, added, deleted, quantity, updatedQuantity, errorQuantity } = useSelector(
  //   (state) => state.ManageUsersReducer
  // );
  const { vendors } = useSelector((state) => state.VendorReducer);

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState({
    show: false,
    type: "",
    data: null,
  });

  const [changeQtySlideOverPreview, setchangeQtySlideOverPreview] =
    useState(false);

  const columnFun = (rec) => {
    if (rec.data?.defaultContact) {
      navigate(`/profile?id=${rec.data?.defaultContact}`);
    }
  };

  const callbackDeleteModalPreview = (rec) => setDeleteModalPreview(rec);

  const callbackfunc = (rec) => setchangeQtySlideOverPreview(rec);

  const dispatch = useDispatch();

  const [data, setData] = useState({});

  const getInfo = () => {
    const data = localStorage.getItem("authUser");
    if (data) {
      setData(JSON.parse(data).azure_data);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    let param = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
    dispatch(onGetVendor(param));
  }, [dispatch, getCurrentPage]);

  const onSelectPerPage = (e) => {
    setPerPage({ value: `${e.value}`, label: `${e.value}` });
    let param = `?perPage=${e.value}&page=1`;
    if (getCurrentPage !== 1) {
      setCurrentPage(1);
    } else {
      dispatch(onGetVendor(param));
    }
  };

  // useEffect(() => {
  //   if (parseInt(getPerPage.value) !== vendors.limit) {
  //     setCurrentPage(1);
  //     var params = `?perPage=${getPerPage.value}&page=1`;
  //   } else {
  //     var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
  //   }
  //   if (vendors.hasOwnProperty("message")) {
  //   } else if (
  //     !vendors.hasOwnProperty("docs") ||
  //     getCurrentPage != vendors.page ||
  //     parseInt(getPerPage.value) !== vendors.limit
  //   ) {
  //     dispatch(onGetVendor(params));
  //   }
  // }, [dispatch, getCurrentPage, getPerPage]);

  // useEffect(() => {
  //   if (vendors.hasOwnProperty("docs")) {
  //     setUsersData(vendors.docs);
  //   }
  // }, [vendors]);

  useEffect(() => {
    if (basicSlideOverPreview.type === "Edit") {
      setFieldValue("name", basicSlideOverPreview.data.name);
      setFieldValue("email", basicSlideOverPreview.data.email);
      setFieldValue("phoneNumber", basicSlideOverPreview.data.phoneNumber);
      setFieldValue("mainAddress", basicSlideOverPreview.data.mainAddress);

      // use only 8 characters of password
      setFieldValue("password", basicSlideOverPreview.data.password);
    } else {
      setFieldValue("name", "");
      setFieldValue("email", "");
      setFieldValue("phoneNumber", "");
      setFieldValue("password", "");
      setFieldValue("mainAddress", "");
    }
  }, [basicSlideOverPreview]);

  const handlePhoneChange = (e) => {
    const { value } = e.target;

    // regex that contains all the symbols and symbols except backspace and numbers
    const regex = /[!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?~`a-zA-Z]/;

    // if the key pressed is a symbol
    if (regex.test(value)) {
      e.preventDefault();
      return false;
    }

    setFieldValue("phoneNumber", value);
  };

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    mainAddress: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phoneNumber: Yup.string()
      .min(11, "Phone must be at least 11 characters")
      .max(14, "Phone must be at most 14 characters")
      .required("Phone is required"),
    password: Yup.string()
      // .matches(
      //   /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
      //   "Password must contain at least one number and one alphabet"
      // )
      // .min(6, "Password must be at least 8 characters")
      // .max(20, "Password must be at most 20 characters")
      .required("Password is required"),
    mainAddress: Yup.string().required("Address is required"),
  });

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmit(false);
      if (basicSlideOverPreview.type === "Edit") {
        const body = {
          name: values.name,
          phoneNumber: values.phoneNumber,
          password: values.password,
        };

        dispatch(
          onUpdateUser({
            code: basicSlideOverPreview.data._id,
            data: body,
          })
        );
      }
      if (basicSlideOverPreview.type === "Add") {
        dispatch(onAddNewUser(values));
      }

      setBasicSlideOverPreview({
        type: "",
        show: false,
        data: null,
      });
      resetForm();
    },
  });

  return (
    <Fragment>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">MANAGE VENDORS</h2>
      </div>

      <div
        className="btn btn-primary shadow-md mr-2 mt-3 "
        onClick={() => {
          dispatch(resetUser());
          navigate("/profile");
        }}
      >
        <Lucide icon="Plus" className="w-4 h-4 mr-2" />
        Create Vendor
      </div>
      {/*quantity > 0 || errorQuantity !== null ? (
        ""
      ) : (
        <div className="col-span-12 mt-6 intro-y mb-4">
          <Alert className="alert-danger-soft flex items-center mb-2">
            {({ dismiss }) => (
              <>
                <Lucide icon="AlertOctagon" className="w-6 h-6 mr-2" />
                <span>
                  You have reached the maximum number of vendors. Please upgrade your plan to add
                  more vendors.
                </span>
                <button
                  type="button"
                  className="btn-close text-white"
                  onClick={dismiss}
                  aria-label="Close"
                >
                  <Lucide icon="X" className="w-4 h-4" />
                </button>
              </>
            )}
          </Alert>
        </div>
            )*/}
      {/*errorQuantity !== null ? (
        <div className="col-span-12 mt-6 intro-y mb-4">
          <Alert className="box alert-danger-soft bg-danger-soft text-white flex items-center mb-6">
            {({ dismiss }) => (
              <>
                <Lucide icon="AlertOctagon" className="w-6 h-6 mr-2" />
                <span>{errorQuantity.message}</span>
                <button
                  type="button"
                  className="btn-close text-white"
                  onClick={() => {
                    dispatch(clearQtyError());
                    dismiss();
                  }}
                  aria-label="Close"
                >
                  <Lucide icon="X" className="w-4 h-4" />
                </button>
              </>
            )}
          </Alert>
        </div>
                ) : null*/}

      {/* <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center ">
        <button
          className="btn btn-primary shadow-md mr-2 mt-4"
          onClick={() => {
            setBasicSlideOverPreview({
              show: true,
              type: "Add",
              data: null
            });
          }}
          disabled={quantity && quantity > 0 ? false : true}
        >
          Add New 
        </button>
        <div className="hidden md:block mx-auto text-slate-500"></div>
        
            </div>*/}
      <div className="intro-y box p-5 mt-5 ">
        <div className="overflow-x-auto scrollbar-hidden">
          <DataTable
            title="Users"
            columns={Columns(columnFun, callbackDeleteModalPreview)}
            data={vendors?.docs || []}
            highlightOnHover
            pointerOnHover
            responsive
            striped
            noHeader
            // paginationComponent={CustomPagination}
            customStyles={{
              rows: {
                style: {
                  minHeight: "72px", // override the row height
                },
              },
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              },
              cells: {
                style: {
                  fontSize: "14px",
                },
              },
            }}
          />
        </div>
        {vendors.hasOwnProperty("docs") ? (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {vendors.hasPrevPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(1)}
                      >
                        <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(vendors.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(vendors.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(vendors.prevPage)}
                      >
                        {vendors.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {vendors.page}
                  </a>
                </li>
                {vendors.hasNextPage ? (
                  <>
                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(vendors.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(vendors.nextPage)}
                      >
                        {vendors.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(vendors.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(vendors.totalPages)}
                      >
                        <Lucide icon="ChevronsRight" className="w-4 h-4" />
                      </a>
                    </li>
                  </>
                ) : null}
              </ul>
            </nav>
            <Select
              defaultValue={getPerPage}
              onChange={(e) => onSelectPerPage(e)}
              options={kv.optionsPerPage}
            />
          </div>
        ) : null}
      </div>
      <Modal
        size="modal-lg"
        slideOver={true}
        show={basicSlideOverPreview.show}
        onHidden={() => {
          setBasicSlideOverPreview({
            show: false,
            type: "",
            data: null,
          });
          setSubmit(false);
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="font-medium text-lg mr-auto">
            {basicSlideOverPreview.type === "Edit"
              ? "Edit User"
              : "Add New User"}
          </h1>
        </ModalHeader>
        <ModalBody>
          <Fragment>
            <form
              className="form form-vertical"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmit(true);
                handleSubmit();
              }}
            >
              <div className="p-5">
                <div className="mt-3">
                  <label htmlFor="vertical-form-2" className="form-label">
                    Name*
                  </label>
                  <input
                    id="vertical-form-2"
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.name && (
                    <span className="text-danger">{errors.name}</span>
                  )}
                </div>
                <div className="mt-3">
                  <label htmlFor="vertical-form-3" className="form-label">
                    Email*
                  </label>
                  <input
                    id="vertical-form-3"
                    type="text"
                    className="form-control"
                    placeholder="customer@kaispe.com"
                    name="email"
                    disabled={
                      basicSlideOverPreview.type === "Edit" ? true : false
                    }
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.email && (
                    <span className="text-danger">{errors.email}</span>
                  )}
                </div>
                <div className="mt-3">
                  <label htmlFor="vertical-form-4" className="form-label">
                    Password*
                  </label>
                  <input
                    id="vertical-form-4"
                    type="password"
                    className="form-control"
                    placeholder="********"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.password && (
                    <span className="text-danger">{errors.password}</span>
                  )}
                </div>
                <div className="mt-3">
                  <label htmlFor="vertical-form-5" className="form-label">
                    Phone*
                  </label>
                  <input
                    id="vertical-form-5"
                    type="text"
                    className="form-control "
                    placeholder="1234567890"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={(e) => handlePhoneChange(e)}
                    onBlur={handleBlur}
                  />
                  {submit && errors.phoneNumber && (
                    <span className="text-danger">{errors.phoneNumber}</span>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="vertical-form-2" className="form-label">
                    Address*
                  </label>
                  <input
                    id="vertical-form-2"
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    name="mainAddress"
                    value={values.mainAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.mainAddress && (
                    <span className="text-danger">{errors.mainAddress}</span>
                  )}
                </div>

                {/*<div className="form-check mt-5">
                <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                <label className="form-check-label" htmlFor="vertical-form-3">
                  Remember me
                </label>
      </div>*/}
                <button className="btn btn-primary mt-7 px-7" type="submit">
                  {basicSlideOverPreview.type === "Edit" ? "Update" : "Add"}
                </button>

                <button
                  className="btn btn-outline-secondary mt-5 ml-2 px-7"
                  type="button"
                  onClick={() => {
                    setBasicSlideOverPreview({
                      show: false,
                      type: "",
                      data: null,
                    });
                    setSubmit(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Fragment>
        </ModalBody>
      </Modal>
      {/* BEGIN: Modal Toggle */}
      <Modal
        show={deleteModalPreview.show}
        onHidden={() => {
          setDeleteModalPreview({
            show: false,
            data: null,
          });
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteModalPreview({
                  show: false,
                  data: null,
                });
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger w-24"
              onClick={() => {
                setDeleteModalPreview({
                  show: false,
                  data: null,
                });
                dispatch(onDeleteUser(deleteModalPreview.data._id));
              }}
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Modal Content */}
      <QuantityModal
        show={changeQtySlideOverPreview}
        callbackfunc={callbackfunc}
        qty={{}}
        limit={vendors.totalDocs}
      />
    </Fragment>
  );
}

export default Main;
