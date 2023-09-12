import * as Yup from "yup";

import { helper as $h, keyValue as kv } from "@/utils";
import { Litepicker, Lucide } from "@/base-components";
import {
  getCurrencyCode as onGetCurrencyCode,
  getPaymentMethod as onGetPaymentMethod,
  getPaymentTerm as onGetPaymentTerm,
  getProductList as onGetProductList,
  getSalesUnit as onGetSalesUnit,
  getSites as onGetSites,
  getSpecificInvoice as onGetSpecificInvoice,
  getSpecificPurchaseOrder as onGetSpecificPurchaseOrder,
  getVendorList as onGetVendor,
  getWarehouse as onGetWarehouse,
  postInvoice as onPostInvoice,
  resetInvoiceStatus as onResetInvoiceStatus,
  updateInvoice as onUpdateInvoice,
} from "@/store/actions";
import { animateScroll as scroll, scroller } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Constants from "../../constants/Constants";
import { LoadingIcon } from "@/base-components";
import Select from "react-select";
import classnames from "classnames";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submit, setSubmit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [tab, setTab] = useState(1);
  const [productListOptions, setProductListOptions] = useState([]);
  const [salesUnitOptions, setSalesUnitOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [paymentTermsOptions, setPaymentTermsOptions] = useState([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [vendorsOptions, setVendorsOptions] = useState([]);
  const [sitesOptions, setSitesOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const params = "?perPage=1000&page=1";
    dispatch(onGetProductList(params));
    dispatch(onGetCurrencyCode(params));
    dispatch(onGetSalesUnit(params));
    dispatch(onGetPaymentTerm(params));
    dispatch(onGetPaymentMethod(params));
    dispatch(onGetVendor(params));
    dispatch(onGetSites(params));
    dispatch(onGetWarehouse(params));
  }, [dispatch]);

  // Extract data from reducers
  const { productList } = useSelector((state) => state.ProductListReducer);
  const { salesUnit } = useSelector((state) => state.SalesUnitReducer);
  const { currencyCode } = useSelector((state) => state.CurrencyCodeReducer);
  const { PaymentTerm } = useSelector((state) => state.PaymentTermReducer);
  const { PaymentMethod } = useSelector((state) => state.PaymentMethodReducer);
  const { vendors } = useSelector((state) => state.VendorReducer);
  const { Sites } = useSelector((state) => state.SitesReducer);
  const { Warehouse } = useSelector((state) => state.WarehouseReducer);

  const { purchaseOrder } = useSelector((state) => state.PurchaseOrderReducer);

  const { added, updated, loadingForAdd, invoice } = useSelector(
    (state) => state.InvoiceReducer
  );
  // Transform and set options ,purchaseOrder
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

  useEffect(() => {
    if (vendors?.docs) {
      const vendorsOptions = vendors.docs.map(({ id, name, companyName }) => ({
        value: id,
        label: id + " - " + companyName,
        name: name ?? "",
      }));
      setVendorsOptions(vendorsOptions);
    }
  }, [vendors]);

  useEffect(() => {
    if (added || updated) {
      setSubmit(false);
      resetForm();
      dispatch(onResetInvoiceStatus());
      navigate("/invoice");
    }
  }, [added, updated]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const mode = urlParams.get("mode");

    if (id) {
      setEdit({ edit: mode === "update" ? "true" : "false", id: id });
      if (mode === "create") {
        handleCreateMode(id, purchaseOrder);
      } else if (mode === "update") {
        handleUpdateMode(id, invoice);
      }
    }
  }, [purchaseOrder, invoice]);

  function handleCreateMode(id, purchaseOrder) {
    if ($h.isNullObject(purchaseOrder) || purchaseOrder.id !== parseInt(id)) {
      let param = `/${id}`;
      dispatch(onGetSpecificPurchaseOrder(param));
    } else {
      mapValues(purchaseOrder);
    }
  }

  function handleUpdateMode(id, invoice) {
    if ($h.isNullObject(invoice) || invoice.id !== parseInt(id)) {
      let param = `/${id}`;
      dispatch(onGetSpecificInvoice(param));
    } else {
      mapValuesFromInvoice(invoice);
    }
  }

  function mapValues(input) {
    const result = getInitialResult();
    if (input) {
      result.purchaseOrderId = input.id;
      result.taxAmount = input.taxAmount ? parseFloat(input.taxAmount) : "";
      result.discountPercentage = input.discountPercentage
        ? parseFloat(input.discountPercentage)
        : "";
      result.totalAmount = input.totalAmount
        ? parseFloat(input.totalAmount)
        : "";
      result.currencyId = input.currencyId;
      result.paymentTermId = input.paymentTermId;
      result.paymentMethodId = input.paymentMethodId;
      result.siteId = input.siteId;
      result.warehouseId = input.warehouseId;

      console.log("input", input.purchaseOrderLine);

      if (input.purchaseOrderLine && input.purchaseOrderLine.length > 0) {
        result.invoiceLine = input.purchaseOrderLine.map((line) =>
          mapLine(line)
        );
      }
    }

    setValues(result);
  }

  function mapValuesFromInvoice(input) {
    const result = getInitialResult();

    if (input) {
      Object.keys(result).forEach((key) => {
        result[key] = input[key] ? input[key] : result[key];
      });
    }

    console.log("result", input);
    // change to number
    result.taxRate = parseFloat(result.taxRate);
    result.taxAmount = parseFloat(result.taxAmount);
    result.discountPercentage = parseFloat(result.discountPercentage);
    result.totalAmount = parseFloat(result.totalAmount);

    result.warehouseId = input.warehouseId || "";
    result.siteId = input.siteId || "";

    if (input.invoiceLine && input.invoiceLine.length > 0) {
      result.invoiceLine = input.invoiceLine.map((line) => {
        return {
          ...line,
          itemName: line.item?.name ?? "",
        };
      });
    }

    setValues(result);
  }

  function getInitialResult() {
    return {
      dueDate: "",
      purchaseOrderId: "",
      taxType: "",
      taxRate: "",
      taxAmount: "",
      discountPercentage: "",
      totalAmount: "",
      shippingAddress: "",
      siteId: "",
      warehouseId: "",
      paymentInstruction: "",
      currencyId: "",
      paymentTermId: "",
      paymentMethodId: "",
      paymentStatus: edit.edit === "true" ? "" : "unpaid",
      comment: "",
      saveAsDraft: false,
      invoiceLine: [],
    };
  }

  function mapLine(line) {
    return {
      purchaseOrderLineId: line.id,
      itemId: line.itemId || "",
      itemName: line.item?.name ?? "",
      quantity: line.quantity || "",
      unitCost: line.unitCost || "",
      lineAmount: line.lineAmount || "",
      uomId: line.unitId || "",
      currencyId: line.currencyId || "",
    };
  }

  useEffect(() => {
    if (Sites?.docs) {
      const sitesOptions = Sites.docs.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setSitesOptions(sitesOptions);
    }
  }, [Sites]);

  useEffect(() => {
    if (Warehouse?.docs) {
      const warehouseOptions = Warehouse.docs.map(({ id, name, site }) => ({
        value: id,
        label: name,
        site: site,
      }));
      setWarehouseOptions(warehouseOptions);
    }
  }, [Warehouse]);

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

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      dueDate: "",
      purchaseOrderId: "",
      taxType: "",
      taxRate: "",
      taxAmount: "",
      discountPercentage: "",
      totalAmount: "",
      shippingAddress: "",
      siteId: "",
      warehouseId: "",
      paymentInstruction: "",
      currencyId: "",
      paymentTermId: "",
      paymentMethodId: "",
      paymentStatus: edit.edit === "true" ? "" : "unpaid",
      comment: "",
      saveAsDraft: "",
      invoiceLine: [
        {
          itemName: "",
          itemId: "",
          quantity: "",
          unitCost: "",
          lineAmount: "",
          uomId: "",
          currencyId: "",
        },
      ],
    },

    validationSchema: Yup.object().shape({
      dueDate: Yup.string().required("Required"),
      purchaseOrderId: Yup.string().required("Required"),
      taxAmount: Yup.string().required("Required"),
      discountPercentage: Yup.string().required("Required"),
      totalAmount: Yup.string().required("Required"),
      // shippingAddress: Yup.string().required("Required"),
      siteId: Yup.string().required("Required"),
      warehouseId: Yup.string().required("Required"),
      paymentInstruction: Yup.string().required("Required"),
      currencyId: Yup.string().required("Required"),
      paymentTermId: Yup.string().required("Required"),
      paymentMethodId: Yup.string().required("Required"),
      paymentStatus: Yup.string().required("Required"),
      comment: Yup.string().required("Required"),
      saveAsDraft: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (edit.edit === "true") {
        // deep copy
        let deepCopy = JSON.parse(JSON.stringify(values));
        // remove itemName
        deepCopy.invoiceLine.forEach((line) => {
          delete line.itemName;
        });

        dispatch(
          onUpdateInvoice({
            code: edit.id,
            body: deepCopy,
          })
        );
      } else {
        dispatch(onPostInvoice(values));
      }
    },
  });

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const handleDateChange = (date, field) => {
    // if date is string, convert it to date object
    if (typeof date === "string") {
      setFieldValue(field, date);
    } else {
    }
  };

  const onSelectChangeHandle = (rec, index) => {
    const quantity = parseFloat(values.invoiceLine[index].quantity) || 0.0;
    const unitCost = parseFloat(rec.unitCost) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(`invoiceLine.${index}.lineAmount`, lineAmount.toFixed(2));
    setFieldValue(`invoiceLine.${index}.unitCost`, unitCost.toFixed(2));
    setFieldValue(`invoiceLine.${index}.itemId`, rec.value);
    setFieldValue(`invoiceLine.${index}.uomId`, rec.uomId);
    CalculateValues({ lineAmount, index });
  };

  const onQuantityChangeHandle = (event, index) => {
    const { value } = event.target;
    const quantity = parseFloat(value) || 0.0;
    const unitCost = parseFloat(values.invoiceLine[index].unitCost) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(`invoiceLine.${index}.lineAmount`, lineAmount.toFixed(2));
    setFieldValue(`invoiceLine.${index}.quantity`, quantity);
    CalculateValues({ lineAmount, index });
  };

  const onUnitCostChangeHandle = (event, index) => {
    const { value } = event.target;
    const unitCost = parseFloat(value) || 0.0;
    const quantity = parseFloat(values.invoiceLine[index].quantity) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(`invoiceLine.${index}.unitCost`, unitCost.toFixed(2));
    setFieldValue(`invoiceLine.${index}.lineAmount`, lineAmount.toFixed(2));
    CalculateValues(lineAmount, index);
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
            Invoice
          </h2>
        </div>
        <div className="grid grid-cols-11 gap-x-6 mt-5 pb-20">
          <div className="intro-y col-span-11 2xl:col-span-9">
            <div className="intro-y box p-5 mt-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="FormInput" className="w-4 h-4 mr-2" /> Header
                </div>
                <div className="mt-5">
                  <div className="mt-5">
                    <div className="flex flex-col sm:flex-row items-center mb-6 col-span-4">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left font-medium">PO ID</div>
                      </div>
                      <div className="form-control col-span-4">
                        <input
                          type="text"
                          id="purchaseOrderId"
                          className="form-control col-span-4"
                          name="purchaseOrderId"
                          value={values.purchaseOrderId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        {submit && errors.vendorId && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.vendorId}
                          </div>
                        )}
                      </div>
                      <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Due Date</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <Litepicker
                          placeholder="Due Date"
                          name=""
                          value={values.dueDate}
                          onChange={(date) => {
                            handleDateChange(date, "dueDate");
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
                          }}
                          className="form-control"
                        />
                        {submit && errors.dueDate && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.dueDate}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-6">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Tax Type</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <input
                          type="text"
                          className="form-control col-span-4"
                          placeholder="Tax Type"
                          id="taxType"
                          name="taxType"
                          value={values.taxType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {submit && errors.taxType && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.taxType}
                          </div>
                        )}
                      </div>
                      <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Tax Rate</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <input
                          type="number"
                          className="form-control col-span-4"
                          placeholder="Tax Rate"
                          id="taxRate"
                          name="taxRate"
                          value={values.taxRate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min="0"
                        />
                        {submit && errors.taxRate && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.taxRate}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center mb-6">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Tax Amount</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <input
                          type="number"
                          className="form-control col-span-4"
                          placeholder="Tax Amount"
                          id="taxAmount"
                          name="taxAmount"
                          value={values.taxAmount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min="0"
                        />
                        {submit && errors.taxAmount && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.taxAmount}
                          </div>
                        )}
                      </div>
                      <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Discount Percent.</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <input
                          type="number"
                          className="form-control col-span-4"
                          placeholder="Discount Percentage"
                          id="discountPercentage"
                          name="discountPercentage"
                          value={values.discountPercentage}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min="0"
                        />
                        {submit && errors.discountPercentage && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.discountPercentage}
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
                          name="paymentTermId"
                          value={
                            paymentTermsOptions.find(
                              (obj) => obj.value === values.paymentTermId
                            ) || 0
                          }
                          onChange={(e) => {
                            setFieldValue("paymentTermId", e.value);
                          }}
                          options={paymentTermsOptions}
                        />
                        {submit && errors.paymentTermId && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.paymentTermId}
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
                          name="paymentMethodId"
                          value={
                            paymentMethodOptions.find(
                              (obj) => obj.value === values.paymentMethodId
                            ) || 0
                          }
                          onChange={(e) => {
                            setFieldValue("paymentMethodId", e.value);
                          }}
                          options={paymentMethodOptions}
                        />
                        {submit && errors.paymentMethodId && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.paymentMethodId}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-6">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Total Amount</div>
                          </div>
                        </div>
                      </div>

                      <div className="form-control col-span-4">
                        <input
                          type="number"
                          className="form-control col-span-4 "
                          placeholder="Total Amount"
                          id="totalAmount"
                          name="totalAmount"
                          value={values.totalAmount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min="0"
                        />
                        {submit && errors.totalAmount && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.totalAmount}
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
                          name="currencyId"
                          value={
                            currencyOptions.find(
                              (obj) => obj.value === values.currencyId
                            ) || 0
                          }
                          onChange={(e) => {
                            setFieldValue("currencyId", e.value);
                          }}
                          options={currencyOptions}
                        />
                        {submit && errors.currencyId && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.currencyId}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-6">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">
                              Payment Instruction
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <input
                          type="text"
                          className="form-control col-span-4"
                          placeholder="Payment Instruction"
                          id="paymentInstruction"
                          name="paymentInstruction"
                          value={values.paymentInstruction}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {submit && errors.paymentInstruction && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.paymentInstruction}
                          </div>
                        )}
                      </div>
                      <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Payment Status</div>
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
                          name="paymentStatus"
                          value={
                            kv.paymentStatusOptions.find(
                              (obj) => obj.value === values.paymentStatus
                            ) || ""
                          }
                          onChange={(e) => {
                            setFieldValue("paymentStatus", e.value);
                          }}
                          options={kv.paymentStatusOptions}
                          isDisabled={edit.edit === "true" ? false : true}
                        />
                        {submit && errors.paymentStatus && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.paymentStatus}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mb-6">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Sites</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <Select
                          className="form-control"
                          placeholder="Sites"
                          styles={{
                            placeholder: (base) => ({
                              ...base,
                              fontSize: "1em",
                              color: "#A5B2C4",
                              fontWeight: 400,
                            }),
                          }}
                          name="siteId"
                          value={
                            sitesOptions.find(
                              (obj) => obj.value === values.siteId
                            ) || 0
                          }
                          onChange={(e) => {
                            setFieldValue("siteId", e.value);
                            let filtered = Warehouse.docs.filter(
                              (warehouse) => warehouse.site === e.value
                            );
                            setWarehouseOptions(
                              filtered.map((warehouse) => ({
                                label: warehouse.name,
                                value: warehouse.id,
                              }))
                            );
                          }}
                          options={sitesOptions}
                        />
                        {submit && errors.siteId && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.siteId}
                          </div>
                        )}
                      </div>
                      <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                        <div className="text-left">
                          <div className="flex items-center">Warehouse</div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <Select
                          className="form-control"
                          placeholder="Warehouse"
                          styles={{
                            placeholder: (base) => ({
                              ...base,
                              fontSize: "1em",
                              color: "#A5B2C4",
                              fontWeight: 400,
                            }),
                          }}
                          name="warehouseId"
                          value={
                            warehouseOptions.find(
                              (obj) => obj.value === values.warehouseId
                            ) || { label: "", value: 0 }
                          }
                          onChange={(e) => {
                            setFieldValue("warehouseId", e.value);
                          }}
                          isDisabled={
                            values.siteId === 0 || values.siteId === ""
                          }
                          options={warehouseOptions}
                        />
                        {submit && errors.warehouseId && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.warehouseId}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center mb-6">
                      <div className="form-label xl:w-64 xl:!mr-10">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Comment</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4">
                        <input
                          type="text"
                          className="form-control col-span-4 "
                          placeholder="Comment"
                          id="comment"
                          name="comment"
                          value={values.comment}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {submit && errors.comment && (
                          <div className="text-red-600 text-xs mt-1">
                            {errors.comment}
                          </div>
                        )}
                      </div>
                      <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium"></div>
                          </div>
                        </div>
                      </div>
                      <div className="form-control col-span-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="lines" name="lines" className="intro-y box p-5 mt-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="FormInput" className="w-4 h-4 mr-2" />
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
                              <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                Line Amount
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {values.invoiceLine.map((rec, index) => {
                              return (
                                <tr key={index}>
                                  <td className="whitespace-nowrap">
                                    <input
                                      type="text"
                                      disabled
                                      name={`invoiceLine.${index}.itemName`}
                                      value={rec.itemName}
                                      className="form-control min-w-[6rem] my-2"
                                    />
                                  </td>

                                  <td className="px-2">
                                    <input
                                      min="0"
                                      disabled
                                      name={`invoiceLine.${index}.quantity`}
                                      type="number"
                                      value={rec.quantity}
                                      onKeyDown={(e) =>
                                        exceptThisSymbols.includes(e.key) &&
                                        e.preventDefault()
                                      }
                                      className="form-control min-w-[6rem] my-2"
                                      // onChange={(e) => {
                                      //   setFieldValue(
                                      //     `invoiceLine.${index}.quantity`,
                                      //     e.target.value
                                      //   );
                                      // }}
                                      //   // setFieldValue(

                                      onChange={(e) => {
                                        onQuantityChangeHandle(e, index);
                                      }}
                                    />
                                    {submit &&
                                      errors.invoiceLine &&
                                      errors.invoiceLine[index] &&
                                      errors.invoiceLine[index].quantity && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.invoiceLine[index].quantity}
                                        </div>
                                      )}
                                  </td>

                                  <td className="px-2">
                                    <Select
                                      menuPlacement="auto"
                                      id="category"
                                      isDisabled
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
                                      name={`invoiceLine.${index}.uomId`}
                                      value={
                                        salesUnitOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.invoiceLine[index].uomId
                                        ) || 0
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `invoiceLine.${index}.uomId`,
                                          e.value
                                        );
                                      }}
                                      options={salesUnitOptions}
                                    />
                                    {submit &&
                                      errors.invoiceLine &&
                                      errors.invoiceLine[index] &&
                                      errors.invoiceLine[index].uomId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.invoiceLine[index].uomId}
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <input
                                      name={`invoiceLine.${index}.unitCost`}
                                      type="number"
                                      disabled
                                      value={rec.unitCost}
                                      className="form-control min-w-[6rem] my-2"
                                      onChange={(e) => {
                                        onUnitCostChangeHandle(e, index);
                                      }}
                                    />
                                    {submit &&
                                      errors.invoiceLine &&
                                      errors.invoiceLine[index] &&
                                      errors.invoiceLine[index].unitCost && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.invoiceLine[index].unitCost}
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <Select
                                      menuPlacement="auto"
                                      id="category"
                                      isDisabled
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
                                      name={`invoiceLine.${index}.currencyId`}
                                      value={
                                        currencyOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.invoiceLine[index].currencyId
                                        ) || 0
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `invoiceLine.${index}.currencyId`,
                                          e.value
                                        );
                                      }}
                                      options={currencyOptions}
                                    />
                                    {submit &&
                                      errors.invoiceLine &&
                                      errors.invoiceLine[index] &&
                                      errors.invoiceLine[index].currencyId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.invoiceLine[index].currencyId}
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="lineAmount"
                                      name={`invoiceLine.${index}.lineAmount`}
                                      value={rec.lineAmount}
                                      disabled
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
                  Header
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
                  Lines
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Main;
