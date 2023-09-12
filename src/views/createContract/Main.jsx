import * as Yup from "yup";

import { Litepicker, Lucide } from "@/base-components";
import {
  getCurrencyCode as onGetCurrencyCode,
  getProductList as onGetProductList,
  getPurchaseAgreement as onGetPurchaseAgreement,
  getSalesUnit as onGetSalesUnit,
  getSites as onGetSites,
  getSpecificPurchaseAgreement as onGetSpecificPurchaseAgreement,
  getVendorList as onGetVendor,
  getWarehouse as onGetWarehouse,
  postPurchaseAgreement as onPostPurchaseAgreement,
  resetPurchaseAgreementStatus as onResetPurchaseAgreementStatus,
  updatePurchaseAgreement as onUpdatePurchaseAgreement,
} from "@/store/actions";
import { animateScroll as scroll, scroller } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { helper as $h } from "@/utils";
import Constants from "../../constants/Constants";
import { LoadingIcon } from "@/base-components";
import Select from "react-select";
import classnames from "classnames";
import { format } from "date-fns";
import moment from "moment";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let today = format(new Date(), "MM/dd/yyyy");

  const [submit, setSubmit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [tab, setTab] = useState(1);
  const [productListOptions, setProductListOptions] = useState([]);
  const [salesUnitOptions, setSalesUnitOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const [vendorsOptions, setVendorsOptions] = useState([]);
  const [sitesOptions, setSitesOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [lineWarehouseOptions, setLineWarehouseOptions] = useState([]);

  const defaultCommitmentOptions = [
    { value: "product_quantity", label: "Product Quantity Commitment" },
    { value: "product_value", label: "Product Value Commitment" },
    {
      value: "product_category_value",
      label: "Product Category Value Commitment",
    },
    { value: "value", label: "Value Commitment" },
  ];

  useEffect(() => {
    const params = "?perPage=1000&page=1";
    dispatch(onGetProductList(params));
    dispatch(onGetCurrencyCode(params));
    dispatch(onGetSalesUnit(params));
    dispatch(onGetVendor(params));
    dispatch(onGetSites(params));
    dispatch(onGetWarehouse(params));
  }, [dispatch]);

  // Extract data from reducers
  const { productList } = useSelector((state) => state.ProductListReducer);
  const { salesUnit } = useSelector((state) => state.SalesUnitReducer);
  const { currencyCode } = useSelector((state) => state.CurrencyCodeReducer);

  const { vendors } = useSelector((state) => state.VendorReducer);
  const { Sites } = useSelector((state) => state.SitesReducer);
  const { Warehouse } = useSelector((state) => state.WarehouseReducer);
  const { added, loadingForAdd, purchaseAgreement, updated } = useSelector(
    (state) => state.PurchaseAgreementReducer
  );
  // Transform and set options
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
      if (edit.edit === "true" && purchaseAgreement?.contractLine?.length > 0) {
        const newContractLineWarehouseOptions =
          purchaseAgreement?.contractLine?.map(({ siteId }) => {
            // Find the warehouses for the site
            let warehouses = Warehouse.docs.filter(
              (warehouse) => warehouse.site === siteId
            );
            return warehouses.map((warehouse) => ({
              label: warehouse.name,
              value: warehouse.id,
            }));
          });

        setLineWarehouseOptions(newContractLineWarehouseOptions);
      }

      const warehouseOptions = Warehouse.docs.map(({ id, name, site }) => ({
        value: id,
        label: name,
        site: site,
      }));
      setWarehouseOptions(warehouseOptions);
    }
  }, [edit, purchaseAgreement, Warehouse]);

  useEffect(() => {
    if (vendors?.docs) {
      const vendorsOptions = vendors.docs.map(
        ({ id, name, currencyCode, companyName }) => ({
          value: id,
          label: id + " - " + companyName,
          name: name ?? "",
          currencyCode: currencyCode ?? "",
        })
      );
      setVendorsOptions(vendorsOptions);
    }
  }, [vendors]);

  useEffect(() => {
    if (added || updated) {
      setSubmit(false);
      resetForm();
      dispatch(onResetPurchaseAgreementStatus());
      dispatch(onGetPurchaseAgreement("?perPage=10&page=1"));
      if (updated) {
        navigate("/contracts");
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
      if ($h.isNullObject(purchaseAgreement)) {
        let param = `/${id}`;
        dispatch(onGetSpecificPurchaseAgreement(param));

        // parse into purchaseAgreement object
      } else if (purchaseAgreement.id !== parseInt(id)) {
        let param = `/${id}`;
        dispatch(onGetSpecificPurchaseAgreement(param));
      } else {
        setFieldValue("vendorId", purchaseAgreement.vendorId ?? "");
        setFieldValue("name", purchaseAgreement.vendor?.name ?? "");
        setFieldValue("siteId", purchaseAgreement?.siteId ?? "");
        setFieldValue("currencyId", purchaseAgreement?.currencyId ?? "");
        setFieldValue(
          "startDate",
          $h.formatDate(purchaseAgreement?.startDate ?? "", "MM/DD/YYYY")
        );
        setFieldValue(
          "endDate",
          $h.formatDate(purchaseAgreement?.endDate ?? "", "MM/DD/YYYY")
        );
        setFieldValue(
          "commitmentStatus",
          purchaseAgreement?.commitmentStatus ?? ""
        );
        setFieldValue("warehouseId", purchaseAgreement?.warehouseId ?? "");

        // insert contractLine
        if (purchaseAgreement?.contractLine?.length > 0) {
          const contractLine =
            purchaseAgreement?.contractLine?.map(
              ({ itemId, siteId, warehouseId, quantity, uomId, endDate }) => ({
                itemId: itemId,
                siteId: siteId,
                warehouseId: warehouseId,
                quantity: quantity,
                uomId: uomId,
                endDate: $h.formatDate(endDate ?? "", "MM/DD/YYYY"),
              })
            ) ?? [];
          setFieldValue("contractLine", contractLine);
        }
      }
    }
  }, [purchaseAgreement]);

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
  } = useFormik({
    initialValues: {
      vendorId: "",
      name: "",
      siteId: "",
      currencyId: "",
      startDate: "",
      endDate: "",
      commitmentStatus: "",
      warehouseId: "",
      contractLine: [
        {
          itemId: "",
          siteId: "",
          warehouseId: "",
          quantity: "",
          uomId: "",
          endDate: "",
        },
      ],
    },
    validationSchema: Yup.object().shape({
      vendorId:
        $h.getRoleId() === Constants.ADMIN_ROLE_ID
          ? Yup.string().required("Required")
          : null,
      siteId: Yup.string().required("Required"),
      currencyId: Yup.string().required("Required"),
      startDate: Yup.string().required("Required"),
      endDate: Yup.string().required("Required"),
      commitmentStatus: Yup.string().required("Required"),
      warehouseId: Yup.string().required("Required"),
      contractLine: Yup.array().of(
        Yup.object().shape({
          itemId: Yup.string().required("Required"),
          siteId: Yup.string().required("Required"),
          warehouseId: Yup.string().required("Required"),
          quantity: Yup.string().required("Required"),
          uomId: Yup.string().required("Required"),
          endDate: Yup.string().required("Required"),
        })
      ),
    }),

    onSubmit: (values) => {
      if (edit.edit === "true") {
        const valuesObj = JSON.parse(JSON.stringify(values));

        valuesObj.contractLine = valuesObj.contractLine.map((item) => ({
          ...item,
          contractHeaderId: purchaseAgreement.id,
        }));

        dispatch(
          onUpdatePurchaseAgreement({
            code: edit.id,
            data: valuesObj,
          })
        );
      } else {
        dispatch(onPostPurchaseAgreement(values));
      }
    },
  });

  const handleDateChange = (date, field) => {
    // if date is string, convert it to date object
    if (typeof date === "string") {
      setFieldValue(field, date);
    } else {
    }
  };

  const onSelectChangeHandle = (rec, index) => {
    setFieldValue(`contractLine.${index}.itemId`, rec.value);
    setFieldValue(`contractLine.${index}.uomId`, rec.uomId);
  };

  const onQuantityChangeHandle = (event, index) =>
    setFieldValue(
      `contractLine.${index}.quantity`,
      parseInt(event.target.value)
    );

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const addProduct = () => {
    const newItem = {
      itemId: "",
      siteId: "",
      warehouseId: "",
      quantity: "",
      uomId: "",
      endDate: "",
    };
    const updatedVendorQuoteLine = [...values.contractLine, newItem];
    setFieldValue("contractLine", updatedVendorQuoteLine);
  };

  const deleteProduct = (index) => {
    const updatedVendorQuoteLine = [...values.contractLine];
    updatedVendorQuoteLine.splice(index, 1);
    setFieldValue("contractLine", updatedVendorQuoteLine);
  };

  return (
    <div>
      <form
        className="form-horizontal"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("submitting", values, errors);
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
            Contract
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
                            setFieldValue("currencyId", e.currencyCode ?? "");
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
                          <div className="font-medium">Effective Date</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
                      <Litepicker
                        placeholder="Effective Date"
                        name="startDate"
                        value={values.startDate}
                        onChange={(date) => {
                          handleDateChange(date, "startDate");
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
                      {submit && errors.startDate && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.startDate}
                        </div>
                      )}
                    </div>
                    <div className="form-label xl:w-64 xl:!mr-10 ml-4">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Expiration Date</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
                      <Litepicker
                        placeholder="Expiry Date"
                        name="endDate"
                        value={values.endDate}
                        onChange={(date) => {
                          handleDateChange(date, "endDate");
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
                      {submit && errors.endDate && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.endDate}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center mb-6">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Default Commitment</div>
                        </div>
                      </div>
                    </div>
                    <div className="form-control col-span-4">
                      <Select
                        className="form-control"
                        placeholder=" Default Commitment"
                        styles={{
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "1em",
                            color: "#A5B2C4",
                            fontWeight: 400,
                          }),
                        }}
                        name="commitmentStatus"
                        value={
                          defaultCommitmentOptions.find(
                            (obj) => obj.value === values.commitmentStatus
                          ) || 0
                        }
                        onChange={(e) => {
                          setFieldValue("commitmentStatus", e.value);
                        }}
                        options={defaultCommitmentOptions}
                      />
                      {submit && errors.commitmentStatus && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.commitmentStatus}
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
                        isDisabled={values.siteId === 0 || values.siteId === ""}
                        options={warehouseOptions}
                      />
                      {submit && errors.warehouseId && (
                        <div className="text-red-600 text-xs mt-1">
                          {errors.warehouseId}
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
                  <Lucide icon="FormInput" className="w-4 h-4 mr-2" /> Lines
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
                                Site
                              </th>
                              <th className="bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap ">
                                Warehouse
                              </th>
                              <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                Expiry Date
                              </th>
                              {values.contractLine.length != 1 ? (
                                <th className="!px-2 bg-slate-50 dark:bg-darkmode-800">
                                  Delete
                                </th>
                              ) : null}
                              <th className="!px-2 bg-slate-50 dark:bg-darkmode-800"></th>
                            </tr>
                          </thead>

                          <tbody>
                            {values?.contractLine.map((rec, index) => {
                              return (
                                <tr key={index}>
                                  <td className="whitespace-nowrap">
                                    <Select
                                      name={`contractLine.${index}.itemId`}
                                      value={
                                        productListOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.contractLine[index].itemId
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
                                      errors.contractLine &&
                                      errors.contractLine[index] &&
                                      errors.contractLine[index].itemId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.contractLine[index].itemId}
                                        </div>
                                      )}
                                  </td>

                                  <td className="px-2">
                                    <input
                                      min="0"
                                      name={`contractLine.${index}.quantity`}
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
                                      errors.contractLine &&
                                      errors.contractLine[index] &&
                                      errors.contractLine[index].quantity && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.contractLine[index].quantity}
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
                                      name={`contractLine.${index}.uomId`}
                                      value={
                                        salesUnitOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.contractLine[index].uomId
                                        ) || 0
                                      }
                                      onChange={(e) => {
                                        // setFieldValue("SalesUnit", e.value);
                                        setFieldValue(
                                          `contractLine.${index}.uomId`,
                                          e.value
                                        );
                                      }}
                                      options={salesUnitOptions}
                                    />
                                    {submit &&
                                      errors.contractLine &&
                                      errors.contractLine[index] &&
                                      errors.contractLine[index].uomId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.contractLine[index].uomId}
                                        </div>
                                      )}
                                  </td>

                                  <td className="px-2">
                                    <Select
                                      menuPlacement="auto"
                                      id="category"
                                      className="form-control min-w-[8rem] my-2"
                                      placeholder="Site"
                                      styles={{
                                        placeholder: (base) => ({
                                          ...base,
                                          fontSize: "1em",
                                          color: "#A5B2C4",
                                          fontWeight: 400,
                                        }),
                                      }}
                                      name={`contractLine.${index}.siteId`}
                                      value={
                                        sitesOptions.find(
                                          (obj) =>
                                            obj.value ===
                                            values.contractLine[index].siteId
                                        ) || 0
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `contractLine.${index}.siteId`,
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
                                      errors.contractLine &&
                                      errors.contractLine[index] &&
                                      errors.contractLine[index].siteId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.contractLine[index].siteId}
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <Select
                                      menuPlacement="auto"
                                      id="category"
                                      className="form-control min-w-[8rem] my-2"
                                      placeholder="Warehouse"
                                      styles={{
                                        placeholder: (base) => ({
                                          ...base,
                                          fontSize: "1em",
                                          color: "#A5B2C4",
                                          fontWeight: 400,
                                        }),
                                      }}
                                      name={`contractLine.${index}.warehouseId`}
                                      value={
                                        lineWarehouseOptions[index]?.find(
                                          (obj) =>
                                            obj.value ===
                                            values.contractLine[index]
                                              .warehouseId
                                        ) || 0
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `contractLine.${index}.warehouseId`,
                                          e.value
                                        );
                                      }}
                                      options={
                                        lineWarehouseOptions[index] || []
                                      }
                                      isDisabled={
                                        !values.contractLine[index].siteId
                                      }
                                    />
                                    {submit &&
                                      errors.contractLine &&
                                      errors.contractLine[index] &&
                                      errors.contractLine[index]
                                        .warehouseId && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {
                                            errors.contractLine[index]
                                              .warehouseId
                                          }
                                        </div>
                                      )}
                                  </td>
                                  <td className="px-2">
                                    <Litepicker
                                      className="form-control min-w-[8rem] my-2"
                                      placeholder="Expiry Date"
                                      name={`contractLine.${index}.endDate`}
                                      value={values.contractLine[index].endDate}
                                      onChange={(date) => {
                                        handleDateChange(
                                          date,
                                          `contractLine.${index}.endDate`
                                        );
                                      }}
                                      options={{
                                        autoApply: false,
                                        showWeekNumbers: true,
                                        dropdowns: {
                                          minYear: 1990,
                                          maxYear:
                                            new Date().getFullYear() + 10,
                                          months: true,
                                          years: true,
                                        },
                                      }}
                                    />
                                    {submit &&
                                      errors.contractLine &&
                                      errors.contractLine[index] &&
                                      errors.contractLine[index].endDate && (
                                        <div className="text-red-600 text-xs mt-1">
                                          {errors.contractLine[index].endDate}
                                        </div>
                                      )}
                                  </td>

                                  <td className="!pl-4 text-slate-500">
                                    {values.contractLine.length != 1 ? (
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
