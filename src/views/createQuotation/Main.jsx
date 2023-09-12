import * as Yup from "yup";

import { Litepicker, Lucide, Modal, ModalBody } from "@/base-components";
import {
  getCurrencyCode as onGetCurrencyCode,
  getPaymentMethod as onGetPaymentMethod,
  getPaymentTerm as onGetPaymentTerm,
  getProductList as onGetProductList,
  getReasoningList as onGetReasoningList,
  getSalesOrderList as onGetSalesOrderList,
  getSalesUnit as onGetSalesUnit,
  getSourcing as onGetSourcing,
  getSpecificQuotation as onGetSpecificQuotation,
  getVendorList as onGetVendor,
  postQuotation as onPostQuotation,
  resetQuotationStatus as onResetQuotationStatus,
  updateQuotation as onUpdateQuotation,
} from "@/store/actions";
import { animateScroll as scroll, scroller } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { helper as $h } from "@/utils";
import Constants from "../../constants/Constants";
import { LoadingIcon } from "@/base-components";
import Select from "react-select";
import classnames from "classnames";
import moment from "moment";
import { updateReasoningCall } from "../../helpers/backend_helper";
import { useFormik } from "formik";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const location = useLocation();
  // const data = location.state?.data;

  const [submit, setSubmit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [tab, setTab] = useState(1);
  const [productListOptions, setProductListOptions] = useState([]);
  const [salesUnitOptions, setSalesUnitOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [paymentTermsOptions, setPaymentTermsOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [vendorsOptions, setVendorsOptions] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [reasoningListOptions, setReasoningList] = useState([]);
  const [reasonText, setReasonText] = useState("");

  const [deleteModalPreview, setDeleteModalPreview] = useState({
    show: false,
    data: null,
  });

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
  ];

  // Fetch data on component mount
  useEffect(() => {
    const params = "?perPage=1000&page=1";
    dispatch(onGetProductList(params));
    dispatch(onGetCurrencyCode(params));
    dispatch(onGetSalesUnit(params));
    dispatch(onGetPaymentTerm(params));
    dispatch(onGetPaymentMethod(params));
    dispatch(onGetVendor(params));
    dispatch(onGetReasoningList(params));
    dispatch(onGetSourcing(params));
  }, [dispatch]);

  // Extract data from reducers
  const { productList } = useSelector((state) => state.ProductListReducer);
  const { salesUnit } = useSelector((state) => state.SalesUnitReducer);
  const { currencyCode } = useSelector((state) => state.CurrencyCodeReducer);
  const { PaymentTerm } = useSelector((state) => state.PaymentTermReducer);
  const { PaymentMethod } = useSelector((state) => state.PaymentMethodReducer);
  const { vendors } = useSelector((state) => state.VendorReducer);
  const { added, loadingForAdd, quotation, updated } = useSelector(
    (state) => state.QuotationReducer
  );

  const { sourcings } = useSelector((state) => state.SourcingReducer);
  const { reasoningList } = useSelector((state) => state.QuotationReducer);

  // Transform data for select options
  useEffect(() => {
    if (productList?.docs) {
      const productListOptions = productList.docs.map(
        ({ id, name, uomId, unitPrice }) => ({
          value: id,
          label: name,
          uomId: uomId,
          unitCost: unitPrice,
        })
      );
      setProductListOptions(productListOptions);
    }
  }, [productList]);

  useEffect(() => {
    if (salesUnit?.docs) {
      const salesUnitOptions = salesUnit.docs.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setSalesUnitOptions(salesUnitOptions);
    }
  }, [salesUnit]);

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

  const [sourcingOptions, setSourcingOptions] = useState([]);

  useEffect(() => {
    if (sourcings?.docs) {
      const sourcingOptions = sourcings.docs.map(({ id }) => ({
        value: id,
        label: id,
      }));
      setSourcingOptions(sourcingOptions);
    }
  }, [sourcings]);

  useEffect(() => {
    if (vendors?.docs) {
      const vendorsOptions = vendors.docs.map(
        ({
          id,
          name,
          paymentMethod,
          paymentTerms,
          currencyCode,
          companyName,
        }) => ({
          value: id,
          label: id + " - " + companyName,
          name: name ?? "",
          paymentMethod: paymentMethod ?? "",
          paymentTerms: paymentTerms ?? "",
          currencyCode: currencyCode ?? "",
        })
      );
      setVendorsOptions(vendorsOptions);
    }
  }, [vendors]);

  useEffect(() => {
    if (reasoningList?.docs) {
      const ReasonOptions = reasoningList.docs.map(
        ({ id, reason, status }) => ({
          value: id,
          label: reason,
          status: status,
        })
      );

      setReasoningList(ReasonOptions);
    }
  }, [reasoningList]);

  useEffect(() => {
    if (added || updated) {
      setSubmit(false);
      resetForm();
      dispatch(onResetQuotationStatus());
      dispatch(onGetSalesOrderList("?perPage=10&page=1"));
      if (updated) {
        navigate("/Quotation");
      }
    }
  }, [added, updated]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const edit = urlParams.get("edit");
    setEdit({
      edit: edit,
      id: id,
    });
    if (edit === "true" && id) {
      if ($h.isNullObject(quotation)) {
        let param = `/${id}`;
        dispatch(onGetSpecificQuotation(param));

        // parse into quotation object
      } else if (quotation.id !== parseInt(id)) {
        let param = `/${id}`;

        dispatch(onGetSpecificQuotation(param));
      } else {
        setFieldValue("id", quotation?.id ?? "");
        setFieldValue("name", quotation?.name ?? "");
        setFieldValue("vendorDocumentNum", quotation?.vendorDocumentNum ?? "");
        setFieldValue("documentDate", quotation?.documentDate ?? "");
        setFieldValue("description", quotation?.description ?? "");
        setFieldValue("taxAmount", quotation?.taxAmount ?? "");
        setFieldValue("discountAmount", quotation?.discountAmount ?? "");
        setFieldValue(
          "discountPercentage",
          quotation?.discountPercentage ?? ""
        );
        // setfieldvalue for reqForQuoteId
        setFieldValue("reqForQuoteId", quotation?.reqForQuoteId ?? "");
        setFieldValue("status", quotation?.status ?? "");
        setFieldValue("totalExclTax", quotation?.totalExclTax ?? "");
        setFieldValue("totalAmount", quotation?.totalAmount ?? "");
        setFieldValue("paymentTerms", quotation?.paymentTerms ?? "");
        setFieldValue("paymentMethod", quotation?.paymentMethod ?? "");
        setFieldValue("currency", quotation?.currency ?? "");
        setFieldValue("vendorId", quotation?.vendorId ?? "");
        // insert vendorQuoteLine
        if (quotation?.vendorQuoteLine?.length > 0) {
          const vendorQuoteLine = quotation?.vendorQuoteLine?.map(
            ({ id, itemId, quantity, uomId, unitCost, currency }) => ({
              id: id,
              itemId: itemId,
              quantity: quantity,
              uomId: uomId ?? "",
              unitCost: unitCost ? parseFloat(unitCost) : "",
              currency: currency,
              lineAmount: quantity * unitCost,
            })
          );
          setFieldValue("vendorQuoteLine", vendorQuoteLine);
        }
      }
    } else {
      resetForm();
      // set date as todays date
      const date = moment().format("YYYY-MM-DD");
      setFieldValue("documentDate", date);
    }
  }, [quotation]);

  function scrollTo(element) {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  }

  function scrollToTop() {
    scroll.scrollToTop();
  }

  function handleReasonSelection() {
    if (selectedReason !== null) {
      function callUpdateReasoning() {
        const payload = {
          module: "/vendor-quote-headers",
          params: edit.id,
          data: {
            reasonId: selectedReason.value,
            status: selectedReason.status,
            reason:
              selectedReason.label == "other"
                ? reasonText
                : selectedReason.label,
          },
        };
        updateReasoningCall(payload)
          .then((response) => {
            // handle success
          })
          .catch((error) => {
            // handle error
          });
      }

      callUpdateReasoning();
      setSelectedReason(null);
    }

    if ($h.getRoleId() !== Constants.ADMIN_ROLE_ID) {
      const { name, vendorId, ...rest } = deleteModalPreview.data;

      dispatch(
        onUpdateQuotation({
          code: edit.id,
          body: rest,
        })
      );
    } else {
      dispatch(
        onUpdateQuotation({
          code: edit.id,
          body: deleteModalPreview.data,
        })
      );
    }

    setDeleteModalPreview({
      show: false,
      data: null,
    });
  }

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    setValues,
    setFormValues,
  } = useFormik({
    initialValues: {
      vendorId: "",
      name: "",
      vendorDocumentNum: "",
      documentDate: "",
      description: "",
      status: edit?.edit === "true" ? "" : "draft",
      taxAmount: "0",
      discountAmount: "",
      discountPercentage: "0",
      totalExclTax: "",
      totalAmount: "",
      paymentTerms: "",
      reqForQuoteId: "",
      paymentMethod: "",
      currency: "",
      vendorQuoteLine: [
        {
          itemId: "",
          quantity: "",
          uomId: "",
          unitCost: "",
          lineAmount: "",
          currency: "",
        },
      ],
    },
    validationSchema: Yup.object().shape({
      vendorId:
        $h.getRoleId() === Constants.ADMIN_ROLE_ID
          ? Yup.string().required("Required")
          : null,
      vendorDocumentNum: Yup.string().required("Required"),
      documentDate: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      paymentTerms: Yup.string().required("Required"),
      paymentMethod: Yup.string().required("Required"),
      currency: Yup.string().required("Required"),
      reqForQuoteId: Yup.string().required("Required"),
      vendorQuoteLine: Yup.array().of(
        Yup.object().shape({
          itemId: Yup.string().required("Required"),
          quantity: Yup.string().required("Required"),
          uomId: Yup.string().required("Required"),
          unitCost: Yup.string().required("Required"),
          lineAmount: Yup.string().required("Required"),
          currency: Yup.string().required("Required"),
        })
      ),
    }),

    onSubmit: (values) => {
      if (edit.edit === "true") {
        const valuesObj = JSON.parse(JSON.stringify(values));
        // convert string to numbers for discount and tax and total
        valuesObj.discountAmount = parseFloat(valuesObj.discountAmount);
        valuesObj.taxAmount = parseFloat(valuesObj.taxAmount);
        valuesObj.totalExclTax = parseFloat(valuesObj.totalExclTax);
        valuesObj.totalAmount = parseFloat(valuesObj.totalAmount);
        valuesObj.discountPercentage = parseFloat(valuesObj.discountPercentage);
        // add quoteNum to valuesObj.vendorQuoteLine
        valuesObj.vendorQuoteLine = valuesObj.vendorQuoteLine.map((item) => ({
          ...item,
          quoteNum: quotation.id,
        }));

        const { name, vendorId, ...rest } = valuesObj;

        // if status is cancelled, show modal
        if (valuesObj.status === "rejected") {
          setDeleteModalPreview({
            show: true,
            data: valuesObj,
          });
        } else {
          if ($h.getRoleId() !== Constants.ADMIN_ROLE_ID) {
            const { name, vendorId, ...rest } = valuesObj;

            dispatch(
              onUpdateQuotation({
                code: edit.id,
                body: rest,
              })
            );
          } else {
            dispatch(
              onUpdateQuotation({
                code: edit.id,
                body: valuesObj,
              })
            );
          }
        }

        // dispatch(onUpdateOrderManagement(values));
      } else {
        const valuesObj = JSON.parse(JSON.stringify(values));
        // convert string to numbers for discount and tax and total
        valuesObj.discountAmount = parseFloat(valuesObj.discountAmount);
        valuesObj.taxAmount = parseFloat(valuesObj.taxAmount);
        valuesObj.totalExclTax = parseFloat(valuesObj.totalExclTax);
        valuesObj.totalAmount = parseFloat(valuesObj.totalAmount);
        valuesObj.discountPercentage = parseFloat(valuesObj.discountPercentage);

        if ($h.getRoleId() !== Constants.ADMIN_ROLE_ID) {
          const { name, vendorId, ...rest } = valuesObj;

          dispatch(onPostQuotation(rest));
        } else {
          dispatch(onPostQuotation(valuesObj));
        }
      }
    },
  });

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const invalidSymbols = ["e", "E", "+", "-"]; // invalid symbols for input type number : Unit Cost

  function CalculateValues({
    lineAmount,
    index,
    discountPercentage,
    taxAmount,
    discountAmount,
  }) {
    const total = values.vendorQuoteLine.reduce((acc, item, i) => {
      if (i === index) {
        return acc + parseFloat(lineAmount) || 0.0;
      }
      return acc + parseFloat(item.lineAmount) || 0.0;
    }, 0);
    const discountAmountFromPercent = discountPercentage
      ? (total * parseFloat(discountPercentage)) / 100 || 0.0
      : (total * parseFloat(values.discountPercentage)) / 100 || 0.0;

    const discountAmount1 = discountAmount
      ? discountAmount
      : values.discountAmount;

    const totalExclTax = total - discountAmountFromPercent - discountAmount1;
    const tempTaxAmount = taxAmount
      ? parseFloat(taxAmount) || 0.0
      : parseFloat(values.taxAmount) || 0.0;
    const totalAmount = totalExclTax + tempTaxAmount;
    // setFieldValue("discountAmount", discountAmount.toFixed(2));
    setFieldValue("totalExclTax", totalExclTax.toFixed(2));
    setFieldValue("totalAmount", totalAmount.toFixed(2));
  }

  const handleDateChange = (date, field) => {
    // if date is string, convert it to date object
    if (typeof date === "string") {
      setFieldValue(field, date);
    } else {
    }
  };

  const onSelectChangeHandle = (rec, index) => {
    const quantity = parseFloat(values.vendorQuoteLine[index].quantity) || 0.0;
    const unitCost = parseFloat(rec.unitCost) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(`vendorQuoteLine.${index}.lineAmount`, lineAmount.toFixed(2));
    setFieldValue(`vendorQuoteLine.${index}.unitCost`, unitCost.toFixed(2));
    setFieldValue(`vendorQuoteLine.${index}.itemId`, rec.value);
    setFieldValue(`vendorQuoteLine.${index}.uomId`, rec.uomId);
    CalculateValues({ lineAmount, index });

    const currency = values.currency;
    setFieldValue(`vendorQuoteLine.${index}.currency`, currency);
  };

  const onQuantityChangeHandle = (event, index) => {
    const { value } = event.target;
    const quantity = parseFloat(value) || 0.0;
    const unitCost = parseFloat(values.vendorQuoteLine[index].unitCost) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(`vendorQuoteLine.${index}.lineAmount`, lineAmount.toFixed(2));
    setFieldValue(`vendorQuoteLine.${index}.quantity`, quantity);
    CalculateValues({ lineAmount, index });
  };

  const onUnitCostChangeHandle = (event, index) => {
    const { value } = event.target;
    const unitCost = parseFloat(value) || 0.0;
    // const unitCost = value;
    const quantity = parseFloat(values.vendorQuoteLine[index].quantity) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(`vendorQuoteLine.${index}.unitCost`, unitCost.toFixed(2));
    setFieldValue(`vendorQuoteLine.${index}.lineAmount`, lineAmount.toFixed(2));
    CalculateValues({ lineAmount, index });
  };

  const onDiscountPercentageChangeHandle = (event) => {
    const { value } = event.target;
    const discountPercentage = parseFloat(value) || 0.0;
    setFieldValue(`discountPercentage`, discountPercentage.toFixed(2));
    CalculateValues({ discountPercentage });
  };

  const onTaxAmountChangeHandle = (event) => {
    const { value } = event.target;
    const taxAmount = parseFloat(value) || 0.0;
    setFieldValue(`taxAmount`, taxAmount.toFixed(2));
    CalculateValues({ taxAmount });
  };

  const onInputHandle = (e) => {
    // Remove any non-numeric characters except dot
    e.target.value = e.target.value.replace(/[^0-9.]/g, "");

    // allow only one dot
    if (e.target.value.split(".").length > 2) {
      e.target.value = e.target.value.replace(/\.+$/, "");
    }

    // Replace "000" with "0"
    e.target.value = e.target.value.replace(/^0+(?=\d)/, "");

    // Parse the input value
    const inputValue = parseFloat(e.target.value);

    // Limit the input to the range of 0 to 100
    if (inputValue < 0) {
      e.target.value = "0";
    } else if (inputValue > 100) {
      e.target.value = "100";
    }
  };

  const onKeyDownHandle = (e) => {
    // Prevent input of values greater than 100
    if (e.key === "e" || e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  };

  const onKeyUpHandle = (e) => {
    // Prevent input of values greater than 100
    const inputValue = parseFloat(e.target.value);
    if (inputValue > 100) {
      e.target.value = "100";
    }
  };

  const addProduct = () => {
    let Item = {
      itemId: "",
      quantity: "",
      quoteNum: "",
      uomId: "",
      unitCost: "",
      lineAmount: "",
      currency: "",
    };
    let vendorQuoteLine = values.vendorQuoteLine;
    vendorQuoteLine.push(Item);
    setFieldValue("vendorQuoteLine", vendorQuoteLine);
  };

  const deleteProduct = (index, rec) => {
    let vendorQuoteLine = values.vendorQuoteLine;
    vendorQuoteLine.splice(index, 1);
    setFieldValue("vendorQuoteLine", vendorQuoteLine);

    const total = vendorQuoteLine.reduce((a, b) => a + b.lineAmount, 0);

    // calculate discount amount
    const discount = parseInt(values.discountPercentage) || 0;
    const discountAmount = (total * discount) / 100;

    // calculate total excl tax
    const totalExclTax = total - discountAmount - values.taxAmount || 0;

    // calculate total amount
    const totalAmount = totalExclTax + values.taxAmount || 0;

    setFieldValue("discountAmount", discountAmount);

    setFieldValue("totalExclTax", totalExclTax);

    setFieldValue("totalAmount", totalAmount);
  };

  const onDiscountAmountChangeHandle = (event) => {
    const { value } = event.target;
    const discountAmount = parseFloat(value) || 0.0;
    setFieldValue(`discountAmount`, discountAmount.toFixed(2));
    CalculateValues({
      discountAmount,
    });
  };

  return (
    <div>
      <form
        className="form-horizontal"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmit(true);

          handleSubmit();
          return false;
        }}
      >
        <div
          id="Information"
          name="Information"
          className="intro-y flex items-center mt-8"
        >
          <h2 className="text-lg font-medium mr-auto">
            {edit?.edit
              ? edit?.edit === "true"
                ? "Edit"
                : "Create"
              : "Create"}{" "}
            Quotation
          </h2>
        </div>
        <div className="grid grid-cols-11 gap-x-6 mt-5 pb-20">
          <div className="intro-y col-span-11 2xl:col-span-9">
            <div className="intro-y box p-5 mt-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="FormInput" className="w-4 h-4 mr-2" /> Quote
                  Header
                </div>
                <div className="mt-5">
                  {$h.getRoleId() === Constants.ADMIN_ROLE_ID ? (
                    <div className="flex flex-col sm:flex-row items-center mb-6 col-span-4">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left font-medium">Vendor</div>
                      </div>
                      <div className="form-control col-span-4">
                        <Select
                          className="form-control"
                          placeholder="Vendor ID"
                          styles={{
                            placeholder: (base) => ({
                              ...base,
                              fontSize: "1em",
                              color: "#A5B2C4",
                              fontWeight: 400,
                            }),
                          }}
                          name="vendorId"
                          value={
                            vendorsOptions.find(
                              (obj) => obj.value === values.vendorId
                            ) || ""
                          }
                          onChange={(e) => {
                            setFieldValue("vendorId", e.value);
                            setFieldValue("name", e.name);
                            setFieldValue(
                              "paymentMethod",
                              e.paymentMethod ?? ""
                            );
                            setFieldValue("paymentTerms", e.paymentTerms ?? "");
                            setFieldValue("currency", e.currencyCode ?? "");
                          }}
                          options={vendorsOptions}
                        />
                        {submit && errors.vendorId && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.vendorId}
                          </div>
                        )}
                      </div>
                      <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                        <div className="text-left">
                          <div className="flex items-center"></div>
                        </div>
                      </div>
                      <div className="form-control col-span-4"></div>
                    </div>
                  ) : null}
                  <div className="flex flex-col sm:flex-row items-center mb-6">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Document ID</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
                      <input
                        type="text"
                        className="form-control col-span-4"
                        placeholder="Vendor Document ID"
                        id="vendorDocumentNum"
                        name="vendorDocumentNum"
                        value={values.vendorDocumentNum}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {submit && errors.vendorDocumentNum && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.vendorDocumentNum}
                        </div>
                      )}
                    </div>
                    <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Document Date</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
                      <Litepicker
                        placeholder="Document Date"
                        name=""
                        value={values.documentDate}
                        onChange={(date) => {
                          handleDateChange(date, "documentDate");
                        }}
                        options={{
                          autoApply: false,
                          showWeekNumbers: true,
                          dropdowns: {
                            minYear: 1990,
                            maxYear: new Date().getFullYear() + 10,
                            months: true,
                            years: true,
                          },
                          format: "YYYY-MM-DD",
                        }}
                        className="form-control"
                      />
                      {submit && errors.documentDate && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.documentDate}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center mb-6">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Description</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
                      <input
                        type="text"
                        className="form-control col-span-4 "
                        placeholder="Description"
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={0}
                      />
                      {submit && errors.description && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.description}
                        </div>
                      )}
                    </div>
                    <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Currency</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
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
                        name="currency"
                        value={
                          currencyOptions.find(
                            (obj) => obj.value === values.currency
                          ) || 0
                        }
                        onChange={(e) => {
                          setFieldValue("currency", e.value);
                        }}
                        options={currencyOptions}
                      />
                      {submit && errors.currency && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.currency}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center mb-6">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Payment Terms</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
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
                      />
                      {submit && errors.paymentTerms && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.paymentTerms}
                        </div>
                      )}
                    </div>

                    <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Payment Method</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
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
                      />
                      {submit && errors.paymentMethod && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.paymentMethod}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center mb-6">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Status</div>
                        </div>
                      </div>
                    </div>

                    <div className="form-control col-span-4">
                      <Select
                        className="form-control"
                        placeholder="Status"
                        styles={{
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "1em",
                            color: "#A5B2C4",
                            fontWeight: 400,
                          }),
                        }}
                        name="status"
                        value={
                          statusOptions.find(
                            (obj) => obj.value === values.status
                          ) || ""
                        }
                        onChange={(e) => {
                          setFieldValue("status", e.value);
                        }}
                        options={statusOptions}
                        isDisabled={edit.edit === "true" ? false : true}
                      />
                      {submit && errors.status && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.status}
                        </div>
                      )}
                    </div>

                    <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                      <div className="text-left">
                        <div className="flex items-center">Req Quote ID</div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
                      <Select
                        className="form-control"
                        placeholder="Req Quote ID"
                        styles={{
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "1em",
                            color: "#A5B2C4",
                            fontWeight: 400,
                          }),
                        }}
                        name="reqForQuoteId"
                        value={
                          sourcingOptions.find(
                            (obj) => obj.value === values.reqForQuoteId
                          ) || 0
                        }
                        onChange={(e) => {
                          setFieldValue("reqForQuoteId", e.value);
                        }}
                        options={sourcingOptions}
                      />
                      {submit && errors.reqForQuoteId && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.reqForQuoteId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="lines" name="lines" className="intro-y box p-5 mt-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="FormInput" className="w-4 h-4 mr-2" /> Quote
                  Lines
                </div>
                <div className="mt-5">
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="">
                        <table className="table border">
                          <thead>
                            <tr>
                              <th className="!pr-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 px-2 whitespace-nowrap">
                                Product Name
                              </th>

                              <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                Quantity
                              </th>
                              <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                Unit Of Measure
                              </th>
                              <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                Unit Price
                              </th>
                              <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                Currency
                              </th>
                              <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                Line Amount
                              </th>
                              {values.vendorQuoteLine.length != 1 ? (
                                <th className="!px-2 bg-slate-50 dark:bg-darkmode-800">
                                  Delete
                                </th>
                              ) : null}
                              <th className="!px-2 bg-slate-50 dark:bg-darkmode-800"></th>
                            </tr>
                          </thead>

                          <tbody>
                            {values?.vendorQuoteLine.map((rec, index) => {
                              return (
                                <tr key={index}>
                                  <td className="whitespace-nowrap">
                                    <Select
                                      name={`vendorQuoteLine.${index}.itemId`}
                                      value={
                                        productListOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.vendorQuoteLine[index].itemId
                                        ) || 0
                                      }
                                      className="login__input form-control block min-w-[10rem] my-2"
                                      type="text"
                                      onChange={(e) => {
                                        onSelectChangeHandle(e, index);
                                      }}
                                      options={productListOptions}
                                    />
                                    {submit &&
                                      errors.vendorQuoteLine &&
                                      errors.vendorQuoteLine[index] &&
                                      errors.vendorQuoteLine[index]
                                        .ProductId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {
                                            errors.vendorQuoteLine[index]
                                              .ProductId
                                          }
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <input
                                      min="0"
                                      name={`vendorQuoteLine.${index}.quantity`}
                                      type="number"
                                      value={rec.quantity}
                                      onKeyDown={(e) =>
                                        exceptThisSymbols.includes(e.key) &&
                                        e.preventDefault()
                                      }
                                      className="form-control min-w-[6rem] my-2"
                                      onChange={(e) => {
                                        onQuantityChangeHandle(e, index);
                                      }}
                                    />
                                    {submit &&
                                      errors.vendorQuoteLine &&
                                      errors.vendorQuoteLine[index] &&
                                      errors.vendorQuoteLine[index]
                                        .quantity && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {
                                            errors.vendorQuoteLine[index]
                                              .quantity
                                          }
                                        </div>
                                      )}
                                  </td>

                                  <td className="px-2">
                                    <Select
                                      menuPlacement="auto"
                                      id="category"
                                      className="form-control min-w-[8rem] my-2"
                                      placeholder="UOM"
                                      styles={{
                                        placeholder: (base) => ({
                                          ...base,
                                          fontSize: "1em",
                                          color: "#A5B2C4",
                                          fontWeight: 400,
                                        }),
                                      }}
                                      name={`vendorQuoteLine.${index}.uomId`}
                                      value={
                                        salesUnitOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.vendorQuoteLine[index].uomId
                                        ) || 0
                                      }
                                      onChange={(e) => {
                                        // setFieldValue("SalesUnit", e.value);
                                        setFieldValue(
                                          `vendorQuoteLine.${index}.uomId`,
                                          e.value
                                        );
                                      }}
                                      options={salesUnitOptions}
                                    />
                                    {submit &&
                                      errors.vendorQuoteLine &&
                                      errors.vendorQuoteLine[index] &&
                                      errors.vendorQuoteLine[index].uomId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.vendorQuoteLine[index].uomId}
                                        </div>
                                      )}
                                  </td>

                                  <td className="px-2">
                                    <input
                                      name={`vendorQuoteLine.${index}.unitCost`}
                                      type="text"
                                      value={rec.unitCost}
                                      // onInput={(e) => {
                                      //   // allow only numbers
                                      //   e.target.value = e.target.value.replace(
                                      //     /[^0-9]/g,
                                      //     ""
                                      //   );

                                      //   // allow only 10 numbers
                                      //   if (e.target.value.length > 10) {
                                      //     e.target.value = e.target.value.slice(
                                      //       0,
                                      //       10
                                      //     );
                                      //   }
                                      // }}
                                      className="form-control min-w-[6rem] my-2"
                                      onChange={(e) => {
                                        onUnitCostChangeHandle(e, index);
                                      }}
                                      disabled={
                                        $h.getRoleId() ===
                                        Constants.ADMIN_ROLE_ID
                                          ? true
                                          : false
                                      }
                                    />
                                    {submit &&
                                      errors.vendorQuoteLine &&
                                      errors.vendorQuoteLine[index] &&
                                      errors.vendorQuoteLine[index]
                                        .unitCost && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {
                                            errors.vendorQuoteLine[index]
                                              .unitCost
                                          }
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <Select
                                      menuPlacement="auto"
                                      id="category"
                                      className="form-control min-w-[8rem] my-2"
                                      placeholder="Currency"
                                      styles={{
                                        placeholder: (base) => ({
                                          ...base,
                                          fontSize: "1em",
                                          color: "#A5B2C4",
                                          fontWeight: 400,
                                        }),
                                      }}
                                      name={`vendorQuoteLine.${index}.currency`}
                                      value={
                                        currencyOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.vendorQuoteLine[index]
                                              .currency
                                        ) || 0
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `vendorQuoteLine.${index}.currency`,
                                          e.value
                                        );
                                      }}
                                      options={currencyOptions}
                                    />
                                    {submit &&
                                      errors.vendorQuoteLine &&
                                      errors.vendorQuoteLine[index] &&
                                      errors.vendorQuoteLine[index]
                                        .currency && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {
                                            errors.vendorQuoteLine[index]
                                              .currency
                                          }
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <input
                                      min="0"
                                      name={`vendorQuoteLine.${index}.lineAmount`}
                                      type="number"
                                      value={rec.lineAmount}
                                      onKeyDown={(e) =>
                                        invalidSymbols.includes(e.key) &&
                                        e.preventDefault()
                                      }
                                      className="form-control min-w-[6rem] my-2"
                                      onChange={handleChange}
                                      disabled
                                    />
                                    {submit &&
                                      errors.vendorQuoteLine &&
                                      errors.vendorQuoteLine[index] &&
                                      errors.vendorQuoteLine[index]
                                        .lineAmount && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {
                                            errors.vendorQuoteLine[index]
                                              .lineAmount
                                          }
                                        </div>
                                      )}
                                  </td>

                                  <td className="!pl-4 text-slate-500">
                                    {values.vendorQuoteLine.length != 1 ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteProduct(index, rec);
                                        }}
                                      >
                                        <Lucide
                                          icon="Trash2"
                                          className="w-4 h-4"
                                        />
                                      </button>
                                    ) : null}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary border-dashed w-full mt-4"
                        onClick={() => addProduct()}
                      >
                        <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New
                        Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="intro-y box p-5 mt-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="FormInput" className="w-4 h-4 mr-2" /> Line
                  Details
                </div>
                <div className="mt-5">
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="sm:grid grid-cols-5 gap-2">
                        <div className="mt-2 sm:mt-0">
                          <label
                            htmlFor="discountPercentage"
                            className="form-label mb-1"
                          >
                            Discount % (0-100)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="discountPercentage"
                            name="discountPercentage"
                            value={values.discountPercentage}
                            onChange={onDiscountPercentageChangeHandle}
                            onBlur={handleBlur}
                            onInput={onInputHandle}
                            onKeyDown={onKeyDownHandle}
                            onKeyUp={onKeyUpHandle}
                          />
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <label
                            htmlFor="discountAmount"
                            className="form-label mb-1"
                          >
                            Discount Amount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="discountAmount"
                            name="discountAmount"
                            value={values.discountAmount}
                            onChange={onDiscountAmountChangeHandle}
                            onBlur={handleBlur}
                            min={0}
                          />
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <label
                            htmlFor="taxAmount"
                            className="form-label sm:w-20 mb-2"
                          >
                            Tax Amount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="taxAmount"
                            name="taxAmount"
                            value={values.taxAmount}
                            onChange={onTaxAmountChangeHandle}
                            onBlur={handleBlur}
                            min={0}
                          />
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <label
                            htmlFor="totalExclTax"
                            className="form-label mb-1"
                          >
                            Total (Exc. Tax)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="totalExclTax"
                            name="totalExclTax"
                            value={values.totalExclTax}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min={0}
                            disabled
                          />
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <label htmlFor="totalAmount" className="form-label">
                            Total Amount
                          </label>
                          <input
                            type="number"
                            className="form-control col-span-4"
                            id="totalAmount"
                            name="totalAmount"
                            value={values.totalAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min={0}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end flex-col md:flex-row gap-2 mt-5">
              <button
                type="button"
                className="btn py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 w-full md:w-52"
                disabled={loadingForAdd}
                onClick={() => {
                  resetForm();

                  setSubmit(false);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn py-3 btn-primary w-full md:w-52"
                disabled={loadingForAdd}
              >
                {loadingForAdd ? (
                  <div className="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center mr-2">
                    <LoadingIcon icon="oval" className="w-4 h-4" />
                  </div>
                ) : null}
                {edit?.edit
                  ? edit?.edit === "true"
                    ? "Update"
                    : "Save"
                  : "Save"}
              </button>
            </div>
          </div>
          <div className="intro-y col-span-2 hidden 2xl:block">
            <div className="pt-10 sticky top-0">
              <ul className="text-slate-500 relative before:content-[''] before:w-[2px] before:bg-slate-200 before:dark:bg-darkmode-600 before:h-full before:absolute before:left-0 before:z-[-1]">
                <li
                  className={classnames("cursor-pointer mb-4 border-l-2 pl-5", {
                    "border-primary dark:border-primary text-primary font-medium":
                      tab === 1,
                    "border-transparent dark:border-transparent": tab !== 1,
                  })}
                  onClick={() => {
                    setTab(1);
                    scrollToTop();
                  }}
                >
                  Quote Header
                </li>
                <li
                  className={classnames("cursor-pointer mb-4 border-l-2 pl-5", {
                    "border-primary dark:border-primary text-primary font-medium":
                      tab === 2,
                    "border-transparent dark:border-transparent": tab !== 2,
                  })}
                  onClick={() => {
                    setTab(2);
                    scrollTo("lines");
                  }}
                >
                  Quote Lines
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
      <Modal
        backdrop="static"
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
            <div className="text-center">
              <Lucide
                icon="XCircle"
                className="w-16 h-16 text-danger mx-auto mt-3"
              />
              <div className="text-2xl mt-5">
                Select the reason for canceling
              </div>
              <div className="mt-2">
                <Select
                  className="form-control"
                  placeholder="Reason"
                  styles={{
                    placeholder: (base) => ({
                      ...base,
                      fontSize: "1em",
                      color: "#A5B2C4",
                      fontWeight: 400,
                    }),
                  }}
                  name="reasoning"
                  value={
                    reasoningListOptions.find(
                      (obj) => obj.value === selectedReason?.value || 0
                    ) || 0
                  }
                  onChange={(e) => {
                    setSelectedReason(e);
                  }}
                  options={reasoningListOptions}
                />
              </div>
              {selectedReason?.label === "other" && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Please specify the reason"
                    value={reasonText}
                    onChange={(e) => {
                      setReasonText(e.target.value);
                    }}
                  />
                </div>
              )}
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
              className="btn btn-outline-secondary w-24 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary w-24"
              onClick={() => {
                handleReasonSelection();
              }}
              // disabled={
              //   selectedReason === 0 ||
              //   selectedReason === "" ||
              //   selectedReason === null
              // }
            >
              Proceed
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Main;
