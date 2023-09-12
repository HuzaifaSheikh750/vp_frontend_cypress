import * as Yup from "yup";

import { Edit2, Trash } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import { ConstructJSON as JsonData, keyValue as kv } from "@/utils";
import { Lucide, Modal, ModalBody, ModalHeader } from "@/base-components";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import {
  addCurrencyCode as onAddCurrencyCode,
  deleteCurrencyCode as onDeleteCurrencyCode,
  getCurrencyCode as onGetCurrencyCode,
  updateCurrencyCode as onUpdateCurrencyCode
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import Select from "react-select";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

// import { LoadingIcon } from "@/base-components";

// import Loader from "../../components/loader/Main.jsx";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const exceptThisSymbols = ["e", "E", "+", "-"];

  const [submit, setSubmit] = useState(false);

  const { currencyCode, loading, error, message, addSuccess, updateSuccess, deleteSuccess } =
    useSelector((state) => state.CurrencyCodeReducer);

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);

  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [deleteModalPreview, setDeleteModalPreview] = useState({ show: false, data: null });

  useEffect(() => {
    if (addSuccess || updateSuccess || deleteSuccess) {
      setBasicSlideOverPreview({
        type: "",
        show: false,
        data: null
      });

      setDeleteModalPreview({
        show: false,
        data: null
      });

      let param = `?perPage=${getPerPage.value}&page={getCurrentPage}`;
      dispatch(onGetCurrencyCode(param));
      setSubmit(false);
      resetForm();
    }
  }, [addSuccess, updateSuccess, deleteSuccess]);

  useEffect(() => {
    let param = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
    dispatch(onGetCurrencyCode(param));
  }, [dispatch, getCurrentPage]);

  const onSelectPerPage = (e) => {
    setPerPage({ value: `${e.value}`, label: `${e.value}` });
    let param = `?perPage=${e.value}&page=1`;
    if (getCurrentPage !== 1) {
      setCurrentPage(1);
    } else {
      dispatch(onGetCurrencyCode(param));
    }
  };

  useEffect(() => {
    if (basicSlideOverPreview.type === "Edit") {
      setFieldValue("currencyCode", basicSlideOverPreview.data.currencyCode);
      setFieldValue("name", basicSlideOverPreview.data.name);
      setFieldValue("ISOCode", basicSlideOverPreview.data.ISOCode);
      setFieldValue("exchangeRate", parseInt(basicSlideOverPreview.data.exchangeRate));
      setFieldValue("baseCurrency", basicSlideOverPreview.data.baseCurrency);
    } else {
      setFieldValue("currencyCode", "");
      setFieldValue("name", "");
      setFieldValue("ISOCode", "");
      setFieldValue("exchangeRate", 0);
      setFieldValue("baseCurrency", "");
    }
  }, [basicSlideOverPreview]);

  const initialValues = {
    currencyCode: "",
    name: "",
    ISOCode: "",
    exchangeRate: 0,
    baseCurrency: ""
  };

  const validationSchema = Yup.object().shape({
    currencyCode: Yup.string().required("Required"),
    name: Yup.string().required("Required")
  });

  const { values, errors, handleSubmit, handleChange, handleBlur, setFieldValue, resetForm } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values, { resetForm }) => {
        const body = {
          currencyCode: values.currencyCode,
          name: values.name,
          ISOCode: values.ISOCode,
          exchangeRate: values.exchangeRate
        };

        if (basicSlideOverPreview.type === "Edit") {
          dispatch(
            onUpdateCurrencyCode({
              params: basicSlideOverPreview.data.id,
              data: body
            })
          );
        }
        if (basicSlideOverPreview.type === "Add") {
          dispatch(onAddCurrencyCode(body));
        }

        // setBasicSlideOverPreview({
        //   type: "",
        //   show: false,
        //   data: null
        // });
        // resetForm();
      }
    });

  const optionTab = {
    responsiveLayout: "collapse",
    scrollToRowIfVisible: true,
    scrollVertical: "auto",
    layoutColumnsOnNewData: true,
    virtualDomHoz: true
  };
  const columns = [
    {
      title: "Currency Code",
      field: "currencyCode",
      formatter: function (cell) {
        return cell.getValue() ? cell.getValue() : "N/A";
      }
    },
    {
      title: "Currency Name",
      field: "name",
      formatter: function (cell) {
        return cell.getValue() ? cell.getValue() : "N/A";
      }
    },
    {
      title: "ISO Code",
      field: "ISOCode",
      formatter: function (cell) {
        return cell.getValue() ? cell.getValue() : "N/A";
      }
    },
    {
      title: "Exchange Rate",
      field: "exchangeRate",
      formatter: function (cell) {
        return cell.getValue() ? cell.getValue() : "N/A";
      }
    },
    {
      title: "Base Currency",
      field: "baseCurrency",
      formatter: function (cell) {
        return cell.getValue() ? cell.getValue() : "N/A";
      }
    },
    {
      title: "Actions",
      field: "actions",
      formatter: reactFormatter(<ActionsFormatter />)
    }
  ];

  const handleDeleteChange = () => {
    dispatch(onDeleteCurrencyCode(deleteModalPreview.data.id));
  };
  function ActionsFormatter(props) {
    const data = props.cell._cell.row.data;

    return (
      <div
        className="
          d-flex
          justify-content-center
          align-items-center"
      >
        <button
          className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 
      text-primary hover:bg-primary hover:text-primary hover:border-primary
      "
          onClick={() => {
            setBasicSlideOverPreview({
              show: true,
              type: "Edit",
              data
            });
          }}
        >
          <Edit2 className="font-medium-2 mr-2" size={15} />
          Edit
        </button>
        <button
          className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
          onClick={() => {
            setDeleteModalPreview({
              show: true,
              data
            });
          }}
        >
          <Trash className="font-medium-2 mr-2" size={15} /> Delete
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">CURRENCY CODE</h2>
      </div>
      {/* BEGIN: HTML Table Data */}
      <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-7">
        <button
          className="btn btn-primary shadow-md mr-2"
          onClick={() => {
            setBasicSlideOverPreview({
              show: true,
              type: "Add",
              data: null
            });
          }}
        >
          Add New Currency Code
        </button>
        <div className="hidden md:block mx-auto text-slate-500"></div>
      </div>
      <div className="intro-y box p-5 mt-5 ">
        <div className="overflow-x-scroll">
          <div className="" style={{ minWidth: "1000px" }}>
            <ReactTabulator
              columns={columns}
              data={currencyCode?.docs ? currencyCode.docs : []}
              options={optionTab}
            />
          </div>
        </div>
        {/* BEGIN: Pagination */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              {currencyCode?.hasPrevPage ? (
                <>
                  <li className="page-item">
                    <a className="page-link" href="#123" onClick={() => setCurrentPage(1)}>
                      <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(currencyCode?.prevPage)}
                    >
                      <Lucide icon="ChevronLeft" className="w-4 h-4" />
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(currencyCode?.prevPage)}
                    >
                      {currencyCode.prevPage}
                    </a>
                  </li>
                </>
              ) : null}
              <li className="page-item active">
                <a className="page-link" href="#">
                  {currencyCode?.page}
                </a>
              </li>
              {currencyCode?.hasNextPage ? (
                <>
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(currencyCode?.nextPage)}
                    >
                      {currencyCode?.nextPage}
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(currencyCode?.nextPage)}
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4" />
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#123"
                      onClick={() => setCurrentPage(currencyCode?.totalPages)}
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
        {/* END: Pagination */}
      </div>
      <Modal
        backdrop={loading ? "static" : ""}
        show={deleteModalPreview.show}
        onHidden={() => {
          setDeleteModalPreview({
            show: false,
            data: null
          });
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-5">
                <div className="text-2xl mt-5 mb-3">
                  Please wait <br /> while we are processing your request
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
                <div className="text-3xl mt-5">Are you sure?</div>
                <div className="text-slate-500 mt-2">
                  Do you really want to delete these records? <br />
                  This process cannot be undone.
                </div>
              </div>
            )}
          </div>
          {loading ? null : (
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalPreview({
                    show: false,
                    data: null
                  });
                }}
                className="btn btn-outline-secondary w-24 mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary w-24"
                onClick={() => handleDeleteChange()}
              >
                Proceed
              </button>
            </div>
          )}
        </ModalBody>
      </Modal>
      <Modal
        size="modal-lg"
        slideOver={true}
        show={basicSlideOverPreview.show}
        onHidden={() => {
          setBasicSlideOverPreview({
            show: false,
            type: "",
            data: null
          });
          setSubmit(false);
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="font-medium text-lg mr-auto">
            {basicSlideOverPreview.type === "Edit" ? "Edit Currency Code" : "Add New Currency Code"}
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
                    Currency Code*
                  </label>
                  <input
                    id="vertical-form-2"
                    type="text"
                    className="form-control"
                    placeholder="Currency Code"
                    name="currencyCode"
                    value={values.currencyCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.currencyCode && (
                    <span className="text-danger">{errors.currencyCode}</span>
                  )}
                </div>
                <div className="mt-3">
                  <label htmlFor="vertical-form-3" className="form-label">
                    Name*
                  </label>
                  <input
                    id="vertical-form-3"
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.name && <span className="text-danger">{errors.name}</span>}
                </div>

                <div className="mt-3">
                  <label htmlFor="vertical-form-4" className="form-label">
                    ISO Code
                  </label>
                  <input
                    id="vertical-form-4"
                    type="text"
                    className="form-control"
                    placeholder="ISO Code"
                    name="ISOCode"
                    value={values.ISOCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="mt-3">
                  <label htmlFor="vertical-form-5" className="form-label">
                    Exchange Rate
                  </label>
                  <input
                    id="vertical-form-5"
                    type="number"
                    className="form-control"
                    placeholder="Exchange Rate"
                    name="exchangeRate"
                    value={values.exchangeRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={0}
                    onKeyUp={(e) => {
                      // do not allow negative values
                      if (e.target.value < 0) {
                        setFieldValue("exchangeRate", 0);
                      }
                    }}
                    onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                  />
                </div>

                {/*<div className="mt-3">
                  <label htmlFor="vertical-form-6" className="form-label">
                    Base Currency*
                  </label>
                  <input
                    id="vertical-form-6"
                    type="text"
                    className="form-control"
                    placeholder="Base Currency"
                    name="baseCurrency"
                    value={values.baseCurrency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  </div>*/}

                <button className="btn btn-primary mt-7 px-7" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center mr-2">
                      {/* <LoadingIcon icon="oval" className="w-4 h-4" />*/}
                    </div>
                  ) : null}
                  {basicSlideOverPreview.type === "Edit" ? "Update" : "Add"}
                </button>

                <button
                  className="btn btn-outline-secondary mt-5 ml-2 px-7"
                  type="button"
                  onClick={() => {
                    setBasicSlideOverPreview({
                      show: false,
                      type: "",
                      data: null
                    });
                    setSubmit(false);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Fragment>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Main;
