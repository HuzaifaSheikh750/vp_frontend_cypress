import * as Yup from "yup";

import { Edit2, Trash } from "react-feather";
import { Fragment, useEffect, useState } from "react";
import { ConstructJSON as JsonData, keyValue as kv } from "@/utils";
import { Lucide, Modal, ModalBody, ModalHeader } from "@/base-components";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import {
  addDiscount as onAddDiscount,
  deleteDiscount as onDeleteDiscount,
  getDiscount as onGetDiscount,
  updateDiscount as onUpdateDiscount,
} from "../../store/discount/actions";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/loader/Main.jsx";
import { LoadingIcon } from "@/base-components";
import Select from "react-select";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();

  const [submit, setSubmit] = useState(false);

  const {
    Discount,
    loading,
    error,
    message,
    addSuccess,
    updateSuccess,
    deleteSuccess,
  } = useSelector((state) => state.DiscountReducer);

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);

  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [deleteModalPreview, setDeleteModalPreview] = useState({
    show: false,
    data: null,
  });

  useEffect(() => {
    if (addSuccess || updateSuccess || deleteSuccess) {
      setBasicSlideOverPreview({
        type: "",
        show: false,
        data: null,
      });

      setDeleteModalPreview({
        show: false,
        data: null,
      });

      let param = `?perPage=${getPerPage.value}&page={getCurrentPage}`;
      dispatch(onGetDiscount(param));
      setSubmit(false);
      resetForm();
    }
  }, [addSuccess, updateSuccess, deleteSuccess]);

  useEffect(() => {
    let param = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
    dispatch(onGetDiscount(param));
  }, [dispatch, getCurrentPage]);

  const onSelectPerPage = (e) => {
    setPerPage({ value: `${e.value}`, label: `${e.value}` });
    let param = `?perPage=${e.value}&page=1`;
    if (getCurrentPage !== 1) {
      setCurrentPage(1);
    } else {
      dispatch(onGetDiscount(param));
    }
  };

  useEffect(() => {
    if (basicSlideOverPreview.type === "Edit") {
      setFieldValue("discountCode", basicSlideOverPreview.data.discountCode);
      setFieldValue(
        "discountPercentage",
        basicSlideOverPreview.data.discountPercentage
      );
      setFieldValue("description", basicSlideOverPreview.data.description);
    } else {
      setFieldValue("discountCode", "");
      setFieldValue("discountPercentage", "");
      setFieldValue("description", "");
    }
  }, [basicSlideOverPreview]);

  const initialValues = {
    discountCode: "",
    discountPercentage: "",
    description: "",
  };

  const validationSchema = Yup.object().shape({
    // must be shorter than 10 or equal
    discountCode: Yup.string().required("Required"),
    discountPercentage: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });
  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (basicSlideOverPreview.type === "Edit") {
        dispatch(
          onUpdateDiscount({
            params: basicSlideOverPreview.data.id,
            data: values,
          })
        );
      }
      if (basicSlideOverPreview.type === "Add") {
        dispatch(onAddDiscount(values));
      }

      // setBasicSlideOverPreview({
      //   type: "",
      //   show: false,
      //   data: null
      // });
      // resetForm();
    },
  });

  const optionTab = {
    responsiveLayout: "collapse",
    scrollToRowIfVisible: true,
    layoutColumnsOnNewData: true,
  };

  const columns = [
    {
      title: "Discount Code",
      field: "discountCode",
    },
    {
      title: "Discount Percentage",
      field: "discountPercentage",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Actions",
      field: "actions",
      formatter: reactFormatter(<ActionsFormatter />),
    },
  ];

  const handleDeleteChange = () => {
    dispatch(onDeleteDiscount(deleteModalPreview.data.id));
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
              data,
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
              data,
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
        <h2 className="text-lg font-medium mr-auto">Discount Groups</h2>
      </div>
      {/* BEGIN: HTML Table Data */}
      <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-7">
        <button
          className="btn btn-primary shadow-md mr-2"
          onClick={() => {
            setBasicSlideOverPreview({
              show: true,
              type: "Add",
              data: null,
            });
          }}
        >
          Add New Discount Group
        </button>
      </div>
      {Discount?.docs?.length === 0 ? (
        <div className="intro-y box p-5 mt-5">
          <div className="items-center">
            <h2 className="text-lg font-medium mr-auto text-center">
              No Data Found
            </h2>
          </div>
        </div>
      ) : (
        <div className="intro-y box p-5 mt-5 ">
          <div className="overflow-x-scroll">
            <div className="" style={{ minWidth: "1000px" }}>
              <ReactTabulator
                columns={columns}
                data={Discount?.docs ? Discount.docs : []}
                options={optionTab}
              />
            </div>
          </div>
          {/* BEGIN: Pagination */}
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {Discount?.hasPrevPage ? (
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
                        onClick={() => setCurrentPage(Discount?.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(Discount?.prevPage)}
                      >
                        {Discount.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {Discount?.page}
                  </a>
                </li>
                {Discount?.hasNextPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(Discount?.nextPage)}
                      >
                        {Discount?.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(Discount?.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(Discount?.totalPages)}
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
      )}

      <Modal
        backdrop={loading ? "static" : ""}
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
            {loading ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-5">
                <Loader className="w-16 h-16 mx-auto mt-6" />
                <div className="text-2xl mt-5 mb-3">
                  Please wait <br /> while we are processing your request
                </div>
              </div>
            ) : (
              <div className="text-center">
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
            )}
          </div>
          {loading ? null : (
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalPreview({
                    show: false,
                    data: null,
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
            data: null,
          });
          setSubmit(false);
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="font-medium text-lg mr-auto">
            {basicSlideOverPreview.type === "Edit"
              ? "Edit Discount Group"
              : "Add New Discount Group"}
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
                    Discount Code*
                  </label>
                  <input
                    id="vertical-form-2"
                    type="text"
                    className="form-control"
                    placeholder="Discount Code"
                    name="discountCode"
                    value={values.discountCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.name && (
                    <span className="text-danger">{errors.discountCode}</span>
                  )}
                </div>
                <div className="mt-3">
                  <label htmlFor="vertical-form-2" className="form-label">
                    Discount Percentage*
                  </label>
                  <input
                    id="vertical-form-2"
                    type="number"
                    className="form-control"
                    placeholder="Discount Percentage"
                    name="discountPercentage"
                    value={values.discountPercentage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // onInput={(e) => {
                    //   // Remove any non-numeric characters except dot
                    //   e.target.value = e.target.value.replace(/[^0-9]/g, "");

                    //   // allow only one dot
                    //   if (e.target.value.split(".").length > 2) {
                    //     e.target.value = e.target.value.replace(/\+$/, "");
                    //   }

                    //   // Replace "000" with "0"
                    //   e.target.value = e.target.value.replace(/^0+(?=\d)/, "");

                    //   // Parse the input value
                    //   const inputValue = parseFloat(e.target.value);
                    //   // const inputValue = e.target.value;

                    //   // Limit the input to the range of 0 to 100
                    //   if (inputValue < 0) {
                    //     e.target.value = "0";
                    //   } else if (inputValue > 100) {
                    //     e.target.value = "100";
                    //   }
                    // }}
                    onKeyDown={(e) => {
                      // Prevent input of values greater than 100
                      if (e.key === "e" || e.key === "-" || e.key === "+") {
                        e.preventDefault();
                      }
                    }}
                    onKeyUp={(e) => {
                      // Prevent input of values greater than 100
                      const inputValue = parseFloat(e.target.value);
                      if (inputValue > 100) {
                        e.target.value = "100";
                      }
                    }}
                  />
                  {submit && errors.description && (
                    <span className="text-danger">
                      {errors.discountPercentage}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="vertical-form-3" className="form-label">
                    Description*
                  </label>
                  <input
                    id="vertical-form-3"
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {submit && errors.description && (
                    <span className="text-danger">{errors.description}</span>
                  )}
                </div>

                <button
                  className="btn btn-primary mt-7 px-7"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center mr-2">
                      <LoadingIcon icon="oval" className="w-4 h-4" />
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
                      data: null,
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
