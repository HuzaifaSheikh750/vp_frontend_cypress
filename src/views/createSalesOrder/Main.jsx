import * as Yup from "yup";

import {
  clearCart,
  getAllShippingInfo,
  getOrderDetails,
  addNewOrderManagement as onAddNewOrderManagement,
  getOrderManagement as onGetOrderManagement,
  getProductList as onGetProductList,
  QuantityChange as onQuantityChange
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { helper as $h } from "@/utils";
import { Lucide } from "@/base-components";
import Select from "react-select";
import classnames from "classnames";
import jwt from "jwt-decode"; // import dependency
import { useFormik } from "formik";

function Main() {
  const dispatch = useDispatch();

  const { productList } = useSelector((state) => ({
    productList: state.ProductListReducer?.productList
  }));

  const { orderDetails } = useSelector((state) => ({
    orderDetails: state.OrderManagementReducer?.orderDetailsState
  }));

  const { added } = useSelector((state) => ({
    added: state.OrderManagementReducer?.added
  }));

  const [getProductList, setProductList] = useState([{}]);

  const { QuantityofEachProduct } = useSelector((state) => ({
    QuantityofEachProduct: state.ProductListReducer?.QuantityofEachProduct
  }));

  const { shippingInfoList } = useSelector((state) => state.ManageUsersReducer);

  const [submit, setSubmit] = useState(false);

  const [submission, setsubmission] = useState(false);

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const exceptThisSymbolsforPrice = ["e", "E", "+", "-"];

  const [Address, setAddress] = useState();

  const [AddressObj, setAddressObj] = useState([]);

  useEffect(() => {
    var params = ``;

    if (!productList.hasOwnProperty("docs")) {
      dispatch(onGetProductList(params));
    }
    const token = JSON.parse(localStorage.getItem("authUser"));

    const user = jwt(token.accessToken);

    const payload = {
      userId: user.id
    };
    dispatch(getAllShippingInfo(payload));
  }, [dispatch]);

  useEffect(() => {
    if (productList.hasOwnProperty("docs")) {
      SetProductsinOptions();
    }
  }, [productList]);

  useEffect(() => {
    if (added) {
      var params = `?perPage=10&page=1`;
      dispatch(onGetOrderManagement(params));
    }
  }, [added]);

  useEffect(() => {
    if (submit && !validation.errors.products && !validation.errors.shippingAddress) {
      setSubmit(false);

      dispatch(onAddNewOrderManagement(validation.values));
      validation.setValues(validation.initialValues);

      if (AddressObj && AddressObj.length > 0) {
        validation.setFieldValue(
          "shippingAddress.name",
          AddressObj[0].name ? AddressObj[0].name : ""
        );
        validation.setFieldValue(
          "shippingAddress.phone",
          AddressObj[0].phoneNumber ? AddressObj[0].phoneNumber : ""
        );
        validation.setFieldValue(
          "shippingAddress.address",
          AddressObj[0].address ? AddressObj[0].address : ""
        );
      }
      dispatch(clearCart());
      handleClickReset();
      setsubmission(false);
    } else {
      setSubmit(false);
    }
  }, [submit, submission, Address]);

  useEffect(() => {
    if (shippingInfoList.length > 0) {
      PopulateAddreses();
    }
  }, [shippingInfoList]);

  const SetProductsinOptions = () => {
    let Products = [];

    productList.docs.map((rec) => Products.push({ value: `${rec._id}`, label: `${rec.name}` }));

    PopulateProducts();
    setProductList(Products);
  };

  const validation = useFormik({
    initialValues: {
      shippingInsurance: "required",
      shippingService: "standard",
      partialShipment: false,
      totalAmount: "",
      saveAs: "",
      totalQuantity: "",
      vat: "",
      grossTotal: "",
      description: "",
      shippingAddress: {
        name: "",
        phone: "",
        address: ""
      },
      products: [
        {
          prodRefId: "",
          unit_price: "",
          quantity: "",
          total_price: ""
        }
      ],
      buyerDetails: {
        name: "",
        phone: "",
        address: ""
      }
    },

    validationSchema: Yup.object().shape({
      products: Yup.array()
        .of(
          Yup.object().shape({
            prodRefId: Yup.string().required("Select product"),
            unit_price: Yup.string().required("Enter unit price"),
            quantity: Yup.string().required("Enter quantity"),
            total_price: Yup.string().required("Enter total amount")
          })
        )
        .required("Enter product details")
      // shippingAddress: Yup.object().shape({
      //   name: Yup.string().required(),
      //   // phone: Yup.string().required(),
      //   // address: Yup.string().required(),
      // }),
    }),

    onSubmit: (values) => {}
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isReorder = urlParams.get("reorder");
    const orderId = urlParams.get("orderId");

    if (isReorder === "true" && orderId) {
      // if reorder is true and orderId is present
      if (orderDetails?.orderId !== orderId) {
        dispatch(getOrderDetails("/" + orderId));
      } else {
        validation.setValues({
          shippingInsurance: orderDetails.shippingInsurance,
          shippingService: orderDetails.shippingService,
          partialShipment: orderDetails.partialShipment,
          totalAmount: orderDetails.totalAmount,
          totalQuantity: orderDetails.totalQuantity,
          vat: orderDetails.vat,
          grossTotal: orderDetails.grossTotal,
          description: orderDetails.description,
          shippingAddress: {
            name: orderDetails.shippingAddress.name || "",
            phone: orderDetails.shippingAddress.phone || "",
            address: orderDetails.shippingAddress.address || ""
          },

          products: orderDetails.products.map((rec) => {
            return {
              prodRefId: rec?.prodRefId?._id || "",
              unit_price: rec.unit_price,
              quantity: rec.quantity,
              total_price: rec.total_price
            };
          }),
          buyerDetails: {
            name: orderDetails.buyerDetails.name || "",
            phone: orderDetails.buyerDetails.phone || "",
            address: orderDetails.buyerDetails.address || ""
          }
        });

        const token = JSON.parse(localStorage.getItem("authUser"));

        const user = jwt(token.accessToken);

        setAddressObj(user.shippingInfo);
        setAddress(
          user.shippingInfo.findIndex((rec) => rec.name === orderDetails?.shippingAddress?.name)
        );
      }
    } else {
      // do nothing
    }
  }, [orderDetails]);

  const PopulateAddreses = () => {
    if (shippingInfoList.length > 0) {
      let addresses = [];
      shippingInfoList.map((rec) => {
        addresses.push({
          name: rec.name,
          phoneNumber: rec.phoneNumber,
          address: rec.address
        });
      });

      setAddressObj(addresses);
      setAddress(0);
      validation.setFieldValue("shippingAddress.name", addresses[0].name);
      validation.setFieldValue("shippingAddress.phone", addresses[0].phoneNumber);
      validation.setFieldValue("shippingAddress.address", addresses[0].address);
    }

    // try {
    //   let addresses = [];
    //   shippingInfoList.map((rec) => {
    //     addresses.push({
    //       name: rec.name,
    //       phoneNumber: rec.phoneNumber,
    //       address: rec.address
    //     });
    //   });

    //   setAddressObj(addresses);
    //   setAddress(0);

    //   validation.setFieldValue("shippingAddress.name", addresses[0].name);
    //   validation.setFieldValue("shippingAddress.phone", addresses[0].phoneNumber);
    //   validation.setFieldValue("shippingAddress.address", addresses[0].address);

    //   validation.setFieldValue("buyerDetails.name", user.name);
    //   validation.setFieldValue("buyerDetails.phone", user.phoneNumber);
    //   validation.setFieldValue("buyerDetails.address", user.mainAddress);
    // } catch (err) {}
  };

  const PopulateProducts = () => {
    let products = validation.values.products;

    QuantityofEachProduct.filter((data) => data.CartVisibility == true).map((rec, key) => {
      let productLIne = {
        prodRefId: rec._id,
        unit_price: rec.price,
        quantity: rec.addToCart,
        total_price: rec.price * rec.addToCart
      };

      products.push(productLIne);
    });

    if (products.length > 1) {
      products.splice(0, 1);
    }

    validation.setFieldValue("products", products);
  };

  const addProduct = () => {
    let productLIne = {
      prodRefId: "",
      unit_price: "",
      quantity: "",
      total_price: "0"
    };
    let products = validation.values.products;
    products.push(productLIne);

    validation.setFieldValue("products", products);

    setsubmission(false);
  };

  const handleClickReset = () => {
    validation.setFieldValue("products", [
      {
        prodRefId: "",
        unit_price: "",
        quantity: "",
        total_price: ""
      }
    ]);
  };

  const onSelectChangeHandle = (rec, index) => {
    const filterProduct = productList.docs.find((val) => val._id == rec.value);

    validation.setFieldValue(`products.${index}.unit_price`, filterProduct.price);

    validation.setFieldValue(`products.${index}.prodRefId`, rec.value);
  };

  const deleteProduct = (index, rec) => {
    let products = validation.values.products;

    products.splice(index, 1);

    validation.setFieldValue("products", products);
  };

  const calculateTotalPrice = () => {
    let products = validation.values.products;

    products.map((rec, index) => {
      return (rec.total_price = rec.quantity * rec.unit_price);
    });
  };

  const getName = (rec) => {
    if (rec.prodRefId && productList.hasOwnProperty("docs")) {
      let s = productList.docs.find((val) => val._id == rec.prodRefId);

      return productList.hasOwnProperty("docs") ? s?.name : "";
    } else {
      return "";
    }
  };

  const handleOnClick = (props) => {
    calculateTotalPrice();

    let total = validation.values.products.reduce((accumulator, object) => {
      return accumulator + object.unit_price * object.quantity;
    }, 0);

    let pcs = validation.values.products.reduce((accumulator, object) => {
      return accumulator + object.quantity;
    }, 0);

    let vat = (total / 100) * 5;

    let gross = total + vat;

    validation.setFieldValue("vat", vat);
    validation.setFieldValue("totalAmount", total);
    validation.setFieldValue("grossTotal", gross);
    validation.setFieldValue("totalQuantity", pcs);
    validation.setFieldValue("saveAs", props == 1 ? "save" : "draft");
    setSubmit(true);
    setsubmission(true);
    setAddress(0);
  };

  return (
    <>
      <form
        className="form-horizontal"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();

          //          dispatch(onAddNewOrderManagement(validation.values));
          return false;
        }}
      >
        <div className="intro-y flex items-center mt-8">
          <h2 className="text-lg font-medium mr-auto">Create Sales Order</h2>
        </div>
        <div className="grid grid-cols-11 gap-x-6 mt-5 pb-20">
          <div className="intro-y col-span-11 2xl:col-span-12">
            {/* BEGIN: Uplaod Product */}
            <div className="intro-y box p-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Order Header
                </div>
                <div className="mt-5">
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Shipping Insurance</div>
                        </div>
                        <div className="leading-relaxed text-slate-500 text-xs mt-3">
                          Refund product & postage for the seller and buyer in case of damage / loss
                          during shipping.
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="flex flex-col sm:flex-row">
                        <div className="form-check mr-4">
                          <input
                            id="shipping-insurance-required"
                            className="form-check-input"
                            type="radio"
                            name="shippingInsurance"
                            value="required"
                            checked={validation.values.shippingInsurance === "required"}
                            onChange={validation.handleChange}
                          />
                          <div className="form-check-label">
                            <div>Required</div>
                            <div className="leading-relaxed text-slate-500 text-xs mt-1 w-56">
                              You{" "}
                              <span className="font-medium text-slate-600 dark:text-slate-300">
                                require
                              </span>{" "}
                              the buyer to activate shipping insurance
                            </div>
                          </div>
                        </div>
                        <div className="form-check mr-4 mt-2 sm:mt-0">
                          <input
                            id="shipping-insurance-optional"
                            className="form-check-input"
                            type="radio"
                            name="shippingInsurance"
                            value="optional"
                            checked={validation.values.shippingInsurance === "optional"}
                            onChange={validation.handleChange}
                          />
                          <div className="form-check-label">
                            <div>Optional</div>
                            <div className="leading-relaxed text-slate-500 text-xs mt-1 w-56">
                              You{" "}
                              <span className="font-medium text-slate-600 dark:text-slate-300">
                                give the buyer the option
                              </span>{" "}
                              to activate shipping insurance
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Shipping Service</div>
                        </div>
                        <div className="leading-relaxed text-slate-500 text-xs mt-3">
                          Configure shipping services according to your product type.
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="flex flex-col sm:flex-row">
                        <div className="form-check mr-4">
                          <input
                            id="shipping-service-standard"
                            className="form-check-input"
                            type="radio"
                            name="shippingService"
                            value="standard"
                            checked={validation.values.shippingService === "standard"}
                            onChange={validation.handleChange}
                          />
                          <label className="form-check-label" htmlFor="shipping-service-standard">
                            Standard
                          </label>
                        </div>
                        <div className="form-check mr-4 mt-2 sm:mt-0">
                          <input
                            id="shipping-service-custom"
                            className="form-check-input"
                            type="radio"
                            name="shippingService"
                            value="custom"
                            checked={validation.values.shippingService === "custom"}
                            onChange={validation.handleChange}
                          />
                          <label className="form-check-label" htmlFor="shipping-service-custom">
                            Custom
                          </label>
                        </div>
                      </div>
                      <div className="leading-relaxed text-slate-500 text-xs mt-3">
                        The delivery service for this product will be the same as in the Shipping
                        Settings.
                      </div>
                    </div>
                  </div>
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Partial Shipment</div>
                          <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                            Required
                          </div>
                        </div>
                        <div className="leading-relaxed text-slate-500 text-xs mt-3">
                          You can allow or not allow by checking this feature
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="form-check form-switch">
                        <input
                          id="product-status-active"
                          className="form-check-input"
                          type="checkbox"
                          name="partialShipment"
                          checked={validation.values.partialShipment}
                          onChange={validation.handleChange}
                        />
                        <label className="form-check-label" htmlFor="product-status-active">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Description</div>
                        </div>
                        <div className="leading-relaxed text-slate-500 text-xs mt-3">
                          Add details related to products and order.
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="form-check form-switch">
                        <input
                          type="text"
                          name="description"
                          className="intro-y form-control py-3 px-4 box pr-10"
                          value={validation.values.description}
                          placeholder="Description"
                          onChange={validation.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Select Shipping Address</div>
                          <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                            Required
                          </div>
                        </div>
                        <div className="leading-relaxed text-slate-500 text-xs mt-3">
                          Select your deliver Address One of your registered address
                        </div>
                      </div>
                    </div>

                    {submission && validation.errors.hasOwnProperty("shippingAddress") ? (
                      <span className="text-red-400">Please select an address</span>
                    ) : null}
                    <div className="intro-y grid grid-cols-12 gap-5 mt-5">
                      {AddressObj.map((rec, index) => {
                        return (
                          <div
                            name="selectedAddress"
                            key={index}
                            className="col-span-12 lg:col-span-6 2xl:col-span-3"
                            onClick={() => {
                              validation.setFieldValue("shippingAddress.name", rec.name);
                              validation.setFieldValue("shippingAddress.phone", rec.phoneNumber);
                              validation.setFieldValue("shippingAddress.address", rec.address);
                              setAddress(index);
                            }}
                          >
                            <div
                              className={classnames("box p-5 rounded-md mt-5", {
                                "bg-[#1E40AF]": Address === index,
                                "text-[#f8fafc]": Address === index
                              })}
                            >
                              <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                                <div className="font-medium text-base truncate">
                                  Address {index + 1}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Lucide
                                  icon="Clipboard"
                                  className={classnames("w-4 h-4 text-slate-500 mr-2", {
                                    "text-[#fff]": Address === index
                                  })}
                                />
                                Name : {rec.name}
                              </div>
                              <div className="flex items-center mt-3">
                                <Lucide
                                  icon="Calendar"
                                  className={classnames("w-4 h-4 text-slate-500 mr-2", {
                                    "text-[#fff]": Address === index
                                  })}
                                />
                                Phone Number : {rec.phoneNumber}
                              </div>

                              <div className="flex items-center mt-3">
                                <Lucide
                                  icon="MapPin"
                                  className={classnames("w-4 h-4 text-slate-500 mr-2", {
                                    "text-[#fff]": Address === index
                                  })}
                                />
                                Address : {rec.address}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="intro-y box p-5 mt-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Order Line
                </div>
                <div className="mt-5">
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="form-label xl:w-64 xl:!mr-10">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Add Product</div>
                        </div>
                        <div className="leading-relaxed text-slate-500 text-xs mt-3">
                          You can add product by product section where you can find stock and other
                          related information.
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="">
                        <table className="table  ">
                          <thead>
                            <tr>
                              <th className="bg-slate-50 dark:bg-darkmode-800">Name</th>
                              <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                Qty
                              </th>
                              <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                Unit Price
                              </th>
                              <th className="!px-2 bg-slate-50 dark:bg-darkmode-800 text-slate-500 whitespace-nowrap">
                                Total Amount
                              </th>
                              {validation.values.products.length != 1 ? (
                                <th className="!px-2 bg-slate-50 dark:bg-darkmode-800">Delete</th>
                              ) : null}
                            </tr>
                          </thead>
                          <tbody>
                            {validation.values?.products.map((rec, index) => {
                              return (
                                <tr key={index}>
                                  <td className="whitespace-nowrap">
                                    <Select
                                      name={`products.${index}.prodRefId`}
                                      value={{
                                        value: `${rec.prodRefId}`,
                                        label: `${getName(rec)}`
                                      }}
                                      className="login__input form-control py-2 px-4 block w-45"
                                      type="number"
                                      onChange={(e) => {
                                        onSelectChangeHandle(e, index);
                                      }}
                                      options={getProductList}
                                    />

                                    {submission &&
                                    validation.errors.hasOwnProperty("products") &&
                                    validation.errors.products[index] ? (
                                      <span className="text-red-400">
                                        {validation.errors.products[index].hasOwnProperty(
                                          "prodRefId"
                                        )
                                          ? validation.errors.products[index].prodRefId
                                          : ""}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="!px-2">
                                    <input
                                      min="0"
                                      name={`products.${index}.quantity`}
                                      type="number"
                                      value={rec.quantity}
                                      onKeyDown={(e) =>
                                        exceptThisSymbols.includes(e.key) && e.preventDefault()
                                      }
                                      className=" form-control min-w-[6rem] my-2"
                                      onChange={validation.handleChange}
                                    />
                                    {submission &&
                                    validation.errors.hasOwnProperty("products") &&
                                    validation.errors.products[index] ? (
                                      <span className="text-red-400">
                                        {validation.errors.products[index].hasOwnProperty(
                                          "quantity"
                                        )
                                          ? validation.errors.products[index].quantity
                                          : ""}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="!px-2">
                                    <div className="input-group">
                                      <div className="input-group-text my-2">$</div>
                                      <input
                                        min="0"
                                        type="number"
                                        name={`products.${index}.unit_price`}
                                        value={rec.unit_price}
                                        className="form-control min-w-[6rem] my-2"
                                        onKeyDown={(e) =>
                                          exceptThisSymbolsforPrice.includes(e.key) &&
                                          e.preventDefault()
                                        }
                                        placeholder="Price"
                                        onChange={validation.handleChange}
                                      />
                                    </div>
                                    {submission &&
                                    validation.errors.hasOwnProperty("products") &&
                                    validation.errors.products[index] ? (
                                      <span className="text-red-400">
                                        {validation.errors.products[index].hasOwnProperty(
                                          "unit_price"
                                        )
                                          ? validation.errors.products[index].unit_price
                                          : ""}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="!px-2">
                                    <div className="input-group">
                                      <div className="input-group-text my-2">$</div>
                                      <input
                                        name={`products.${index}.total_price`}
                                        value={rec.quantity * rec.unit_price}
                                        type="text"
                                        disabled
                                        className="form-control min-w-[6rem] my-2"
                                        placeholder="Price"
                                      />
                                    </div>
                                  </td>
                                  <td className="!pl-4 text-slate-500">
                                    {validation.values.products.length != 1 ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteProduct(index, rec);
                                        }}
                                      >
                                        <Lucide icon="Trash2" className="w-4 h-4" />
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
                        <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="intro-y box p-5 mt-5">
              <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div className="font-medium text-base flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                  <Lucide icon="ChevronDown" className="w-4 h-4 mr-2" /> Order Details
                </div>
                <div className="mt-5">
                  <div className="form-inline items-start flex-col xl:flex-row mt-5 pt-5 first:mt-0 first:pt-0">
                    <div className="w-full mt-3 xl:mt-0 flex-1">
                      <div className="sm:grid grid-cols-4 gap-2">
                        <div className="input-group">
                          <input
                            type="text"
                            name="totalQuantity"
                            className="form-control"
                            disabled
                            value={validation.values.products.reduce((accumulator, object) => {
                              return accumulator + object.quantity;
                            }, 0)}
                            placeholder="Total Qty"
                          />
                          <div className="input-group-text">TOTAL ITEMS</div>
                        </div>
                        <div className="input-group mt-2 sm:mt-0">
                          <input
                            name="totalAmount"
                            disabled
                            type="text"
                            className="form-control"
                            placeholder="Height"
                            value={$h.formatCurrency(
                              validation.values.products.reduce((accumulator, object) => {
                                return accumulator + object.unit_price * object.quantity;
                              }, 0)
                            )}
                          />
                          <div className="input-group-text">TOTAL AMOUNT</div>
                        </div>
                        <div className="input-group mt-2 sm:mt-0">
                          <input
                            name="vat"
                            disabled
                            type="text"
                            className="form-control"
                            placeholder="Length"
                            value={$h.formatCurrency(
                              (validation.values.products.reduce((accumulator, object) => {
                                return accumulator + object.unit_price * object.quantity;
                              }, 0) /
                                100) *
                                5
                            )}
                          />
                          <div className="input-group-text">VAT 5%</div>
                        </div>
                        <div className="input-group mt-2 sm:mt-0">
                          <input
                            name="grossTotal"
                            type="text"
                            className="form-control"
                            placeholder="Length"
                            disabled
                            value={$h.formatCurrency(
                              validation.values.products.reduce((accumulator, object) => {
                                return accumulator + object.unit_price * object.quantity;
                              }, 0) +
                                (validation.values.products.reduce((accumulator, object) => {
                                  return accumulator + object.unit_price * object.quantity;
                                }, 0) /
                                  100) *
                                  5
                            )}
                          />
                          <div className="input-group-text">GROSS TOTAL</div>
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
                onClick={() => {
                  handleClickReset();
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 w-full md:w-52"
                onClick={() => {
                  handleOnClick(0);
                }}
                disabled
              >
                Save as Draft
              </button>
              <button
                type="button"
                className="btn py-3 btn-primary w-full md:w-52"
                onClick={() => {
                  handleOnClick(1);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Main;
