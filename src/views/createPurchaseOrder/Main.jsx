import * as Yup from "yup";

import {
  Litepicker,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  Tippy,
} from "@/base-components";
import {
  getCurrencyCode as onGetCurrencyCode,
  getPaymentMethod as onGetPaymentMethod,
  getPaymentTerm as onGetPaymentTerm,
  getProductList as onGetProductList,
  getQuotation as onGetQuotation,
  getReasoningList as onGetReasoningList,
  getSalesUnit as onGetSalesUnit,
  getSites as onGetSites,
  getSpecificPurchaseOrder as onGetSpecificPurchaseOrder,
  getVendorList as onGetVendor,
  getWarehouse as onGetWarehouse,
  postPurchaseOrder as onPostPurchaseOrder,
  resetPurchaseOrderStatus as onResetPurchaseOrderStatus,
  updatePurchaseOrder as onUpdatePurchaseOrder,
} from "@/store/actions";
import { animateScroll as scroll, scroller } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { helper as $h } from "@/utils";
import Constants from "../../constants/Constants";
import { LoadingIcon } from "@/base-components";
import Select from "react-select";
import classnames from "classnames";
import moment from "moment";
import { updateReasoningCall } from "../../helpers/backend_helper";
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
  const [reasoningListOptions, setReasoningList] = useState([]);
  const [lineWarehouseOptions, setLineWarehouseOptions] = useState([]);
  const [quotationOptions, setQuotationOptions] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [reasonText, setReasonText] = useState("");

  const [deleteModalPreview, setDeleteModalPreview] = useState({
    show: false,
    data: null,
  });

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "received", label: "Received" },
    { value: "invoiced", label: "Invoiced" },
    { value: "cancelled", label: "Cancelled" },
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
    dispatch(onGetSites(params));
    dispatch(onGetWarehouse(params));
    dispatch(onGetReasoningList(params));
    dispatch(onGetQuotation(params));
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
  const { reasoningList } = useSelector((state) => state.QuotationReducer);
  const { quotations } = useSelector((state) => state.QuotationReducer);

  const { added, updated, loadingForAdd, purchaseOrder } = useSelector(
    (state) => state.PurchaseOrderReducer
  );
  // Transform and set options ,purchaseOrder
  useEffect(() => {
    if (productList?.docs) {
      const productListOptions = productList.docs.map(
        ({ id, name, uomId, unitPrice }) => ({
          value: id,
          label: name,
          unitId: uomId,
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
    if (quotations?.docs) {
      const quotationOptions = quotations.docs.map(({ id }) => ({
        value: id,
        label: id,
      }));
      setQuotationOptions(quotationOptions);
    }
  }, [quotations]);

  useEffect(() => {
    if (added || updated) {
      setSubmit(false);
      resetForm();
      dispatch(onResetPurchaseOrderStatus());
      if (updated) {
        navigate("/purchaseOrder");
      }
    }
  }, [added, updated]);

  function mapPurchaseOrderToInitialValues(purchaseOrder) {
    return {
      vendorId: purchaseOrder.vendorId ?? "",
      name: purchaseOrder.name ?? "",
      description: purchaseOrder.description ?? "",
      vendorDocumentNum: purchaseOrder.vendorDocumentNum ?? "",
      taxAmount: purchaseOrder.taxAmount ?? "",
      discountAmount: purchaseOrder.discountAmount ?? "",
      discountPercentage: purchaseOrder.discountPercentage ?? "",
      totalExclTax: purchaseOrder.totalExclTax ?? "",
      totalAmount: purchaseOrder.totalAmount ?? "",
      status: purchaseOrder.status ?? "",
      orderDate: purchaseOrder.orderDate ?? "",
      quoteNum: purchaseOrder.quoteNum ?? "",
      paymentTermId: purchaseOrder.paymentTermId ?? "",
      vendorQuoteId: purchaseOrder.vendorQuoteId ?? null,
      paymentMethodId: purchaseOrder.paymentMethodId ?? "",
      currencyId: purchaseOrder.currencyId ?? "",
      purchaseOrderLine:
        purchaseOrder.purchaseOrderLine?.map((line) => ({
          lineAmount: line.lineAmount ?? "",
          id: line.id ?? "",
          itemId: line.itemId ?? "",
          quantity: line.quantity ?? "",
          siteId: line.siteId ?? "",
          warehouseId: line.warehouseId ?? "",
          // quantityReceived: line.quantityReceived ?? "",
          // quantityInvoiced: line.quantityInvoiced ?? "",
          unitId: line.unitId ?? "",
          unitCost: line.unitCost ?? "",
          currencyId: line.currencyId ?? "",
          purchaseOrderNum: line.purchaseOrderNum ?? "",
          deletedAt: line.deletedAt ?? null,
          createdAt: line.createdAt ?? "",
          updatedAt: line.updatedAt ?? "",
          item: {
            name: line.item?.name ?? "",
            description: line.item?.description ?? null,
            imageUrl: line.item?.imageUrl ?? [],
            unitPrice: line.item?.unitPrice ?? "",
          },
          currency: {
            name: line.currency?.name ?? "",
            currencyCode: line.currency?.currencyCode ?? "",
          },
          unit: {
            name: line.unit?.name ?? "",
            description: line.unit?.description ?? "",
          },
        })) ?? [],
    };
  }

  // Usage
  // const initialValues = mapPurchaseOrderToInitialValues(purchaseOrder);
  // setValues(initialValues);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const edit = urlParams.get("edit");
    setEdit({
      edit: edit,
      id: id,
    });
    if (edit === "true" && id) {
      if ($h.isNullObject(purchaseOrder)) {
        let param = `/${id}`;
        dispatch(onGetSpecificPurchaseOrder(param));

        // parse into purchaseOrder object
      } else if (purchaseOrder.id !== parseInt(id)) {
        let param = `/${id}`;
        dispatch(onGetSpecificPurchaseOrder(param));
      } else {
        // populate warehouseOptions with siteId from purchaseOrder
        if (purchaseOrder?.siteId && Warehouse?.docs) {
          const warehouseOptions = Warehouse.docs
            .filter((warehouse) => warehouse.site === purchaseOrder.siteId)
            .map(({ id, name, site }) => ({
              value: id,
              label: name,
              site: site,
            }));
          setWarehouseOptions(warehouseOptions);
        }
        const initialValues = mapPurchaseOrderToInitialValues(purchaseOrder);
        setValues(initialValues);
      }
    } else {
      const date = moment().format("YYYY-MM-DD");
      setFieldValue("orderDate", date);
    }
  }, [purchaseOrder]);

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
      if (
        edit.edit === "true" &&
        purchaseOrder?.purchaseOrderLine?.length > 0
      ) {
        const newpurchaseOrderLineWarehouseOptions =
          purchaseOrder?.purchaseOrderLine?.map(({ siteId }) => {
            // Find the warehouses for the site
            let warehouses = Warehouse.docs.filter(
              (warehouse) => warehouse.site === siteId
            );
            return warehouses.map((warehouse) => ({
              label: warehouse.name,
              value: warehouse.id,
            }));
          });

        setLineWarehouseOptions(newpurchaseOrderLineWarehouseOptions);
      }

      const warehouseOptions = Warehouse.docs.map(({ id, name, site }) => ({
        value: id,
        label: name,
        site: site,
      }));
      setWarehouseOptions(warehouseOptions);
    }
  }, [edit, purchaseOrder, Warehouse]);

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
          module: "/purchaseOrderHeader",
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
        onUpdatePurchaseOrder({
          params: edit.id,
          data: rest,
        })
      );
    } else {
      dispatch(
        onUpdatePurchaseOrder({
          params: edit.id,
          data: deleteModalPreview.data,
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
  } = useFormik({
    initialValues: {
      vendorId: "",
      name: "",
      vendorDocumentNum: "",
      orderDate: "",
      description: "",
      status: edit.edit === "true" ? "" : "open",
      taxAmount: "0",
      discountAmount: "",
      discountPercentage: "0",
      totalExclTax: "",
      totalAmount: "",
      paymentTermId: "",
      paymentMethodId: "",
      currencyId: "",
      vendorQuoteId: "",
      // siteId: "",
      // warehouseId: "",
      purchaseOrderLine: [
        {
          itemId: "",
          quantity: "",
          // quantityReceived: "",
          unitId: "",
          unitCost: "",
          // quantityInvoiced: "",
          currencyId: "",
          lineAmount: "",
        },
      ],
    },
    validationSchema: Yup.object().shape({
      vendorId:
        $h.getRoleId() === Constants.ADMIN_ROLE_ID
          ? Yup.string().required("Required")
          : null,

      vendorDocumentNum: Yup.string().required("Required"),
      orderDate: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      vendorQuoteId: Yup.string()
        .max(10, "Must be shorter or equal to 10 characters")
        .required("Required"),
      paymentTermId: Yup.string().required("Required"),
      paymentMethodId: Yup.string().required("Required"),
      currencyId: Yup.string().required("Required"),
      // siteId: Yup.string().required("Required"),
      // warehouseId: Yup.string().required("Required"),
      purchaseOrderLine: Yup.array().of(
        Yup.object().shape({
          itemId: Yup.string().required("Required"),
          quantity: Yup.string().required("Required"),
          // quantityReceived: Yup.string().required("Required"),
          unitId: Yup.string().required("Required"),
          siteId: Yup.string().required("Required"),
          warehouseId: Yup.string().required("Required"),

          unitCost: Yup.string().required("Required"),
          // quantityInvoiced: Yup.string().required("Required"),
          currencyId: Yup.string().required("Required"),
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

        valuesObj.purchaseOrderLine = valuesObj.purchaseOrderLine.map(
          (item) => ({
            ...item,
            purchaseOrderNum: purchaseOrder.id,
          })
        );

        const { name, vendorId, ...rest } = valuesObj;

        // if status is cancelled, show modal
        if (valuesObj.status === "cancelled") {
          setDeleteModalPreview({
            show: true,
            data: valuesObj,
          });
        } else {
          if ($h.getRoleId() !== Constants.ADMIN_ROLE_ID) {
            const { name, vendorId, ...rest } = valuesObj;

            dispatch(
              onUpdatePurchaseOrder({
                params: edit.id,
                data: rest,
              })
            );
          } else {
            dispatch(
              onUpdatePurchaseOrder({
                params: edit.id,
                data: valuesObj,
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

          dispatch(onPostPurchaseOrder(rest));
        } else {
          dispatch(onPostPurchaseOrder(valuesObj));
        }
      }
    },
  });

  function CalculateValues({
    lineAmount,
    index,
    discountPercentage,
    taxAmount,
    discountAmount,
  }) {
    const total = values.purchaseOrderLine.reduce((acc, item, i) => {
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

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const invalidSymbols = ["e", "E", "+", "-"]; // invalid symbols for input type number : Unit Cost

  const handleDateChange = (date, field) => {
    // if date is string, convert it to date object
    if (typeof date === "string") {
      setFieldValue(field, date);
    } else {
    }
  };

  const onSelectChangeHandle = (rec, index) => {
    const quantity =
      parseFloat(values.purchaseOrderLine[index].quantity) || 0.0;
    const unitCost = parseFloat(rec.unitCost) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(
      `purchaseOrderLine.${index}.lineAmount`,
      lineAmount.toFixed(2)
    );
    setFieldValue(`purchaseOrderLine.${index}.unitCost`, unitCost.toFixed(2));
    setFieldValue(`purchaseOrderLine.${index}.itemId`, rec.value);
    setFieldValue(`purchaseOrderLine.${index}.unitId`, rec.unitId);

    // set currency of header to currency of selected product
    const currency = values.currencyId;
    setFieldValue(`purchaseOrderLine.${index}.currencyId`, currency);

    CalculateValues({ lineAmount, index });
  };

  const onQuantityChangeHandle = (event, index) => {
    const { value } = event.target;
    const quantity = parseFloat(value) || 0.0;
    const unitCost =
      parseFloat(values.purchaseOrderLine[index].unitCost) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(
      `purchaseOrderLine.${index}.lineAmount`,
      lineAmount.toFixed(2)
    );
    setFieldValue(`purchaseOrderLine.${index}.quantity`, quantity);
    CalculateValues({ lineAmount, index });
  };

  const onUnitCostChangeHandle = (event, index) => {
    const { value } = event.target;
    const unitCost = parseFloat(value) || 0.0;
    const quantity =
      parseFloat(values.purchaseOrderLine[index].quantity) || 0.0;
    const lineAmount = quantity * unitCost;
    setFieldValue(`purchaseOrderLine.${index}.unitCost`, unitCost.toFixed(2));
    setFieldValue(
      `purchaseOrderLine.${index}.lineAmount`,
      lineAmount.toFixed(2)
    );
    CalculateValues(lineAmount, index);
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

  const onDiscountAmountChangeHandle = (event) => {
    const { value } = event.target;
    const discountAmount = parseFloat(value) || 0.0;
    setFieldValue(`discountAmount`, discountAmount.toFixed(2));
    CalculateValues({
      discountAmount,
    });
  };

  const onInputHandle = (e) => {
    // Remove any non-numeric characters except dot
    e.target.value = e.target.value.replace(/[^0-9.]/g, "");

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
      quantityReceived: "",
      unitId: "",
      unitCost: "",
      quantityInvoiced: "",
      currencyId: "",
      lineAmount: "",
    };
    let purchaseOrderLine = values.purchaseOrderLine;
    purchaseOrderLine.push(Item);
    setFieldValue("purchaseOrderLine", purchaseOrderLine);
  };

  const deleteProduct = (index, rec) => {
    let purchaseOrderLine = values.purchaseOrderLine;
    purchaseOrderLine.splice(index, 1);
    setFieldValue("purchaseOrderLine", purchaseOrderLine);
  };

  return (
    <>
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
              Purchase Order
            </h2>
          </div>
          <div className="grid grid-cols-8 gap-x-6 mt-5 pb-20">
            <div className="intro-y col-span-12 2xl:col-span-9">
              <div className="intro-y box p-5 mt-5">
                <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                  <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                    <Lucide icon="FormInput" className="w-4 h-4 mr-2" />{" "}
                    Purchase Order Header
                  </div>
                  <div className="mt-5">
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
                                  "paymentMethodId",
                                  e.paymentMethod ?? ""
                                );
                                setFieldValue(
                                  "paymentTermId",
                                  e.paymentTerms ?? ""
                                );
                                setFieldValue(
                                  "currencyId",
                                  e.currencyCode ?? ""
                                );
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
                            placeholder="Order Date"
                            name=""
                            value={values.orderDate}
                            onChange={(date) => {
                              handleDateChange(date, "orderDate");
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
                          {submit && errors.orderDate && (
                            <div className="text-red-600 text-xs mt-1">
                              {errors.orderDate}
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
                              <div className="font-medium">Quote ID</div>
                            </div>
                          </div>
                        </div>

                        <div className="form-control col-span-4">
                          <Select
                            className="form-control"
                            placeholder="Vendor Quote ID"
                            id="vendorQuoteId"
                            name="vendorQuoteId"
                            value={
                              quotationOptions.find(
                                (obj) => obj.value === values.vendorQuoteId
                              ) || 0
                            }
                            onChange={(e) => {
                              setFieldValue("vendorQuoteId", e.value);
                            }}
                            options={quotationOptions}
                          />
                          {submit && errors.vendorQuoteId && (
                            <div className="text-red-600 text-xs mt-1">
                              {errors.vendorQuoteId}
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
                      {/*
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
                              console.log("fix", e.value);
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
                          */}
                    </div>
                  </div>
                </div>
              </div>
              <div id="lines" name="lines" className="intro-y box p-5 mt-5">
                <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                  <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                    <Lucide icon="FormInput" className="w-4 h-4 mr-2" />{" "}
                    Purchase Order Lines
                  </div>
                  <div className="mt-5">
                    <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                      <div className="w-full mt-3 xl:mt-0 flex-1">
                        <div className="overflow-visible z-0">
                          <table className="table border">
                            <thead>
                              <tr>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                  Product Name
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                  Quantity Received
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                  Quantity
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                  Quantity Invoiced
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                  Unit Of Measure
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                  Unit Price
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                  Site
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                  Warehouse
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                  Currency
                                </th>
                                <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                  Line Amount
                                </th>

                                {values.purchaseOrderLine.length != 1 ? (
                                  <th className="!px-2 bg-slate-50 dark:bg-darkmode-800">
                                    Delete
                                  </th>
                                ) : null}
                                <th className="!px-2 bg-slate-50 dark:bg-darkmode-800"></th>
                              </tr>
                            </thead>

                            <tbody>
                              {values?.purchaseOrderLine.map((rec, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="whitespace-nowrap">
                                      <Select
                                        name={`purchaseOrderLine.${index}.itemId`}
                                        value={
                                          productListOptions.find(
                                            (obj) =>
                                              obj.value ===
                                              values.purchaseOrderLine[index]
                                                .itemId
                                          ) || 0
                                        }
                                        className="form-control block min-w-full"
                                        type="text"
                                        onChange={(e) => {
                                          onSelectChangeHandle(e, index);
                                        }}
                                        options={productListOptions}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .ProductId && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .ProductId
                                            }
                                          </div>
                                        )}
                                    </td>
                                    <td className="">
                                      <input
                                        min="0"
                                        name={`purchaseOrderLine.${index}.quantityReceived`}
                                        type="number"
                                        value={rec.quantityReceived}
                                        onKeyDown={(e) =>
                                          exceptThisSymbols.includes(e.key) &&
                                          e.preventDefault()
                                        }
                                        className="form-control block min-w-fit"
                                        onChange={handleChange}
                                        disabled={true}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .quantityReceived && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .quantityReceived
                                            }
                                          </div>
                                        )}
                                    </td>
                                    <td className="">
                                      <input
                                        min="0"
                                        name={`purchaseOrderLine.${index}.quantity`}
                                        type="number"
                                        value={rec.quantity}
                                        onKeyDown={(e) =>
                                          exceptThisSymbols.includes(e.key) &&
                                          e.preventDefault()
                                        }
                                        className="form-control min-w-32"
                                        onChange={(e) => {
                                          onQuantityChangeHandle(e, index);
                                        }}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .quantity && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .quantity
                                            }
                                          </div>
                                        )}
                                    </td>
                                    <td className="">
                                      <input
                                        min="0"
                                        name={`purchaseOrderLine.${index}.quantityInvoiced`}
                                        type="number"
                                        value={rec.quantityInvoiced}
                                        onKeyDown={(e) =>
                                          invalidSymbols.includes(e.key) &&
                                          e.preventDefault()
                                        }
                                        className="form-control"
                                        onChange={handleChange}
                                        disabled={true}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .quantityInvoiced && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .quantityInvoiced
                                            }
                                          </div>
                                        )}
                                    </td>

                                    <td className="">
                                      <Select
                                        menuPlacement="auto"
                                        id="category"
                                        className="form-control"
                                        placeholder="UOM"
                                        styles={{
                                          placeholder: (base) => ({
                                            ...base,
                                            fontSize: "1em",
                                            color: "#A5B2C4",
                                            fontWeight: 400,
                                          }),
                                        }}
                                        name={`purchaseOrderLine.${index}.unitId`}
                                        value={
                                          salesUnitOptions.find(
                                            (obj) =>
                                              obj.value ===
                                              values.purchaseOrderLine[index]
                                                .unitId
                                          ) || 0
                                        }
                                        onChange={(e) => {
                                          setFieldValue(
                                            `purchaseOrderLine.${index}.unitId`,
                                            e.value
                                          );
                                        }}
                                        options={salesUnitOptions}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .unitId && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .unitId
                                            }
                                          </div>
                                        )}
                                    </td>
                                    <td className="">
                                      <input
                                        name={`purchaseOrderLine.${index}.unitCost`}
                                        type="number"
                                        value={rec.unitCost}
                                        className="form-control"
                                        onChange={(e) => {
                                          onUnitCostChangeHandle(e, index);
                                        }}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .unitCost && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .unitCost
                                            }
                                          </div>
                                        )}
                                    </td>

                                    <td className="">
                                      <Select
                                        menuPlacement="auto"
                                        id="category"
                                        className="form-control block min-w-[5rem] my-2"
                                        placeholder="Site"
                                        styles={{
                                          placeholder: (base) => ({
                                            ...base,
                                            fontSize: "1em",
                                            color: "#A5B2C4",
                                            fontWeight: 400,
                                          }),
                                        }}
                                        name={`purchaseOrderLine.${index}.siteId`}
                                        value={
                                          sitesOptions.find(
                                            (obj) =>
                                              obj.value ===
                                              values.purchaseOrderLine[index]
                                                .siteId
                                          ) || 0
                                        }
                                        onChange={(e) => {
                                          setFieldValue(
                                            `purchaseOrderLine.${index}.siteId`,
                                            e.value
                                          );
                                          let filteredWarehouses =
                                            Warehouse.docs.filter(
                                              (warehouse) =>
                                                warehouse.site === e.value
                                            );
                                          let newLineWarehouseOptions = [
                                            ...lineWarehouseOptions,
                                          ];
                                          newLineWarehouseOptions[index] =
                                            filteredWarehouses.map(
                                              ({ id, name }) => ({
                                                value: id,
                                                label: name,
                                              })
                                            );
                                          setLineWarehouseOptions(
                                            newLineWarehouseOptions
                                          );
                                        }}
                                        options={sitesOptions}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .siteId && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .siteId
                                            }
                                          </div>
                                        )}
                                    </td>
                                    <td className="">
                                      <Select
                                        menuPlacement="auto"
                                        id="category"
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
                                        name={`purchaseOrderLine.${index}.warehouseId`}
                                        value={
                                          lineWarehouseOptions[index]?.find(
                                            (obj) =>
                                              obj.value ===
                                              values.purchaseOrderLine[index]
                                                .warehouseId
                                          ) || 0
                                        }
                                        onChange={(e) => {
                                          setFieldValue(
                                            `purchaseOrderLine.${index}.warehouseId`,
                                            e.value
                                          );
                                        }}
                                        options={
                                          lineWarehouseOptions[index] || []
                                        }
                                        isDisabled={
                                          !values.purchaseOrderLine[index]
                                            .siteId
                                        }
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .warehouseId && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .warehouseId
                                            }
                                          </div>
                                        )}
                                    </td>

                                    <td className="">
                                      <Select
                                        menuPlacement="auto"
                                        id="category"
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
                                        name={`purchaseOrderLine.${index}.currencyId`}
                                        value={
                                          currencyOptions.find(
                                            (obj) =>
                                              obj.value ===
                                              values.purchaseOrderLine[index]
                                                .currencyId
                                          ) || 0
                                        }
                                        onChange={(e) => {
                                          setFieldValue(
                                            `purchaseOrderLine.${index}.currencyId`,
                                            e.value
                                          );
                                        }}
                                        options={currencyOptions}
                                      />
                                      {submit &&
                                        errors.purchaseOrderLine &&
                                        errors.purchaseOrderLine[index] &&
                                        errors.purchaseOrderLine[index]
                                          .currencyId && (
                                          <div className="text-red-600 text-xs mt-1">
                                            {
                                              errors.purchaseOrderLine[index]
                                                .currencyId
                                            }
                                          </div>
                                        )}
                                    </td>
                                    <td className="">
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="lineAmount"
                                        name={`purchaseOrderLine.${index}.lineAmount`}
                                        value={rec.lineAmount}
                                        disabled
                                      />
                                    </td>

                                    <td className="!pl-4 text-slate-500">
                                      {values.purchaseOrderLine.length != 1 ? (
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
                          <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add
                          New Product
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
          </div>
        </form>
      </div>
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
              <div className="mt-4">
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
            >
              Proceed
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Main;
