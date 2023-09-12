import "toastr/build/toastr.min.css";

import * as Yup from "yup";

import { Fragment, useEffect, useState } from "react";
import {
  addNewUser,
  addVendor as onAddVendor,
  getCurrencyCode as onGetCurrencyCode,
  getPaymentMethod as onGetPaymentMethod,
  getPaymentTerm as onGetPaymentTerm,
  getVendor as onGetVendor,
  updateVendor as onUpdateVendor,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { helper as $h } from "@/utils";
import React from "react";
import Select from "react-select";
import toastr from "toastr";
import { useFormik } from "formik";

function VendorInformationForm({
  editMode,
  editModeCallback,
  setTabCallback,
  addEnabledTabs,
}) {
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState(false);
  const [updateEnabled, setUpdateEnabled] = useState(false);

  const [paymentTermsOptions, setPaymentTermsOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const { currencyCode } = useSelector((state) => state.CurrencyCodeReducer);
  const { PaymentTerm } = useSelector((state) => state.PaymentTermReducer);
  const { PaymentMethod } = useSelector((state) => state.PaymentMethodReducer);

  const { vendorAdded, vendorUpdated, vendor, loading, vendorData, userData } =
    useSelector((state) => state.ManageUsersReducer);

  // Fetch data on component mount
  useEffect(() => {
    const params = "?perPage=1000&page=1";
    dispatch(onGetCurrencyCode(params));
    dispatch(onGetPaymentTerm(params));
    dispatch(onGetPaymentMethod(params));
  }, [dispatch]);

  useEffect(() => {
    if (currencyCode?.docs) {
      const currencyOptions = currencyCode.docs.map(({ id, currencyCode }) => ({
        value: id,
        label: currencyCode,
      }));
      setCurrencyOptions(currencyOptions);
    }
  }, [currencyCode]);

  useEffect(() => {
    if (PaymentTerm?.docs) {
      const paymentTermsOptions = PaymentTerm.docs.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setPaymentTermsOptions(paymentTermsOptions);
    }
  }, [PaymentTerm]);

  useEffect(() => {
    if (PaymentMethod?.docs) {
      const paymentMethodOptions = PaymentMethod.docs.map(({ Id, name }) => ({
        value: Id,
        label: name,
      }));
      setPaymentMethodOptions(paymentMethodOptions);
    }
  }, [PaymentMethod]);

  useEffect(() => {
    if (!$h.isNullObject(vendor)) {
      const initialValues = mapVendorToInitialValues(vendor);
      setValues(initialValues);
    }
  }, [vendor]);

  useEffect(() => {
    if (vendorAdded) {
      addEnabledTabs("bankInformation");
      setTabCallback("bankInformation");
      dispatch(onGetVendor(`/${vendorData.id}`));
    } else if (vendorUpdated) {
      setUpdateEnabled(false);
      dispatch(onGetVendor(`/${vendor.id}`));
    }
  }, [vendorAdded, vendorUpdated]);

  const mapVendorToInitialValues = (vendor) => {
    const initialValues = {
      name: vendor.name ?? "",
      creditLimit: vendor.creditLimit ?? 0,
      taxRegistrationNumber: vendor.taxRegistrationNumber ?? "",
      billingAddress: vendor.billingAddress ?? "",
      shippingAddress: vendor.shippingAddress ?? "",
      email: vendor.email ?? "",
      phoneNumber: vendor.phoneNumber ?? "",
      currencyCode: vendor.currencyCode ?? "",
      paymentTerms: vendor.paymentTerms ?? "",
      paymentMethod: vendor.paymentMethod ?? "",
      companyName: vendor.companyName ?? "",
      tradeLicenseNo: vendor.tradeLicenseNo ?? "",
      businessAddress: vendor.businessAddress ?? "",
      businessName: vendor.businessName ?? "",
      businessDirectPhone: vendor.businessDirectPhone ?? "",
      businessEmail: vendor.businessEmail ?? "",
      businessCellPhone: vendor.businessCellPhone ?? "",
      authorizedName: vendor.authorizedName ?? "",
      authorizedTitle: vendor.authorizedTitle ?? "",
      authorizedEmail: vendor.authorizedEmail ?? "",
      authorizedDirectPhone: vendor.authorizedDirectPhone ?? "",
      authorizedCellPhone: vendor.authorizedCellPhone ?? "",
      billingPOBox: vendor.billingPOBox ?? "",
      billingZipCode: vendor.billingZipCode ?? "",
      billingCity: vendor.billingCity ?? "",
      billingCountry: vendor.billingCountry ?? "",
      billingName: vendor.billingName ?? "",
      billingTitle: vendor.billingTitle ?? "",
      billingEmail: vendor.billingEmail ?? "",
      billingDirectPhone: vendor.billingDirectPhone ?? "",
      billingCellPhone: vendor.billingCellPhone ?? "",
      legalStatusOfCompany: vendor.legalStatusOfCompany ?? "",
      auth: vendor.auth ?? "",
    };

    return initialValues;
  };

  const initialValues = {
    creditLimit: "", // op
    taxRegistrationNumber: "",
    billingAddress: "",
    shippingAddress: "", // op
    email: "",
    phoneNumber: "",
    currencyCode: "",
    paymentTerms: "", // op
    paymentMethod: "", // op
    companyName: "",
    tradeLicenseNo: "", // op
    businessAddress: "", // op
    businessName: "", // op
    businessDirectPhone: "", // op
    businessEmail: "", // op
    businessCellPhone: "", // op
    authorizedName: "", // op
    authorizedTitle: "", // op
    authorizedEmail: "", // op
    authorizedDirectPhone: "", // op
    authorizedCellPhone: "", // op
    billingPOBox: "", // op
    billingZipCode: "", // op
    billingCity: "", // op
    billingCountry: "", // op
    billingName: "", // op
    billingTitle: "", // op
    billingEmail: "", // op
    billingDirectPhone: "", // op
    billingCellPhone: "", // op
    legalStatusOfCompany: "", // op
    auth: "", // op
  };

  const validationSchema = Yup.object().shape({
    // creditLimit: Yup.string().required("Credit Limit is required"),
    taxRegistrationNumber: Yup.string().required(
      "Tax Registration Number is required"
    ),
    billingAddress: Yup.string().required("Billing Address is required"),
    shippingAddress: Yup.string().required("Shipping Address is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    currencyCode: Yup.string().required("Currency Code is required"),
    companyName: Yup.string().required("Company Name is required"),
  });

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setSubmit(false);

      const deepCopy = JSON.parse(JSON.stringify(values));
      deepCopy.paymentTerms =
        deepCopy.paymentTerms === "" ? null : deepCopy.paymentTerms;
      deepCopy.paymentMethod =
        deepCopy.paymentMethod === "" ? null : deepCopy.paymentMethod;
      deepCopy.currencyCode =
        deepCopy.currencyCode === "" ? null : deepCopy.currencyCode;
      // change credit limit to number from string
      deepCopy.creditLimit =
        deepCopy.creditLimit !== "" ? parseInt(deepCopy.creditLimit) ?? 0 : 0;

      if (editMode) {
        dispatch(
          onUpdateVendor({
            code: vendor.id,
            data: deepCopy,
          })
        );
      } else {
        deepCopy.defaultContact = userData.id ?? "";

        dispatch(onAddVendor(deepCopy));
      }
    },
  });

  useEffect(() => {
    // SET UPDATE ENABLED BASED ON EDIT MODE
    setUpdateEnabled(!editMode);
  }, [editMode]);

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
          <h2 className="font-medium text-base mr-auto">Vendor Information</h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col-reverse xl:flex-row">
            <div className="flex-1 mt-6 xl:mt-0">
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-12 xl:col-span-6">
                  <div className="">
                    <label htmlFor="companyName" className="form-label">
                      Company Name*
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.companyName}
                      name="companyName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.companyName && (
                      <div className="text-danger mt-2">
                        {errors.companyName}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label htmlFor="creditLimit" className="form-label">
                      Credit Limit
                    </label>
                    <input
                      id="creditLimit"
                      type="number"
                      className="form-control"
                      placeholder=""
                      value={values.creditLimit}
                      name="creditLimit"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.creditLimit && (
                      <div className="text-danger mt-2">
                        {errors.creditLimit}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="shippingAddress" className="form-label">
                      Shipping Address*
                    </label>
                    <input
                      id="shippingAddress"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.shippingAddress}
                      name="shippingAddress"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.shippingAddress && (
                      <div className="text-danger mt-2">
                        {errors.shippingAddress}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="email" className="form-label">
                      Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder=""
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.email && (
                      <div className="text-danger mt-2">{errors.email}</div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label htmlFor="currencyCode" className="form-label">
                      Currency Code*
                    </label>
                    <Select
                      className="form-control"
                      placeholder="Currency"
                      styles={{
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "1em",
                          color: "#A5B2C4",
                          fontWeight: 400,
                        }),
                      }}
                      name="currencyCode"
                      value={
                        currencyOptions.find(
                          (obj) => obj.value === values.currencyCode
                        ) || 0
                      }
                      onChange={(e) => {
                        setFieldValue("currencyCode", e.value);
                      }}
                      options={currencyOptions}
                      isDisabled={updateEnabled ? false : true}
                    />
                    {submit && errors.currencyCode && (
                      <div className="text-danger mt-2">
                        {errors.currencyCode}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label htmlFor="paymentTerms" className="form-label">
                      Payment Terms
                    </label>
                    <Select
                      className="form-control"
                      placeholder="Payment Terms"
                      styles={{
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "1em",
                          color: "#A5B2C4",
                          fontWeight: 400,
                        }),
                      }}
                      name="paymentTerms"
                      value={
                        paymentTermsOptions.find(
                          (obj) => obj.value === values.paymentTerms
                        ) || 0
                      }
                      onChange={(e) => {
                        setFieldValue("paymentTerms", e.value);
                      }}
                      options={paymentTermsOptions}
                      isDisabled={updateEnabled ? false : true}
                    />

                    {submit && errors.paymentTerms && (
                      <div className="text-danger mt-2">
                        {errors.paymentTerms}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="paymentMethod" className="form-label">
                      Payment Method
                    </label>
                    <Select
                      className="form-control"
                      placeholder="Payment Method"
                      styles={{
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "1em",
                          color: "#A5B2C4",
                          fontWeight: 400,
                        }),
                      }}
                      name="paymentMethod"
                      value={
                        paymentMethodOptions.find(
                          (obj) => obj.value === values.paymentMethod
                        ) || 0
                      }
                      onChange={(e) => {
                        setFieldValue("paymentMethod", e.value);
                      }}
                      options={paymentMethodOptions}
                      isDisabled={updateEnabled ? false : true}
                    />

                    {submit && errors.paymentMethod && (
                      <div className="text-danger mt-2">
                        {errors.paymentMethod}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="businessCellPhone" className="form-label">
                      Business Cell Phone
                    </label>
                    <input
                      id="businessCellPhone"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.businessCellPhone}
                      name="businessCellPhone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.businessCellPhone && (
                      <div className="text-danger mt-2">
                        {errors.businessCellPhone}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="authorizedName" className="form-label">
                      Authorized Name
                    </label>
                    <input
                      id="authorizedName"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.authorizedName}
                      name="authorizedName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.authorizedName && (
                      <div className="text-danger mt-2">
                        {errors.authorizedName}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="authorizedTitle" className="form-label">
                      Authorized Title
                    </label>
                    <input
                      id="authorizedTitle"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.authorizedTitle}
                      name="authorizedTitle"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.authorizedTitle && (
                      <div className="text-danger mt-2">
                        {errors.authorizedTitle}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingPOBox" className="form-label">
                      Billing PO Box
                    </label>
                    <input
                      id="billingPOBox"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingPOBox}
                      name="billingPOBox"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingPOBox && (
                      <div className="text-danger mt-2">
                        {errors.billingPOBox}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingZipCode" className="form-label">
                      Billing Zip Code
                    </label>
                    <input
                      id="billingZipCode"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingZipCode}
                      name="billingZipCode"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingZipCode && (
                      <div className="text-danger mt-2">
                        {errors.billingZipCode}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingCity" className="form-label">
                      Billing City
                    </label>
                    <input
                      id="billingCity"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingCity}
                      name="billingCity"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingCity && (
                      <div className="text-danger mt-2">
                        {errors.billingCity}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="legalStatusOfCompany"
                      className="form-label"
                    >
                      Legal Status of Company
                    </label>
                    <input
                      id="legalStatusOfCompany"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.legalStatusOfCompany}
                      name="legalStatusOfCompany"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.legalStatusOfCompany && (
                      <div className="text-danger mt-2">
                        {errors.legalStatusOfCompany}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="auth" className="form-label">
                      Auth
                    </label>
                    <input
                      id="auth"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.auth}
                      name="auth"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.auth && (
                      <div className="text-danger mt-2">{errors.auth}</div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingDirectPhone" className="form-label">
                      Billing Direct Phone
                    </label>
                    <input
                      id="billingDirectPhone"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingDirectPhone}
                      name="billingDirectPhone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingDirectPhone && (
                      <div className="text-danger mt-2">
                        {errors.billingDirectPhone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-12 xl:col-span-6">
                  <div className="mt-3 xl:mt-0">
                    <label
                      htmlFor="taxRegistrationNumber"
                      className="form-label"
                    >
                      Tax Registration Number*
                    </label>
                    <input
                      id="taxRegistrationNumber"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.taxRegistrationNumber}
                      name="taxRegistrationNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.taxRegistrationNumber && (
                      <div className="text-danger mt-2">
                        {errors.taxRegistrationNumber}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingAddress" className="form-label">
                      Billing Address*
                    </label>
                    <input
                      id="billingAddress"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingAddress}
                      name="billingAddress"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingAddress && (
                      <div className="text-danger mt-2">
                        {errors.billingAddress}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number*
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.phoneNumber}
                      name="phoneNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.phoneNumber && (
                      <div className="text-danger mt-2">
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label htmlFor="tradeLicenseNo" className="form-label">
                      Trade License Number
                    </label>
                    <input
                      id="tradeLicenseNo"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.tradeLicenseNo}
                      name="tradeLicenseNo"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.tradeLicenseNo && (
                      <div className="text-danger mt-2">
                        {errors.tradeLicenseNo}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="businessAddress" className="form-label">
                      Business Address
                    </label>
                    <input
                      id="businessAddress"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.businessAddress}
                      name="businessAddress"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.businessAddress && (
                      <div className="text-danger mt-2">
                        {errors.businessAddress}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="businessName" className="form-label">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.businessName}
                      name="businessName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.businessName && (
                      <div className="text-danger mt-2">
                        {errors.businessName}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="businessDirectPhone" className="form-label">
                      Business Direct Phone
                    </label>
                    <input
                      id="businessDirectPhone"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.businessDirectPhone}
                      name="businessDirectPhone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.businessDirectPhone && (
                      <div className="text-danger mt-2">
                        {errors.businessDirectPhone}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="businessEmail" className="form-label">
                      Business Email
                    </label>
                    <input
                      id="businessEmail"
                      type="email"
                      className="form-control"
                      placeholder=""
                      value={values.businessEmail}
                      name="businessEmail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.businessEmail && (
                      <div className="text-danger mt-2">
                        {errors.businessEmail}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="authorizedEmail" className="form-label">
                      Authorized Email
                    </label>
                    <input
                      id="authorizedEmail"
                      type="email"
                      className="form-control"
                      placeholder=""
                      value={values.authorizedEmail}
                      name="authorizedEmail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.authorizedEmail && (
                      <div className="text-danger mt-2">
                        {errors.authorizedEmail}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="authorizedDirectPhone"
                      className="form-label"
                    >
                      Authorized Direct Phone
                    </label>
                    <input
                      id="authorizedDirectPhone"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.authorizedDirectPhone}
                      name="authorizedDirectPhone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.authorizedDirectPhone && (
                      <div className="text-danger mt-2">
                        {errors.authorizedDirectPhone}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="authorizedCellPhone" className="form-label">
                      Authorized Cell Phone
                    </label>
                    <input
                      id="authorizedCellPhone"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.authorizedCellPhone}
                      name="authorizedCellPhone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.authorizedCellPhone && (
                      <div className="text-danger mt-2">
                        {errors.authorizedCellPhone}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingCountry" className="form-label">
                      Billing Country
                    </label>
                    <input
                      id="billingCountry"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingCountry}
                      name="billingCountry"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingCountry && (
                      <div className="text-danger mt-2">
                        {errors.billingCountry}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingName" className="form-label">
                      Billing Name
                    </label>
                    <input
                      id="billingName"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingName}
                      name="billingName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingName && (
                      <div className="text-danger mt-2">
                        {errors.billingName}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingTitle" className="form-label">
                      Billing Title
                    </label>
                    <input
                      id="billingTitle"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingTitle}
                      name="billingTitle"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingTitle && (
                      <div className="text-danger mt-2">
                        {errors.billingTitle}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingEmail" className="form-label">
                      Billing Email
                    </label>
                    <input
                      id="billingEmail"
                      type="email"
                      className="form-control"
                      placeholder=""
                      value={values.billingEmail}
                      name="billingEmail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingEmail && (
                      <div className="text-danger mt-2">
                        {errors.billingEmail}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label htmlFor="billingCellPhone" className="form-label">
                      Billing Cell Phone
                    </label>
                    <input
                      id="billingCellPhone"
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={values.billingCellPhone}
                      name="billingCellPhone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={updateEnabled ? false : true}
                    />
                    {submit && errors.billingCellPhone && (
                      <div className="text-danger mt-2">
                        {errors.billingCellPhone}
                      </div>
                    )}
                  </div>
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
                        setUpdateEnabled(false);
                      }}
                    >
                      Cancel
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

export default VendorInformationForm;
