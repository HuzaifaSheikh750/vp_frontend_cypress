import * as $_ from "lodash";

import { ConstructJSON as JsonData, keyValue as kv } from "@/utils";
import { Litepicker, Lucide, Modal, ModalBody, ModalHeader, Tippy } from "@/base-components";
import {
  OrderStatusFormatter,
  PaymentStatusFormatter,
  pmidFormatter
} from "../../utils/formaters.jsx";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { createRef, useEffect, useRef, useState } from "react";
import {
  getAllOrders,
  addNewSalesOrderList as onAddNewSalesOrderList,
  deleteSalesOrderList as onDeleteSalesOrderList,
  getOrderDetails as onGetOrderDetails,
  getSalesOrderList as onGetSalesOrderList,
  updateSalesOrderList as onUpdateSalesOrderList
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { helper as $h } from "@/utils";
import { ExportJsonCsv } from "react-export-json-csv";
import Select from "react-select";
import alternateImage from "../../assets/images/gallery.png";
import classnames from "classnames";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import xlsx from "xlsx";

function Main() {
  const TAG = "SALES_ORDER_LIST";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { salesOrderList } = useSelector((state) => ({
    salesOrderList: state.SalesOrderListReducer?.salesOrderLists
  }));

  const { allOrders } = useSelector((state) => ({
    allOrders: state.OrderManagementReducer?.allOrders
  }));

  const { orderDetails } = useSelector((state) => ({
    orderDetails: state.OrderManagementReducer?.orderDetailsState
  }));

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [getSalesOrderList, setSalesOrderList] = useState([]);
  const [getOrderDetails, setOrderDetails] = useState([]);
  const [reorder, setReorder] = useState({ id: "", event: false });

  const [getOrderId, setOrderId] = useState("");
  const [getDateRange, setDateRange] = useState("");
  const [getStatus, setStatus] = useState({
    value: "",
    label: ""
  });
  const [getPaymentStatus, setPaymentStatus] = useState({
    value: "",
    label: ""
  });

  const [daterange, setDaterange] = useState("");

  const [getCurrentOrderId, setCurrentOrderId] = useState({
    value: "",
    event: false
  });

  useEffect(() => {
    var date = getDateRange.split("-");

    if (getPerPage.value != salesOrderList.limit) {
      setCurrentPage(1);
      var params = `?perPage=${getPerPage.value}&page=1`;
      params += getOrderId ? `&orderId=${getOrderId}` : "";
      params += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
      params += getPaymentStatus.value != "" ? `&invoiceStatus=${getPaymentStatus}` : "";
      params += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}` : "";
    } else {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      params += getOrderId ? `&orderId=${getOrderId}` : "";
      params += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
      params += getPaymentStatus.value != "" ? `&invoiceStatus=${getPaymentStatus}` : "";
      params += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}` : "";
    }
    if (salesOrderList.hasOwnProperty("message")) {
    } else if (
      !salesOrderList.hasOwnProperty("docs") ||
      getCurrentPage != salesOrderList.page ||
      getPerPage.value != salesOrderList.limit
    ) {
      dispatch(onGetSalesOrderList(params));
    }
    setSalesOrderList(salesOrderList);
  }, [dispatch, getCurrentPage, getPerPage]);

  useEffect(() => {
    if (!allOrders.length) {
      dispatch(getAllOrders());
    }
  }, [allOrders]);

  useEffect(() => {
    if (reorder.event) {
      const { id } = reorder;
      setReorder({ id: "", event: false });
      navigate("/create-sales-order?reorder=true&orderId=" + id);
    }
  }, [reorder]);

  useEffect(() => {
    if (getCurrentOrderId.event) {
      let param = `/${getCurrentOrderId.value}`;
      dispatch(onGetOrderDetails(param));

      setCurrentOrderId({ value: "", event: false });
    }
    setOrderDetails(orderDetails);
  }, [getCurrentOrderId.event, getOrderDetails]);

  const columns = [
    { title: "Order ID", field: "orderId", formatter: reactFormatter(<OrderIdFormatter />) },
    {
      title: "Description",
      field: "description",
      formatter: reactFormatter(<DescriptionFormatter />)
    },
    {
      title: "Date Placed",
      field: "orderPlaced",
      formatter: pmidFormatter
    },
    { title: "Total Quantity", field: "totalQuantity" },
    {
      title: "Order Status",
      field: "orderStatus",
      formatter: reactFormatter(<OrderStatusFormatter />)
    },
    {
      title: "Payment Status",
      field: "invoiceStatus",
      with: 20,
      formatter: reactFormatter(<PaymentStatusFormatter />)
    }
  ];

  const paymentStatus = [
    { value: "paid", label: "Paid" },
    { value: "refund", label: "Refund" },
    { value: "unpaid", label: "Unpaid" }
  ];

  const orderStatus = [
    { value: "approval", label: "Awaiting Approval" },
    { value: "approved", label: "Approved" },
    { value: "processing", label: "Processing" },
    { value: "packing", label: "Packing" },
    { value: "shipping", label: "Shipping" },
    { value: "delivered", label: "Delivered" }
  ];

  const handleFilterFunction = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    var date = getDateRange.split("-");
    param += getOrderId ? `&orderId=${getOrderId}` : "";
    param += getPaymentStatus.value != "" ? `&invoiceStatus=${getPaymentStatus}` : "";
    param += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
    param += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}` : "";
    dispatch(onGetSalesOrderList(param));
  };

  const handleResetFilter = () => {
    setOrderId("");
    setPaymentStatus({
      value: "",
      label: ""
    });
    setDateRange("");
    setStatus({ value: "", label: "" });

    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(onGetSalesOrderList(param));
  };

  function OrderIdFormatter(props) {
    const orderId = props.cell._cell.row.data.orderId;

    return (
      <div
        className="underline decoration-dotted whitespace-nowrap"
        onClick={() => {
          setBasicSlideOverPreview(true);
          setCurrentOrderId({
            value: `${orderId}`,
            event: true
          });
        }}
      >
        {orderId}
      </div>
    );
  }

  function DescriptionFormatter(props) {
    const description = props.cell._cell.row.data.description;

    return <div>{description ? description : "N/A"}</div>;
  }

  function handleReOrder(id) {
    setBasicSlideOverPreview(false);
    setReorder({ id: id, event: true });
  }

  const optionTab = {
    responsiveLayout: "collapse",
    scrollToRowIfVisible: true
  };

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">VENDOR QUOTES</h2>
      </div>

      <div className="intro-y box p-5 mt-5 ">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start mb-9">
          <form id="tabulator-html-filter-form" className="xl:flex sm:mr-auto">
            <div className="sm:flex items-center sm:mr-4">
              <div className="w-48 relative text-slate-500 ">
                <input
                  id="tabulator-html-filter-value"
                  type="text"
                  className="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
                  placeholder="Search By Order Id"
                  value={getOrderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                  }}
                />
                <Lucide icon="Search" className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
              </div>
            </div>
            <div className="sm:flex items-center sm:mr-4">
              <Litepicker
                value={daterange}
                placeholder="Search By Date Placed"
                onChange={setDaterange}
                options={{
                  autoApply: false,
                  singleMode: false,
                  numberOfColumns: 2,
                  numberOfMonths: 2,
                  showWeekNumbers: true,
                  dropdowns: {
                    minYear: 1990,
                    maxYear: null,
                    months: true,
                    years: true
                  }
                }}
                className="form-control w-56 block mx-auto"
              />
            </div>

            <div className="sm:flex items-center sm:mr-4">
              <Select
                placeholder="Payment Status"
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "1em",
                    color: "#A5B2C4",
                    fontWeight: 400
                  })
                }}
                className="form-control sm:w-40 mt-2 sm:mt-0 "
                value={getPaymentStatus.value}
                onChange={(e) => {
                  setPaymentStatus(e.value);
                }}
                options={paymentStatus}
              />
            </div>

            <div className="sm:flex items-center sm:mr-4">
              <Select
                placeholder="Order Status"
                styles={{
                  placeholder: (base) => ({
                    ...base,

                    fontSize: "1em",
                    color: "#A5B2C4",
                    fontWeight: 400
                  })
                }}
                className="form-control sm:w-40 mt-2 sm:mt-0"
                value={getStatus.value}
                onChange={(e) => {
                  setStatus(e.value);
                }}
                options={orderStatus}
              />
            </div>

            <div className="mt-2 xl:mt-0">
              <button
                id="tabulator-html-filter-go"
                type="button"
                className="btn btn-primary w-full sm:w-16 mr-3"
                onClick={() => handleFilterFunction()}
              >
                Filter
              </button>
              <button
                id="tabulator-html-filter-reset"
                type="button"
                className="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1"
                onClick={() => handleResetFilter()}
              >
                Reset
              </button>
            </div>
          </form>
          <div className="flex mt-5 sm:mt-0">
            {allOrders.length ? (
              <ExportJsonCsv
                id="tabulator-download"
                className="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
                headers={JsonData(allOrders, TAG)[1]}
                items={JsonData(allOrders, TAG)[0]}
              >
                <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export to CSV
              </ExportJsonCsv>
            ) : null}
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hidden">
          <ReactTabulator columns={columns} data={salesOrderList.docs} options={optionTab} />
        </div>
        {/* BEGIN: Pagination */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              {salesOrderList.hasPrevPage ? (
                <>
                  <li className="page-item">
                    <a className="page-link" href="#123" onClick={() => setCurrentPage(1)}>
                      <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(salesOrderList.prevPage)}
                    >
                      <Lucide icon="ChevronLeft" className="w-4 h-4" />
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(salesOrderList.prevPage)}
                    >
                      {salesOrderList.prevPage}
                    </a>
                  </li>
                </>
              ) : null}
              <li className="page-item active">
                <a className="page-link" href="#">
                  {salesOrderList.page}
                </a>
              </li>
              {salesOrderList.hasNextPage ? (
                <>
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(salesOrderList.nextPage)}
                    >
                      {salesOrderList.nextPage}
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(salesOrderList.nextPage)}
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4" />
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#123"
                      onClick={() => setCurrentPage(salesOrderList.totalPages)}
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
            onChange={(e) => setPerPage({ value: `${e.value}`, label: `${e.value}` })}
            options={kv.optionsPerPage}
          />
        </div>
        {/* END: Pagination */}
      </div>
      {/* END: HTML Table Data */}
      <Modal
        size="modal-xl"
        slideOver={true}
        show={basicSlideOverPreview}
        onHidden={() => {
          setBasicSlideOverPreview(false);
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="font-medium text-base mr-auto">Order Details</h1>
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center mt-2">
            <h2 className="intro-y text-lg font-medium mr-auto">Shipping Status</h2>
            <div className=" border-gray-200 dark:border-dark-5 pb-5 -mx-5 flex flex-col justify-end flex items-end">
              <div className="flex-1 px-5">
                <button
                  className="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
                  onClick={() => {
                    handleReOrder(orderDetails.orderId);
                  }}
                >
                  Reorder Details
                </button>
              </div>
            </div>
          </div>
          {/* BEGIN: Wizard Layout */}
          <div className="intro-y box py-10">
            <div className="relative before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button
                  className={classnames("w-10 h-10 rounded-full btn ", {
                    "btn-primary":
                      orderDetails.orderStatus == "approval" ||
                      orderDetails.orderStatus == "approved" ||
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? true
                        : false,
                    "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400":
                      orderDetails.orderStatus == "approval" ||
                      orderDetails.orderStatus == "approved" ||
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? false
                        : true
                  })}
                >
                  <Lucide
                    icon={
                      orderDetails.orderStatus == "approval" ||
                      orderDetails.orderStatus == "approved" ||
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? "Coffee"
                        : "Send"
                    }
                    className="w-4 h-4"
                  />
                </button>
                <div
                  className={classnames("lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto", {
                    "font-medium": orderDetails.orderStatus == "approval",
                    "text-slate-600 dark:text-slate-400": orderDetails.orderStatus != "approval"
                  })}
                >
                  Approval
                </div>
              </div>
              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button
                  className={classnames("w-10 h-10 rounded-full btn ", {
                    "btn-primary":
                      orderDetails.orderStatus == "approved" ||
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? true
                        : false,
                    "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400":
                      orderDetails.orderStatus == "approved" ||
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? false
                        : true
                  })}
                >
                  <Lucide
                    icon={
                      orderDetails.orderStatus == "approved" ||
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? "Coffee"
                        : "Send"
                    }
                    className="w-4 h-4"
                  />
                </button>
                <div
                  className={classnames("lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto", {
                    "font-medium": orderDetails.orderStatus == "approved",
                    "text-slate-600 dark:text-slate-400": orderDetails.orderStatus != "approved"
                  })}
                >
                  Approved
                </div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button
                  className={classnames("w-10 h-10 rounded-full btn ", {
                    "btn-primary":
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? true
                        : false,
                    "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400":
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? false
                        : true
                  })}
                >
                  <Lucide
                    icon={
                      orderDetails.orderStatus == "processing" ||
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? "Coffee"
                        : "Send"
                    }
                    className="w-4 h-4"
                  />
                </button>
                <div
                  className={classnames("lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto", {
                    "font-medium": orderDetails.orderStatus == "processing",
                    "text-slate-600 dark:text-slate-400": orderDetails.orderStatus != "processing"
                  })}
                >
                  Processing
                </div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button
                  className={classnames("w-10 h-10 rounded-full btn ", {
                    "btn-primary":
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? true
                        : false,
                    "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400":
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? false
                        : true
                  })}
                >
                  <Lucide
                    icon={
                      orderDetails.orderStatus == "packing" ||
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? "Coffee"
                        : "Send"
                    }
                    className="w-4 h-4"
                  />
                </button>
                <div
                  className={classnames("lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto", {
                    "font-medium": orderDetails.orderStatus == "packing",
                    "text-slate-600 dark:text-slate-400": orderDetails.orderStatus != "packing"
                  })}
                >
                  Packing
                </div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button
                  className={classnames("w-10 h-10 rounded-full btn ", {
                    "btn-primary":
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? true
                        : false,
                    "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400":
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? false
                        : true
                  })}
                >
                  <Lucide
                    icon={
                      orderDetails.orderStatus == "shipping" ||
                      orderDetails.orderStatus == "delivered"
                        ? "Coffee"
                        : "Send"
                    }
                    className="w-4 h-4"
                  />
                </button>
                <div
                  className={classnames("lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto", {
                    "font-medium": orderDetails.orderStatus == "shipping",
                    "text-slate-600 dark:text-slate-400": orderDetails.orderStatus != "shipping"
                  })}
                >
                  Shipping
                </div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button
                  className={classnames("w-10 h-10 rounded-full btn ", {
                    "btn-primary": orderDetails.orderStatus == "delivered" ? true : false,
                    "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400":
                      orderDetails.orderStatus == "delivered" ? false : true
                  })}
                >
                  <Lucide
                    icon={orderDetails.orderStatus == "delivered" ? "Coffee" : "Send"}
                    className="w-4 h-4"
                  />
                </button>
                <div
                  className={classnames("lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto", {
                    "font-medium": orderDetails.orderStatus == "delivered",
                    "text-slate-600 dark:text-slate-400": orderDetails.orderStatus != "delivered"
                  })}
                >
                  Delivered
                </div>
              </div>
            </div>
          </div>
          <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
            <h2 className="text-lg font-medium mr-auto">All Products Details</h2>
            <div className="w-full sm:w-auto flex mt-4 sm:mt-0"></div>
          </div>
          {/* BEGIN: Transaction Details */}
          <div className="intro-y grid grid-cols-11 gap-5 mt-5">
            <div className="col-span-12 lg:col-span-12 2xl:col-span-12">
              <div className="box p-5 rounded-md">
                <div className="overflow-auto lg:overflow-visible -mt-3">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap !py-5">Product</th>
                        <th className="whitespace-nowrap text-right">Unit Price</th>
                        <th className="whitespace-nowrap text-right">Qty</th>
                        <th className="whitespace-nowrap text-right">Unit of Measure</th>
                        <th className="whitespace-nowrap text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails
                        ? orderDetails.hasOwnProperty("products") &&
                          orderDetails.products.length > 0
                          ? orderDetails.products.map((value, key) => {
                              return (
                                <tr key={key}>
                                  <td className="!py-4">
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 image-fit zoom-in">
                                        <Tippy
                                          tag="img"
                                          className="rounded-lg border-2 border-white shadow-md tooltip"
                                          src={
                                            value?.prodRefId?.productImage.length > 0
                                              ? value.prodRefId?.productImage[0].url
                                              : alternateImage
                                          }
                                          onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = alternateImage;
                                          }}
                                        />
                                      </div>
                                      <a href="" className="font-medium whitespace-nowrap ml-4">
                                        {value.prodRefId?.name}
                                      </a>
                                    </div>
                                  </td>
                                  <td className="text-right">
                                    {$h.formatCurrency(value.unit_price)}
                                  </td>
                                  <td className="text-right">{value.quantity}</td>
                                  <td className="text-right">
                                    {value.hasOwnProperty("prodRefId")
                                      ? value.prodRefId?.unitOfMeasure || "N/A"
                                      : null}
                                  </td>{" "}
                                  <td className="text-right">
                                    {$h.formatCurrency(value.unit_price * value.quantity)}
                                  </td>
                                </tr>
                              );
                            })
                          : null
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="intro-y grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className=" box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">Transaction Details</div>
                </div>
                <div className="flex items-center">
                  <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                  Order Id: {orderDetails.orderId}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                  Invoice Id:
                  {orderDetails.invoiceNumber ? orderDetails.invoiceNumber : "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="Calendar" className="w-4 h-4 text-slate-500 mr-2" />
                  Purchase Date:
                  {moment(orderDetails.orderPlaced).utc().format("DD-MMM-YYYY")}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="Clock" className="w-4 h-4 text-slate-500 mr-2" />
                  Transaction Status:
                  {orderDetails.invoiceStatus == "unpaid" ? (
                    <span className="bg-danger/20 text-danger rounded px-2 ml-1">
                      {$h.capitalizeFirstLetter(orderDetails.invoiceStatus)}
                    </span>
                  ) : (
                    <span className="bg-success/20 text-success rounded px-2 ml-1">
                      {$h.capitalizeFirstLetter(orderDetails.invoiceStatus)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className="box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">Buyer Details</div>
                </div>
                <div className="flex items-center">
                  <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                  Name : {"  "}
                  {orderDetails.hasOwnProperty("buyerDetails")
                    ? orderDetails.buyerDetails.name
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="Calendar" className="w-4 h-4 text-slate-500 mr-2" />
                  Phone Number :{" "}
                  {orderDetails.hasOwnProperty("buyerDetails")
                    ? orderDetails.buyerDetails.phone
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="MapPin" className="w-4 h-4 text-slate-500 mr-2" />
                  Address :{" "}
                  {orderDetails.hasOwnProperty("buyerDetails")
                    ? orderDetails.buyerDetails.address
                    : ""}
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className="box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">Payment Details</div>
                </div>
                <div className="flex items-center">
                  <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                  Payment Method:
                  <div className="ml-auto">
                    {orderDetails.hasOwnProperty("paymentRefId")
                      ? orderDetails.paymentRefId.method
                      : "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="CreditCard" className="w-4 h-4 text-slate-500 mr-2" />
                  VAT
                  <div className="ml-auto">
                    {$h.formatCurrency(orderDetails.vat ? orderDetails.vat : 0)}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="CreditCard" className="w-4 h-4 text-slate-500 mr-2" />
                  Total Price ( {orderDetails.totalQuantity} Qty )
                  <div className="ml-auto">
                    {$h.formatCurrency(orderDetails.totalAmount ? orderDetails.totalAmount : 0)}
                  </div>
                </div>
                <div className="flex items-center border-t border-slate-200/60 dark:border-darkmode-400 pt-5 mt-5 font-medium">
                  <Lucide icon="CreditCard" className="w-4 h-4 text-slate-500 mr-2" />
                  Grand Total:
                  <div className="ml-auto">
                    {$h.formatCurrency(orderDetails.grossTotal ? orderDetails.grossTotal : 0)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className="box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">Shipping Information</div>
                </div>
                <div className="flex items-center">
                  <Lucide icon="Clipboard" className="w-4 h-4 text-slate-500 mr-2" />
                  Name :{" "}
                  {orderDetails.hasOwnProperty("shippingAddress")
                    ? orderDetails.shippingAddress.name
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="Calendar" className="w-4 h-4 text-slate-500 mr-2" />
                  Phone Number :{" "}
                  {orderDetails.hasOwnProperty("shippingAddress")
                    ? orderDetails.shippingAddress.phone
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide icon="MapPin" className="w-4 h-4 text-slate-500 mr-2" />
                  Address :{" "}
                  {orderDetails.hasOwnProperty("shippingAddress")
                    ? orderDetails.shippingAddress.address
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Main;
