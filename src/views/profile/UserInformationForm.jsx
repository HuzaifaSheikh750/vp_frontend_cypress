import "toastr/build/toastr.min.css";

import * as Yup from "yup";

import { Fragment, useEffect, useState } from "react";
import {
  addNewUser,
  getSpecificUser as onGetSpecificUser,
  updateUser as onUpdateUser,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { helper as $h } from "@/utils";
import toastr from "toastr";
import { useFormik } from "formik";

function UserInformationForm({
  editMode,
  editModeCallback,
  setTabCallback,
  addEnabledTabs,
}) {
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState(false);
  const [updateEnabled, setUpdateEnabled] = useState(true);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    gender: "",
    retypePassword: "",
  };

  useEffect(() => {
    // SET UPDATE ENABLED BASED ON EDIT MODE
    setUpdateEnabled(!editMode);
  }, [editMode]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: editMode
      ? ""
      : Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
    retypePassword: editMode
      ? ""
      : Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const {
    user,
    loading,
    added,
    updated,
    error,
    userData,
    shippingInfoDeleted,
  } = useSelector((state) => state.ManageUsersReducer);

  useEffect(() => {
    if (updated || added) {
      if (updated) {
        setUpdateEnabled(false);
        dispatch(onGetSpecificUser(`/${user.id}`));
      } else if (added) {
        addEnabledTabs("shipmentSettings");
        setTabCallback("shipmentSettings");
        dispatch(onGetSpecificUser(`/${userData.id}`));
      }
    } else if (error && typeof error === "string") {
      toastr.error(error);
    }
  }, [updated, added]);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setSubmit(false);

      if (editMode) {
        const payload = {
          code: user.id,
          data: {
            name: values.name,
            gender: values.gender,
          },
        };
        dispatch(onUpdateUser(payload));
      } else {
        const body = {
          name: values.name,
          email: values.email,
          password: values.password,
          gender: values.gender,
          roleId: 1001,
        };
        dispatch(addNewUser(body));
      }
    },
  });

  useEffect(() => {
    if (!$h.isNullObject(user)) {
      setFieldValue("name", user?.name || "");
      setFieldValue("email", user?.email || "");
      setFieldValue("gender", user?.gender || "");
    }
  }, [user]);

  return (
    <div className="intro-y box mt-5">
      <form
        className="form form-vertical"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmit(true);
          handleSubmit();
        }}
      >
        <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <h2 className="font-medium text-base mr-auto">
            Personal Information
          </h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col-reverse xl:flex-row">
            <div className="flex-1 mt-6 xl:mt-0">
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-12 xl:col-span-6">
                  <div>
                    <label
                      htmlFor="update-profile-form-6"
                      className="form-label"
                    >
                      Name
                    </label>
                    <input
                      id="update-profile-form-7"
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                      value={values.name}
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!updateEnabled}
                    />
                    {submit && errors.name && (
                      <div className="text-danger mt-2">{errors.name}</div>
                    )}
                  </div>
                  {!editMode ? (
                    <div className="mt-3">
                      <label
                        htmlFor="update-profile-form-8"
                        className="form-label"
                      >
                        Password
                      </label>
                      <input
                        id="update-profile-form-8"
                        type="password"
                        className="form-control"
                        placeholder="Enter Password"
                        value={values.password}
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!updateEnabled}
                      />
                      {submit && errors.password && (
                        <div className="text-danger mt-2">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="mt-3">
                    <label htmlFor="vertical-form-4" className="form-label">
                      Gender*
                    </label>

                    <div className="w-full mt-2 xl:mt-0 flex-1">
                      <div className="flex flex-col sm:flex-row">
                        <div className="form-check mr-4">
                          <input
                            id="Male"
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            value="male"
                            checked={values.gender === "male"}
                            onChange={handleChange}
                            disabled={!updateEnabled}
                          />
                          <label className="form-check-label" htmlFor="Male">
                            Male
                          </label>
                        </div>
                        <div className="form-check mr-4 mt-2 sm:mt-0">
                          <input
                            id="Female"
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            value="female"
                            checked={values.gender === "female"}
                            onChange={handleChange}
                            disabled={!updateEnabled}
                          />
                          <label className="form-check-label" htmlFor="Female">
                            Female
                          </label>
                        </div>
                        {submit && errors.password && (
                          <div className="text-danger">{errors.gender}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 xl:col-span-6">
                  <div>
                    <label
                      htmlFor="update-profile-form-7"
                      className="form-label"
                    >
                      Email
                    </label>
                    <input
                      id="update-profile-form-6"
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!updateEnabled || editMode}
                    />
                    {submit && errors.email && (
                      <div className="text-danger mt-2">{errors.email}</div>
                    )}
                  </div>

                  {!editMode ? (
                    <div className="mt-3">
                      <label
                        htmlFor="update-profile-form-9"
                        className="form-label"
                      >
                        Retype Password
                      </label>

                      <input
                        id="update-profile-form-9"
                        type="password"
                        className="form-control"
                        placeholder="Re-Enter Password"
                        value={values.retypePassword}
                        name="retypePassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!updateEnabled}
                      />
                      {submit && errors.retypePassword && (
                        <div className="text-danger mt-2">
                          {errors.retypePassword}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                {updateEnabled ? (
                  <div className="flex">
                    <button
                      type="submit"
                      className="btn btn-primary flex items-center"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 ml-3"
                      disabled={!editMode}
                      onClick={() => {
                        // navigate("/das");

                        setUpdateEnabled(false);
                      }}
                    >
                      Back
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="flex items-center btn btn-primary"
                    onClick={() => {
                      setSubmit(false);
                      setUpdateEnabled(true);
                    }}
                  >
                    Update Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserInformationForm;
