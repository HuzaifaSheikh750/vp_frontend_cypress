import * as $_ from "lodash";

import {
  helper as $h,
  ConstructJSON as JsonData,
  keyValue as kv,
} from "@/utils";
import {
  Litepicker,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  Tippy,
} from "@/base-components";
import {
  getAllOrders,
  getOrderDetails as onGetOrderDetails,
  getOrderManagement as onGetOrderManagement,
  saveFilters,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { ExportJsonCsv } from "react-export-json-csv";
import Select from "react-select";
import { StripePayButton } from "../../components/payment-buttons/Main";
import alternateImage from "../../assets/images/gallery.png";
import classnames from "classnames";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function Main() {
  const componentRef = useRef();
  const navigate = useNavigate();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const TAG = "ORDER_MANAGEMENT";
  const dispatch = useDispatch();

  const { orderManagement } = useSelector((state) => ({
    orderManagement: state.OrderManagementReducer?.orderManagements,
  }));

  const { orderDetails } = useSelector((state) => ({
    orderDetails: state.OrderManagementReducer?.orderDetailsState,
  }));

  const { allOrders } = useSelector((state) => ({
    allOrders: state.OrderManagementReducer?.allOrders,
  }));

  const { SavedDateRange, SavedOrderId, SavedStatus } = useSelector(
    (state) => state.OrderManagementReducer
  );

  // set useState initially from redux
  // const [getOrderId, setOrderId] = useState(SavedOrderId);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState({
    show: false,
    id: null,
  });
  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);
  const [getOrderId, setOrderId] = useState(SavedOrderId);
  const [getDateRange, setDateRange] = useState(SavedDateRange);
  const [getStatus, setStatus] = useState(SavedStatus);
  const [getOrderManagement, setOrderManagement] = useState({});
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [largeSlideOverSizePreview, setLargeSlideOverSizePreview] =
    useState(false);
  const [getPerPage, setPerPage] = useState({ value: 10, label: "10" });
  const [getOrderDetails, setOrderDetails] = useState([]);
  const [isPayNowVisible, setisPayNowVisible] = useState(false);
  const [getCurrentOrderId, setCurrentOrderId] = useState({
    value: "",
    event: false,
  });
  const [reorder, setReorder] = useState({ id: "", event: false });

  useEffect(() => {
    var date = getDateRange.split("-");

    if (parseInt(getPerPage.value) !== orderManagement.limit) {
      setCurrentPage(1);
      var params = `?perPage=${getPerPage.value}&page=1`;
      params += getOrderId ? `&orderId=${getOrderId}` : "";
      params += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
      params +=
        date[0] != date[1]
          ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`
          : "";
    } else {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      params += getOrderId ? `&orderId=${getOrderId}` : "";
      params += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
      params +=
        date[0] != date[1]
          ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`
          : "";
    }
    if (orderManagement.hasOwnProperty("message")) {
    } else if (
      !orderManagement.hasOwnProperty("docs") ||
      getCurrentPage != orderManagement.page ||
      parseInt(getPerPage.value) !== orderManagement.limit
    ) {
      dispatch(onGetOrderManagement(params));
    }

    setOrderManagement(orderManagement);
  }, [dispatch, getCurrentPage, getPerPage]);

  useEffect(() => {
    if (getCurrentOrderId.event) {
      let param = `/${getCurrentOrderId.value}`;
      dispatch(onGetOrderDetails(param));

      setCurrentOrderId({ value: "", event: false });
    }
    setOrderDetails(orderDetails);
  }, [getCurrentOrderId.event, getOrderDetails]);

  useEffect(() => {
    if (!allOrders.length) {
      dispatch(getAllOrders());
    }
  }, [allOrders]);

  const handleFilterFunction = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    var date = getDateRange.split("-");

    param += getOrderId ? `&orderId=${getOrderId}` : "";
    param += getStatus !== "" ? `&orderStatus=${getStatus.value}` : "";
    param +=
      date && date[0] != date[1]
        ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`
        : "";
    dispatch(
      saveFilters({
        SavedOrderId: getOrderId,
        SavedStatus: getStatus,
        SavedDateRange: getDateRange,
      })
    );

    dispatch(onGetOrderManagement(param));
  };

  useEffect(() => {
    if (reorder.event) {
      const { id } = reorder;
      setReorder({ id: "", event: false });
      navigate("/create-sales-order?reorder=true&orderId=" + id);
    }
  }, [reorder]);

  const handleResetFilter = () => {
    setOrderId("");
    setStatus("");
    setDateRange("");
    let param = `?perPage=${getPerPage.value}&page=1`;

    dispatch(
      saveFilters({
        SavedOrderId: "",
        SavedStatus: "",
        SavedDateRange: "",
      })
    );

    dispatch(onGetOrderManagement(param));
    setOrderManagement(orderManagement);
    // setTransactionHistory(transactionHistory);
  };

  function handleReOrder(id) {
    setDeleteConfirmationModal({
      show: false,
      id: null,
    });

    setReorder({ id: id, event: true });

    // }
    // history.push({
    //   pathname: "/create-sales-order/reorder",

    // state: {
    //   id: id
    // }
    // ..//});
  } //

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10">Order Management</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap xl:flex-nowrap items-center mt-2">
          <div className="flex w-full sm:w-auto">
            <div className="w-48 relative text-slate-500 ">
              <input
                type="text"
                className="form-control w-48 box pr-10 "
                placeholder="Search By Order Id..."
                value={getOrderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                }}
              />
              <Lucide
                icon="Search"
                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
              />
            </div>
            <div className=" relative text-slate-500 box ml-5">
              <Litepicker
                placeholder="Search By Date Placed"
                onChange={setDateRange}
                value={getDateRange}
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
                    years: true,
                  },
                }}
                className="form-control w-56 block mx-auto"
              />
            </div>
            <Select
              className="form-control sm:w-50 mt-2 sm:mt-0 ml-5"
              placeholder="Order Status"
              styles={{
                placeholder: (base) => ({
                  ...base,
                  fontSize: "1em",
                  color: "#A5B2C4",
                  fontWeight: 400,
                }),
              }}
              value={getStatus}
              onChange={(e) => {
                setStatus(e);
                // setStatus(e.value);
              }}
              options={kv.optionsOrderStatus}
            />
            <button
              className="btn btn-primary shadow-md mr-2 ml-5"
              onClick={() => handleFilterFunction()}
            >
              <Lucide icon="Filter" className="w-4 h-4 mr-2" /> Filter
            </button>
            <button
              id="tabulator-html-filter-reset"
              type="button"
              className="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 ml-3"
              onClick={() => handleResetFilter()}
            >
              Reset
            </button>
          </div>
          <div className="hidden xl:block mx-auto text-slate-500">
            Showing{" "}
            {getCurrentPage > 1
              ? getPerPage.value * (getCurrentPage - 1) + 1
              : 1}{" "}
            to{" "}
            {orderManagement.totalDocs < getPerPage.value * getCurrentPage
              ? orderManagement.totalDocs
              : getPerPage.value * getCurrentPage}{" "}
            of {orderManagement.totalDocs} entries
          </div>
          {allOrders.length ? (
            <div className="btn btn-primary shadow-md mr-2 ">
              {/* <button className=""> */}

              <>
                <Lucide icon="Download" className="w-4 h-4 mr-2" />
                <ExportJsonCsv
                  headers={JsonData(allOrders, TAG)[1]}
                  items={JsonData(allOrders, TAG)[0]}
                >
                  Export to CSV
                </ExportJsonCsv>
              </>

              {/* </button> */}
            </div>
          ) : null}
        </div>
        {/* BEGIN: Data List */}
        <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
          <table className="table table-report -mt-2">
            <thead>
              <tr>
                <th className="whitespace-nowrap">ORDER ID</th>
                <th className="text-center whitespace-nowrap">INVOICE ID</th>
                <th className="text-center whitespace-nowrap">DESCRIPTION</th>
                <th className="text-center whitespace-nowrap">ORDER STATUS</th>
                <th className="text-center whitespace-nowrap">DATE PLACED</th>
                <th className="text-center whitespace-nowrap">TOTAL QTY</th>
                <th className="text-center whitespace-nowrap">
                  EXPECTED DELIVERY
                </th>
                <th className="text-center whitespace-nowrap">
                  INVOICE STATUS
                </th>
                <th className="text-center whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {$_.take(orderManagement.docs, orderManagement.totalDocs).map(
                (value, index) => (
                  <tr key={index} className="intro-x">
                    <td className="w-30 !py-4">
                      <div
                        className="underline decoration-dotted whitespace-nowrap"
                        onClick={() => {
                          setBasicSlideOverPreview(true);
                          setCurrentOrderId({
                            value: `${value.orderId}`,
                            event: true,
                          });
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {value.orderId}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center whitespace-nowrap text-center">
                        {value?.invoiceNumber ? value?.invoiceNumber : "-"}
                      </div>
                    </td>

                    <td className="text-center truncate w-30">
                      {value.description ? value.description : "-"}
                    </td>

                    <td className="text-center">
                      <div
                        className={classnames({
                          "flex items-center justify-center whitespace-nowrap": true,
                          "text-green-700": value.orderStatus == "approved",
                          "text-success": value.orderStatus == "approval",
                          "text-info": value.orderStatus == "processing",
                          "text-danger": value.orderStatus == "cancelled",
                          "text-warning": value.orderStatus == "packing",
                          "text-primary":
                            value.orderStatus == "shipping" ||
                            value.orderStatus == "delivered",
                        })}
                      >
                        {$h.capitalizeFirstLetter(value.orderStatus)}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="whitespace-nowrap  text-xs">
                        {moment(value.orderPlaced).utc().format("DD-MMM-YYYY")}
                      </div>
                    </td>
                    <td className="w-40 text-center">
                      <div className="">{value.totalQuantity}</div>
                    </td>
                    <td>
                      <div className="text-center text-xs">
                        {moment(value.expectedDeliveryDate)
                          .utc()
                          .format("DD-MMM-YYYY")}
                      </div>
                    </td>

                    <td className="text-center">
                      <div
                        className={classnames({
                          "flex items-center justify-center whitespace-nowrap": true,
                          "text-success": value.invoiceStatus == "paid",
                          "text-info": value.invoiceStatus == "refund",
                          "text-danger": value.invoiceStatus == "unpaid",
                        })}
                      >
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                        {$h.capitalizeFirstLetter(value.invoiceStatus)}
                      </div>
                    </td>
                    <td className="table-report__action">
                      <div className="flex justify-center items-center">
                        <a
                          className="flex items-center text-primary whitespace-nowrap mr-2"
                          href="#"
                          onClick={() => {
                            setCurrentOrderId({
                              value: `${value.orderId}`,
                              event: true,
                            });
                            setLargeSlideOverSizePreview(true);
                            setisPayNowVisible(false);
                          }}
                        >
                          {value.orderStatus == "approval"
                            ? " Draft Invoice"
                            : "View Invoice"}
                        </a>

                        {value.orderStatus == "approval" ||
                        value.invoiceStatus == "paid" ? (
                          // grey text color
                          <div className="flex items-center text-grey-500 whitespace-nowrap mr-2 ml-2">
                            Make a Payment
                          </div>
                        ) : (
                          <a
                            className="flex items-center text-primary whitespace-nowrap mr-2 ml-2"
                            href="#"
                            onClick={() => {
                              setCurrentOrderId({
                                value: `${value.orderId}`,
                                event: true,
                              });
                              setLargeSlideOverSizePreview(true);
                              setisPayNowVisible(true);
                            }}
                          >
                            Make a Payment
                          </a>
                        )}

                        <a
                          className="flex items-center text-primary whitespace-nowrap ml-2"
                          href="#"
                          onClick={() => {
                            setDeleteConfirmationModal({
                              show: true,
                              id: value.orderId,
                            });
                          }}
                        >
                          <Lucide icon="Repeat" className="w-4 h-4 mr-1" />
                          Repeat the Order
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {/* END: Data List */}
        {orderManagement.hasOwnProperty("docs") ? (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {orderManagement.hasPrevPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(1)}
                      >
                        <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(orderManagement.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(orderManagement.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(orderManagement.prevPage)}
                      >
                        {orderManagement.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {orderManagement.page}
                  </a>
                </li>
                {orderManagement.hasNextPage ? (
                  <>
                    <li className="page-item">
                      {/* <a className="page-link" href="#" onClick ={setCurrentPage(orderManagement.nextPage)} > */}

                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(orderManagement.nextPage)}
                      >
                        {orderManagement.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(orderManagement.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() =>
                          setCurrentPage(orderManagement.totalPages)
                        }
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
              onChange={(e) =>
                setPerPage({ value: `${e.value}`, label: `${e.value}` })
              }
              options={kv.optionsPerPage}
            />
          </div>
        ) : null}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Modal
        size="modal-xl"
        slideOver={true}
        show={basicSlideOverPreview}
        onHidden={() => {
          setBasicSlideOverPreview(false);
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="text-lg font-medium mr-auto">Order Details</h1>
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center mt-8">
            <h2 className="intro-y text-lg font-medium mr-auto">
              Shipping Status
            </h2>
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
                        : true,
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
                  className={classnames(
                    "lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto",
                    {
                      "font-medium": orderDetails.orderStatus == "approval",
                      "text-slate-600 dark:text-slate-400":
                        orderDetails.orderStatus != "approval",
                    }
                  )}
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
                        : true,
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
                  className={classnames(
                    "lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto",
                    {
                      "font-medium": orderDetails.orderStatus == "approved",
                      "text-slate-600 dark:text-slate-400":
                        orderDetails.orderStatus != "approved",
                    }
                  )}
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
                        : true,
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
                  className={classnames(
                    "lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto",
                    {
                      "font-medium": orderDetails.orderStatus == "processing",
                      "text-slate-600 dark:text-slate-400":
                        orderDetails.orderStatus != "processing",
                    }
                  )}
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
                        : true,
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
                  className={classnames(
                    "lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto",
                    {
                      "font-medium": orderDetails.orderStatus == "packing",
                      "text-slate-600 dark:text-slate-400":
                        orderDetails.orderStatus != "packing",
                    }
                  )}
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
                        : true,
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
                  className={classnames(
                    "lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto",
                    {
                      "font-medium": orderDetails.orderStatus == "shipping",
                      "text-slate-600 dark:text-slate-400":
                        orderDetails.orderStatus != "shipping",
                    }
                  )}
                >
                  Shipping
                </div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button
                  className={classnames("w-10 h-10 rounded-full btn ", {
                    "btn-primary":
                      orderDetails.orderStatus == "delivered" ? true : false,
                    "text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400":
                      orderDetails.orderStatus == "delivered" ? false : true,
                  })}
                >
                  <Lucide
                    icon={
                      orderDetails.orderStatus == "delivered"
                        ? "Coffee"
                        : "Send"
                    }
                    className="w-4 h-4"
                  />
                </button>
                <div
                  className={classnames(
                    "lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto",
                    {
                      "font-medium": orderDetails.orderStatus == "delivered",
                      "text-slate-600 dark:text-slate-400":
                        orderDetails.orderStatus != "delivered",
                    }
                  )}
                >
                  Delivered
                </div>
              </div>
            </div>
          </div>
          <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
            <h2 className="text-lg font-medium mr-auto">
              All Products Details
            </h2>
            <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
              {/* <button className="btn btn-primary shadow-md mr-2">Print</button> */}
              <button
                className="btn btn-primary shadow-md mr-2"
                onClick={
                  () => handlePrint()
                  // setLargeSlideOverSizePreview(true)
                }
              >
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Print
                Invoice
              </button>
            </div>
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
                        <th className="whitespace-nowrap text-right">
                          Unit Price
                        </th>
                        <th className="whitespace-nowrap text-right">Qty</th>
                        <th className="whitespace-nowrap text-right">
                          Unit of Measure
                        </th>
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
                                            value?.prodRefId?.productImage
                                              .length > 0
                                              ? value.prodRefId?.productImage[0]
                                                  .url
                                              : alternateImage
                                          }
                                          onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = alternateImage;
                                          }}
                                        />
                                      </div>
                                      <div className="font-medium whitespace-nowrap ml-4">
                                        {value.prodRefId?.name || "N/A"}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="text-right">
                                    {$h.formatCurrency(value.unit_price)}
                                  </td>
                                  <td className="text-right">
                                    {value.quantity}
                                  </td>
                                  <td className="text-right">
                                    {value.hasOwnProperty("prodRefId")
                                      ? value.prodRefId?.unitOfMeasure || "N/A"
                                      : null}
                                  </td>
                                  <td className="text-right">
                                    {$h.formatCurrency(
                                      value.unit_price * value.quantity
                                    )}
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
            {/* <div className="col-span-12 lg:col-span-12 2xl:col-span-12"> */}

            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className=" box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">
                    Transaction Details
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Order Id: {orderDetails.orderId}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Invoice Id:{" "}
                  {orderDetails.invoiceNumber
                    ? orderDetails.invoiceNumber
                    : "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Purchase Date:{" "}
                  {moment(orderDetails.orderPlaced).utc().format("DD-MMM-YYYY")}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clock"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
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
                  <div className="font-medium text-base truncate">
                    Buyer Details
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Name : {"  "}
                  {orderDetails.hasOwnProperty("buyerDetails")
                    ? orderDetails.buyerDetails.name
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Phone Number :{" "}
                  {orderDetails.hasOwnProperty("buyerDetails")
                    ? orderDetails.buyerDetails.phone
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="MapPin"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
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
                  <div className="font-medium text-base truncate">
                    Payment Details
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Payment Method:
                  <div className="ml-auto">
                    {orderDetails.hasOwnProperty("paymentRefId")
                      ? orderDetails.paymentRefId.method
                      : "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  VAT
                  <div className="ml-auto">
                    {$h.formatCurrency(orderDetails.vat ? orderDetails.vat : 0)}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Total Price ( {orderDetails.totalQuantity} Qty )
                  <div className="ml-auto">
                    {$h.formatCurrency(
                      orderDetails.totalAmount ? orderDetails.totalAmount : 0
                    )}
                  </div>
                </div>

                <div className="flex items-center border-t border-slate-200/60 dark:border-darkmode-400 pt-5 mt-5 font-medium">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Grand Total:
                  <div className="ml-auto">
                    {$h.formatCurrency(
                      orderDetails.grossTotal ? orderDetails.grossTotal : 0
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className="box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">
                    Shipping Information
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Name :{" "}
                  {orderDetails.hasOwnProperty("shippingAddress")
                    ? orderDetails.shippingAddress.name
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Phone Number :{" "}
                  {orderDetails.hasOwnProperty("shippingAddress")
                    ? orderDetails.shippingAddress.phone
                    : ""}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="MapPin"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Address :{" "}
                  {orderDetails.hasOwnProperty("shippingAddress")
                    ? orderDetails.shippingAddress.address
                    : ""}
                </div>
              </div>
            </div>
          </div>
          {/* END: Transaction Details */}
          {/* END: Wizard Layout */}
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}

      {/* BEGIN: Large Slide Over Content */}
      <Modal
        size="modal-xl"
        slideOver={true}
        show={largeSlideOverSizePreview}
        onHidden={() => {
          setLargeSlideOverSizePreview(false);
        }}
      >
        <ModalBody>
          <>
            {/* BEGIN: Invoice */}
            <div
              className="intro-y box overflow-hidden mt-5"
              ref={componentRef}
            >
              <div className="flex flex-col lg:flex-row pt-10 px-5 sm:px-20 sm:pt-20 lg:pb-20 text-center sm:text-left">
                <div className="font-semibold text-primary text-3xl">
                  {orderDetails.hasOwnProperty("orderStatus")
                    ? orderDetails.orderStatus == "approval"
                      ? "Draft Invoice"
                      : "Invoice"
                    : ""}
                </div>

                <div className="mt-20 lg:mt-0 lg:ml-auto lg:text-right">
                  <div className="text-xl text-primary font-medium">
                    {import.meta.env.VITE_COMPANY_NAME}
                  </div>
                  <div className="mt-1">
                    {import.meta.env.VITE_COMPANY_EMAIL}
                  </div>
                  <div className="mt-1">
                    {import.meta.env.VITE_COMPANY_ADDRESS}
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row border-b px-5 sm:px-20 pt-10 pb-10 sm:pb-20 text-center sm:text-left">
                <div>
                  <div className="text-base text-slate-500">Client Details</div>
                  <div className="text-lg font-medium text-primary mt-2">
                    {orderDetails.hasOwnProperty("buyerDetails")
                      ? orderDetails.buyerDetails.name
                      : ""}
                  </div>
                  <div className="mt-1">
                    {orderDetails.hasOwnProperty("buyerDetails")
                      ? orderDetails.buyerDetails.phone
                      : ""}
                  </div>
                  <div className="mt-1">
                    {orderDetails.hasOwnProperty("buyerDetails")
                      ? orderDetails.buyerDetails.address
                      : ""}
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 lg:ml-auto lg:text-right">
                  <div className="text-base text-slate-500">Receipt</div>
                  <div className="text-lg text-primary font-medium mt-2">
                    {orderDetails.invoiceNumber
                      ? orderDetails.invoiceNumber
                      : "N/A"}
                  </div>
                  <div className="mt-1">
                    {moment(orderDetails.orderPlaced)
                      .utc()
                      .format("DD-MMM-YYYY")}
                  </div>
                </div>
              </div>
              <div className="intro-y grid grid-cols-11 gap-5 mt-5">
                <div className="col-span-12 lg:col-span-12 2xl:col-span-12">
                  <div className="box p-5 rounded-md">
                    <div className="overflow-auto lg:overflow-visible -mt-3">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap !py-5">Product</th>
                            <th className="whitespace-nowrap text-right">
                              Unit Price
                            </th>
                            <th className="whitespace-nowrap text-right">
                              Qty
                            </th>
                            <th className="whitespace-nowrap text-right">
                              Unit of Measure
                            </th>
                            <th className="whitespace-nowrap text-right">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetails.hasOwnProperty("products")
                            ? $_.take(
                                orderDetails.products,
                                orderDetails.products.length
                              ).map((value, key) => (
                                <tr key={key}>
                                  <td className="!py-4">
                                    <div className="flex items-center">
                                      <a
                                        href=""
                                        className="font-medium whitespace-nowrap ml-4"
                                      >
                                        {value.prodRefId?.name || "N/A"}
                                      </a>
                                    </div>
                                  </td>
                                  <td className="text-right">
                                    {$h.formatCurrency(value.unit_price)}
                                  </td>
                                  <td className="text-right">
                                    {value.quantity}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {value.hasOwnProperty("prodRefId")
                                      ? value.prodRefId?.unitOfMeasure || "N/A"
                                      : null}
                                  </td>
                                  <td className="text-right">
                                    {$h.formatCurrency(
                                      value.unit_price * value.quantity
                                    )}
                                  </td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 sm:px-20 pb-10 sm:pb-10 flex flex-col-reverse sm:flex-row mt-4">
                <div className="text-center sm:text-left mt-10 sm:mt-0 ">
                  <div className="text-base text-slate-500">Bank Transfer</div>
                  <div className="text-lg text-primary font-medium mt-2">
                    {import.meta.env.VITE_BANK_ACCOUNT_HOLDER_NAME}
                  </div>
                  <div className="mt-1">
                    Bank Account : {import.meta.env.VITE_BANK_ACCOUNT_NUMBER}
                  </div>
                  <div className="mt-1">
                    Code : {import.meta.env.VITE_BANK_ACCOUNT_CODE}
                  </div>
                </div>
                <div className="text-center sm:text-right sm:ml-auto">
                  <div className="mt-1">VAT included</div>
                  <div className="text-xl text-primary font-small mt-1">
                    {$h.formatCurrency($h.CalculateVat(orderDetails))}
                  </div>
                  <div className="text-base text-slate-500 mt-2">
                    Total Amount
                  </div>
                  <div className="text-xl text-primary font-medium mt-1">
                    {$h.formatCurrency(
                      $h.FindTotal(orderDetails) + $h.CalculateVat(orderDetails)
                    )}
                  </div>
                </div>
              </div>
              {isPayNowVisible ? (
                <div>
                  <StripePayButton cartItems={orderDetails} />
                </div>
              ) : null}
            </div>
            {/* END: Invoice */}
          </>
        </ModalBody>
      </Modal>
      <Modal
        show={deleteConfirmationModal.show}
        onHidden={() => {
          setDeleteConfirmationModal({
            show: false,
            id: null,
          });
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="Repeat"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to re-create this order <br />
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal({
                  show: false,
                  id: null,
                });
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success w-24"
              onClick={() => {
                handleReOrder(deleteConfirmationModal.id);
              }}
            >
              Create
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
