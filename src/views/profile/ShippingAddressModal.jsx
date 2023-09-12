import * as Yup from "yup";

import { Fragment, useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "@/base-components";
import {
  addBankingInfo as onAddBankingInfo,
  getVendor as onGetVendor,
  updateBankingInfo as onUpdateBankingInfo,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { helper as $h } from "@/utils";
import { Lucide } from "@/base-components";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const ShippingAddressModal = ({ show, type, Func, data, editMode }) => {
  const navigate = useNavigate();
  const [submit, setSubmit] = useState(false);
  const dispatch = useDispatch();

  // const { user, shippingInfoUpdated, shippingInfoAdded, error, loading } =
  //   useSelector((state) => state.ManageUsersReducer);

  const {
    vendorAdded,
    vendor,
    loading,
    user,
    vendorData,
    userData,
    bankData,
    bankUpdated,
    bankAdded,
    bankDeleted,
  } = useSelector((state) => state.ManageUsersReducer);

  useEffect(() => {
    if (bankAdded || bankUpdated || bankDeleted) {
      resetForm();
      Func({
        show: false,
        type: "",
        data: null,
      });
      setSubmit(false);
      // check url has id
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      dispatch(onGetVendor("/" + vendor.id));
      if (!editMode) {
        navigate(`/manage-vendors`);
      }
      // if (id) {
      // } else {
      //   navigate(`/profile?id=${user.id}`);
      // }
    }
  }, [bankAdded, bankUpdated, bankDeleted]);

  // useEffect(() => {
  //   if (shippingInfoUpdated || shippingInfoAdded) {
  //     resetForm();
  //     Func({
  //       show: false,
  //       type: "",
  //       data: null,
  //     });
  //     setSubmit(false);
  //     // dispatch(getSpecificUser("/" + user._id));
  //     // dispatch(clearShippingInfo());
  //   }

  //   if (error) {
  //     resetForm();
  //     Func({
  //       show: false,
  //       type: "",
  //       data: null,
  //     });
  //     setSubmit(false);
  //     // dispatch(clearShippingInfo());
  //   }
  // }, [shippingInfoUpdated, shippingInfoAdded, error]);

  useEffect(() => {
    // populate data in form

    if (data) {
      setFieldValue("bank", data?.bank ?? "");
      setFieldValue("accountTitle", data?.accountTitle ?? "");
      setFieldValue("accountNumber", data?.accountNumber ?? "");
      setFieldValue("iban", data?.iban ?? "");
      setFieldValue("swiftCode", data?.swiftCode ?? "");
      setFieldValue("bankBranchCode", data?.bankBranchCode ?? "");
      setFieldValue("bankBranchAddress", data?.bankBranchAddress ?? "");
    } else {
      resetForm();
    }
  }, [data]);

  const initialValues = {
    bank: "",
    accountTitle: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
    bankBranchCode: "",
    bankBranchAddress: "",
  };

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
    validationSchema: Yup.object().shape({
      bank: Yup.string().required("Required"),
      accountTitle: Yup.string().required("Required"),
      accountNumber: Yup.string().required("Required"),
    }),

    onSubmit: (values, { resetForm }) => {
      const deepCopy = JSON.parse(JSON.stringify(values));
      deepCopy.vendorId = vendor.id;

      if (type === "add") {
        dispatch(onAddBankingInfo(deepCopy));
      } else if (type === "edit") {
        dispatch(
          onUpdateBankingInfo({
            code: data?.id,
            data: deepCopy,
          })
        );
      }

      setSubmit(false);
    },
  });

  return (
    <Modal
      size="modal-lg"
      slideOver={true}
      show={show}
      onHidden={() => {
        Func({
          show: false,
          type: "",
          data: null,
        });
        setSubmit(false);
        //  resetForm();
      }}
    >
      <ModalHeader className="p-5">
        <h1 className="font-medium text-lg mr-auto">
          {" "}
          {type === "edit" ? "Update Bank Information" : "Add Bank Information"}
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
            <div className="p-3">
              <div className="mt-3">
                <label htmlFor="bank" className="form-label">
                  Bank*
                </label>
                <input
                  id="bank"
                  type="text"
                  className="form-control"
                  placeholder="Bank"
                  name="bank"
                  value={values.bank}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {submit && errors.bank && (
                  <span className="text-danger">{errors.bank}</span>
                )}
              </div>
              <div className="mt-3">
                <label htmlFor="accountTitle" className="form-label">
                  Account Title*
                </label>
                <input
                  id="accountTitle"
                  type="text"
                  className="form-control"
                  placeholder="Account Title"
                  name="accountTitle"
                  value={values.accountTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {submit && errors.accountTitle && (
                  <span className="text-danger">{errors.accountTitle}</span>
                )}
              </div>
              <div className="mt-3">
                <label htmlFor="accountNumber" className="form-label">
                  Account Number*
                </label>
                <input
                  id="accountNumber"
                  type="number"
                  className="form-control"
                  placeholder="Account Number"
                  name="accountNumber"
                  value={values.accountNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {submit && errors.accountNumber && (
                  <span className="text-danger">{errors.accountNumber}</span>
                )}
              </div>
              <div className="mt-3">
                <label htmlFor="iban" className="form-label">
                  IBAN
                </label>
                <input
                  id="iban"
                  type="text"
                  className="form-control"
                  placeholder="IBAN"
                  name="iban"
                  value={values.iban}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {submit && errors.iban && (
                  <span className="text-danger">{errors.iban}</span>
                )}
              </div>
              <div className="mt-3">
                <label htmlFor="swiftCode" className="form-label">
                  Swift Code
                </label>
                <input
                  id="swiftCode"
                  type="text"
                  className="form-control"
                  placeholder="Swift Code"
                  name="swiftCode"
                  value={values.swiftCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {submit && errors.swiftCode && (
                  <span className="text-danger">{errors.swiftCode}</span>
                )}
              </div>
              <div className="mt-3">
                <label htmlFor="bankBranchCode" className="form-label">
                  Bank Branch Code
                </label>
                <input
                  id="bankBranchCode"
                  type="text"
                  className="form-control"
                  placeholder="Bank Branch Code"
                  name="bankBranchCode"
                  value={values.bankBranchCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {submit && errors.bankBranchCode && (
                  <span className="text-danger">{errors.bankBranchCode}</span>
                )}
              </div>
              <div className="mt-3">
                <label htmlFor="bankBranchAddress" className="form-label">
                  Bank Branch Address
                </label>
                <input
                  id="bankBranchAddress"
                  type="text"
                  className="form-control"
                  placeholder="Bank Branch Address"
                  name="bankBranchAddress"
                  value={values.bankBranchAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {submit && errors.bankBranchAddress && (
                  <span className="text-danger">
                    {errors.bankBranchAddress}
                  </span>
                )}
              </div>

              <button
                className="btn btn-primary mt-7 px-7"
                type="submit"
                disabled={loading}
              >
                {type === "edit" ? "Update" : "Add"}
              </button>
              <button
                className="btn btn-outline-secondary mt-5 ml-2 px-7"
                type="button"
                onClick={() => {
                  Func({
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
  );
};

export default ShippingAddressModal;
