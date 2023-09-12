import * as Yup from "yup";

import { Fragment, useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "@/base-components";

import { updateRemainingQuantity } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

const QuantityModal = ({ show, callbackfunc, qty, limit }) => {
  const [submit, setSubmit] = useState(false);

  const [data, setData] = useState({});

  const dispatch = useDispatch();

  const getInfo = () => {
    const data = localStorage.getItem("authUser");
    if (data) {
      setData(JSON.parse(data).azure_data);
    }
  };

  useEffect(() => {
    getInfo();
  }, [qty]);

  const initialValues = {
    quantity: ""
  };

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const validationSchema = Yup.object().shape({
    // cannot be empty and never less than given value qty
    quantity: Yup.number()
      .required("Quantity is required")
      .min(Math.max(limit || 5, 5), "Quantity cannot be less than " + Math.max(limit || 5, 5))
  });

  const { values, errors, handleSubmit, handleChange, handleBlur, setFieldValue, resetForm } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values, { resetForm }) => {
        setSubmit(false);

        // check if new quantity is equal to old quantity then do not update
        if (values.quantity !== data?.azure_quantity) {
          dispatch(
            updateRemainingQuantity({
              azureId: data?.azure_unique_id,
              quantity: values.quantity.toString()
            })
          );
        }

        //     onUpdateUser({
        //       code: basicSlideOverPreview.data._id,
        //       data: values
        //     })
        //   );
        callbackfunc(false);
        resetForm();
      }
    });

  useEffect(() => {
    if (data.azure_quantity) {
      setFieldValue("quantity", data.azure_quantity);
    }
  }, [show]);

  return (
    <Modal
      size="modal-lg"
      slideOver={true}
      show={show}
      onHidden={() => {
        callbackfunc(false);
        setSubmit(false);
        resetForm();
      }}
    >
      <ModalHeader className="p-5">
        <h1 className="font-medium text-lg mr-auto">Remaining Users</h1>
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
                  User Quantity*
                </label>
                <input
                  id="vertical-form-2"
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={0}
                  onKeyUp={(e) => {
                    // do not allow negative values
                    if (e.target.value < 0) {
                      setFieldValue("quantity", 0);
                    }
                  }}
                  onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                />
                {submit && errors.quantity && (
                  <span className="text-danger">{errors.quantity}</span>
                )}
              </div>

              <button className="btn btn-primary mt-7 px-7" type="submit">
                Save
              </button>

              <button
                className="btn btn-outline-secondary mt-5 ml-2 px-7"
                type="button"
                onClick={() => {
                  callbackfunc(false);
                  setSubmit(false);
                  resetForm();
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

export default QuantityModal;
