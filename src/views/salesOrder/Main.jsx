import * as $_ from "lodash";

import { Edit2, Trash } from "react-feather";
import { ConstructJSON as JsonData, keyValue as kv } from "@/utils";
import {
  Litepicker,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  Tippy,
  TippyContent,
} from "@/base-components";
import {
  OrderStatusFormatter,
  PaymentStatusFormatter,
  pmidFormatter,
} from "../../utils/formaters.jsx";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { createRef, useEffect, useRef, useState } from "react";
import {
  getAllOrders,
  addNewSalesOrderList as onAddNewSalesOrderList,
  deleteSalesOrderList as onDeleteSalesOrderList,
  getOrderDetails as onGetOrderDetails,
  getSalesOrderList as onGetSalesOrderList,
  updateSalesOrderList as onUpdateSalesOrderList,
  updateSalesOrderStatus,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { helper as $h } from "@/utils";
import { ExportJsonCsv } from "react-export-json-csv";
import Select from "react-select";
import alternateImage from "../../assets/images/gallery.png";
import classnames from "classnames";
import moment from "moment";
import xlsx from "xlsx";

function Main() {
  const TAG = "SALES_ORDER_LIST";

  const dispatch = useDispatch();

  const { salesOrderList } = useSelector((state) => ({
    salesOrderList: state.SalesOrderListReducer?.salesOrderLists,
  }));

  const { allOrders } = useSelector((state) => ({
    allOrders: state.OrderManagementReducer?.allOrders,
  }));

  const { orderDetails } = useSelector((state) => ({
    orderDetails: state.OrderManagementReducer?.orderDetailsState,
  }));

  const { updated, deleted } = useSelector(
    (state) => state.SalesOrderListReducer
  );

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);

  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [getSalesOrderList, setSalesOrderList] = useState([]);
  const [getOrderDetails, setOrderDetails] = useState([]);

  const [getOrderId, setOrderId] = useState("");
  const [getDateRange, setDateRange] = useState("");
  const [getStatus, setStatus] = useState({
    value: "",
    label: "",
  });
  const [getPaymentStatus, setPaymentStatus] = useState({
    value: "",
    label: "",
  });

  const [changeStatusModal, setChangeStatusModal] = useState({
    show: false,
    data: null,
  });

  const [getCurrentOrderId, setCurrentOrderId] = useState({
    value: "",
    event: false,
  });

  const [deleteModalPreview, setDeleteModalPreview] = useState({
    show: false,
    data: null,
  });

  useEffect(() => {
    if (updated || deleted) {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      dispatch(onGetSalesOrderList(params));
    }
  }, [updated, deleted]);

  useEffect(() => {
    var date = getDateRange.split("-");

    if (getPerPage.value != salesOrderList.limit) {
      setCurrentPage(1);
      var params = `?perPage=${getPerPage.value}&page=1`;
      params += getOrderId ? `&name=${getOrderId}` : "";
      params += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
      params +=
        getPaymentStatus.value != ""
          ? `&invoiceStatus=${getPaymentStatus}`
          : "";
      params +=
        date[0] != date[1]
          ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`
          : "";
    } else {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      params += getOrderId ? `&orderId=${getOrderId}` : "";
      params += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
      params +=
        getPaymentStatus.value != ""
          ? `&invoiceStatus=${getPaymentStatus}`
          : "";
      params +=
        date[0] != date[1]
          ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`
          : "";
    }
    if (salesOrderList.hasOwnProperty("message")) {
    } else if (
      !salesOrderList.hasOwnProperty("docs") ||
      getCurrentPage != salesOrderList.page ||
      getPerPage.value != salesOrderList.limit
    )
      dispatch(onGetSalesOrderList(params));

    setSalesOrderList(salesOrderList);
  }, [dispatch, getCurrentPage, getPerPage]);

  // useEffect(() => {
  //   if (!allOrders.length) {
  //     dispatch(getAllOrders());
  //   }
  // }, [allOrders]);

  useEffect(() => {
    if (getCurrentOrderId.event) {
      let param = `/${getCurrentOrderId.value}`;
      dispatch(onGetOrderDetails(param));

      setCurrentOrderId({ value: "", event: false });
    }
    setOrderDetails(orderDetails);
  }, [getCurrentOrderId.event, getOrderDetails]);

  const ActionFormatter = (props) => {
    const orderStatusCell = props.cell._cell.row.data.orderStatus;

    return orderStatusCell === "approval" ? (
      <div className="flex items-center">
        <button
          className="btn btn-icon btn-sm btn-primary"
          onClick={() => {
            setChangeStatusModal({
              show: true,
              data: props.cell._cell.row.data._id,
            });
          }}
        >
          Change Status
        </button>
      </div>
    ) : null;
  };

  const columns = [
    {
      title: "Quote ID",
      field: "id",
      sorter: "number",
      formatter: reactFormatter(<OrderIdFormatter />),
    },
    {
      title: "Vendor ID",
      field: "vendorId",
      sorter: "number",
    },
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Document ID",
      field: "vendorDocumentNum",
    },
    {
      title: "Document Date",
      field: "documentDate",
      sorter: "date",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Total Amount",
      field: "totalAmount",
      sorter: "number",
    },
    {
      title: "Payment Terms",
      field: "paymentTerms",
      sorter: "number",
    },
    {
      title: "Payment Method",
      field: "paymentMethod",
      sorter: "number",
    },
  ];
  // const columns = [
  //   {
  //     title: "User Name",
  //     field: "userName",
  //     formatter: reactFormatter(<UserNameFormatter />)
  //   },
  //   {
  //     title: "Order ID",
  //     field: "orderId",
  //     formatter: reactFormatter(<OrderIdFormatter />)
  //   },
  //   {
  //     title: "Description",
  //     field: "description",
  //     formatter: reactFormatter(<DescriptionFormatter />)
  //   },
  //   {
  //     title: "Date Placed",
  //     field: "orderPlaced",
  //     formatter: pmidFormatter
  //   },
  //   { title: "Total Quantity", field: "totalQuantity" },
  //   {
  //     title: "Order Status",
  //     field: "orderStatus",
  //     formatter: reactFormatter(<OrderStatusFormatter />)
  //   },
  //   {
  //     title: "Payment Status",
  //     field: "invoiceStatus",
  //     formatter: reactFormatter(<PaymentStatusFormatter />)
  //   },
  //   {
  //     title: "Change Status",
  //     field: "action",
  //     formatter: reactFormatter(<ActionFormatter />)
  //   },
  //   {
  //     title: "Action",
  //     field: "Delete",
  //     formatter: reactFormatter(<DeleteFormatter />)
  //   }
  // ];

  const paymentStatus = [
    { value: "paid", label: "Paid" },
    { value: "refund", label: "Refund" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const orderStatus = [
    { value: "approval", label: "Awaiting Approval" },
    { value: "approved", label: "Approved" },
    { value: "processing", label: "Processing" },
    { value: "packing", label: "Packing" },
    { value: "shipping", label: "Shipping" },
    { value: "delivered", label: "Delivered" },
  ];

  const handleFilterFunction = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    var date = getDateRange.split("-");
    param += getOrderId ? `&name=${getOrderId}` : "";
    param +=
      getPaymentStatus.value != "" ? `&invoiceStatus=${getPaymentStatus}` : "";
    param += getStatus.value != "" ? `&orderStatus=${getStatus}` : "";
    param +=
      date[0] != date[1]
        ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`
        : "";
    dispatch(onGetSalesOrderList(param));
  };

  const handleResetFilter = () => {
    setOrderId("");
    setPaymentStatus({
      value: "",
      label: "",
    });
    setDateRange("");
    setStatus({ value: "", label: "" });

    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(onGetSalesOrderList(param));
  };

  function OrderIdFormatter(props) {
    const orderId = props.cell._cell.row.data.id;

    return (
      <div
        className="underline decoration-dotted whitespace-nowrap"
        onClick={() => {
          setBasicSlideOverPreview(true);
          setCurrentOrderId({
            value: `${orderId}`,
            event: true,
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

  function UserNameFormatter(props) {
    const userName = props.cell._cell.row.data.userRefId.name;

    return <div>{userName ? userName : "N/A"}</div>;
  }

  function DeleteFormatter(props) {
    const orderStatusCell = props.cell._cell.row.data.orderStatus;
    const orderId = props.cell._cell.row.data.orderId;

    return orderStatusCell === "approval" ? (
      <div className="flex items-center">
        <button
          className="btn btn-secondary btn-sm w-full sm:w-17 mt-2 sm:mt-0 mr-2 ml-2"
          onClick={() => {
            setDeleteModalPreview({
              show: true,
              data: orderId,
            });
          }}
        >
          <Trash className="font-medium-2 mr-2" size={15} />
          Delete
        </button>
      </div>
    ) : null;
  }

  const optionTab = {};

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">VENDOR QUOTATION</h2>
      </div>
      <div className="intro-y box p-5 mt-5">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start mb-9">
          <form id="tabulator-html-filter-form" className="xl:flex sm:mr-auto">
            <div className="sm:flex items-center sm:mr-4">
              <div className="w-48 relative text-slate-500 ">
                <input
                  id="tabulator-html-filter-value"
                  type="text"
                  className="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
                  placeholder="Search By Quote Id"
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
            </div>
            <div className="sm:flex items-center sm:mr-4">
              <Litepicker
                value={getDateRange}
                placeholder="Search By Document Date"
                onChange={setDateRange}
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

            <div className="sm:flex items-center sm:mr-4">
              <Select
                placeholder="Status"
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "1em",
                    color: "#A5B2C4",
                    fontWeight: 400,
                  }),
                }}
                className="form-control sm:w-40 mt-2 sm:mt-0 "
                value={getPaymentStatus.value}
                onChange={(e) => {
                  setPaymentStatus(e.value);
                }}
                options={paymentStatus}
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
                <Lucide icon="Download" className="w-4 h-4 mr-2" /> Export to
                CSV
              </ExportJsonCsv>
            ) : null}
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hidden">
          <ReactTabulator
            columns={columns}
            data={salesOrderList.docs}
            options={optionTab}
          />
        </div>
        {/* BEGIN: Pagination */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              {salesOrderList.hasPrevPage ? (
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
            onChange={(e) =>
              setPerPage({ value: `${e.value}`, label: `${e.value}` })
            }
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
          <h1 className="font-medium text-base mr-auto">Quotation Details</h1>
        </ModalHeader>
        <ModalBody>
          {/* <div className="flex items-center mt-8">
            <h2 className="intro-y text-lg font-medium mr-auto">Shipping Status</h2>
      </div>*/}
          {/* BEGIN: Wizard Layout */}
          {/*<div className="intro-y box py-10">
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
                </div>*/}
          <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
            <h2 className="text-lg font-medium mr-auto">Products Details</h2>
            <div className="w-full sm:w-auto flex mt-4 sm:mt-0"></div>
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
                        <th className="whitespace-nowrap text-right">Qty</th>
                        <th className="whitespace-nowrap text-right">
                          Unit of Measure
                        </th>
                        <th className="whitespace-nowrap text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.hasOwnProperty("vendorQuoteLine")
                        ? $_.take(
                            orderDetails.vendorQuoteLine,
                            orderDetails.vendorQuoteLine.length
                          ).map((value, key) => (
                            <tr key={key}>
                              <td className="!py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 image-fit zoom-in">
                                    <Tippy
                                      tag="img"
                                      className="rounded-lg border-2 border-white shadow-md tooltip"
                                      src={
                                        value.item.imageUrl ?? alternateImage
                                      }
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = alternateImage;
                                      }}
                                    />
                                  </div>
                                  <a
                                    href=""
                                    className="font-medium whitespace-nowrap ml-4"
                                  >
                                    {value?.item?.name ?? "N/A"}
                                  </a>
                                </div>
                              </td>
                              <td className="text-right">
                                {$h.formatCurrency(value.unitCost) ?? "N/A"}
                              </td>
                              <td className="text-right">{value.quantity}</td>
                              <td className="text-right">{value.uomId}</td>
                              <td className="text-right">
                                {$h.formatCurrency(value.lineAmount)}
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
          <div className="intro-y grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className=" box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">
                    Quote Details
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Quote Id: {orderDetails.id}
                </div>

                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Document Date:
                  {moment(orderDetails.documentDate)
                    .utc()
                    .format("DD-MMM-YYYY")}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clock"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Status:
                  {orderDetails.status == "unpaid" ? (
                    <span className="bg-danger/20 text-danger rounded px-2 ml-1 capitalize">
                      {$h.capitalizeFirstLetter(orderDetails.status)}
                    </span>
                  ) : (
                    <span className="bg-success/20 text-success rounded px-2 ml-1 capitalize">
                      {$h.capitalizeFirstLetter(orderDetails.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className="box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">
                    Vendor Details
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Vendor Id : {"  "}
                  {orderDetails.vendorId ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Vendor Name : {"  "}
                  {orderDetails.name ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Description : {"  "}
                  {orderDetails.description ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Vendor Document Id : {orderDetails.vendorDocumentNum ?? "N/A"}
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
                    {orderDetails.paymentMethods
                      ? orderDetails.paymentMethods.name
                      : "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Payment Term:
                  <div className="ml-auto">
                    {orderDetails.paymentTerms
                      ? orderDetails.paymentTerms
                      : "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Tax Amount
                  <div className="ml-auto">
                    {$h.formatCurrency(
                      orderDetails.taxAmount ? orderDetails.taxAmount : 0
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Discount Amount
                  <div className="ml-auto">
                    {$h.formatCurrency(
                      orderDetails.discountAmount
                        ? orderDetails.discountAmount
                        : 0
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Discount Percentage
                  <div className="ml-auto">
                    {$h.formatCurrency(
                      orderDetails.discountPercentage
                        ? orderDetails.discountPercentage
                        : 0
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Total Excluding Tax
                  <div className="ml-auto">
                    {$h.formatCurrency(
                      orderDetails.totalExclTax ? orderDetails.totalExclTax : 0
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
                      orderDetails.totalAmount ? orderDetails.totalAmount : 0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: Transaction Details */}
          {/* END: Wizard Layout */}
        </ModalBody>
      </Modal>
      <Modal
        show={changeStatusModal.show}
        onHidden={() => {
          setChangeStatusModal({
            show: false,
            data: null,
          });
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="CheckCircle"
              className="w-16 h-16 text-success mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you want to update status to{" "}
              <span className="font-medium">{"Approved"}</span>
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              className="btn btn-primary w-24 mr-3"
              onClick={() => {
                dispatch(updateSalesOrderStatus(changeStatusModal?.data));
                setChangeStatusModal({
                  show: false,
                  data: null,
                });
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                setChangeStatusModal({
                  show: false,
                  data: null,
                });
              }}
              className="btn btn-outline-secondary w-24"
            >
              No
            </button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
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
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
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
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger w-24"
              onClick={() => {
                setDeleteModalPreview({
                  show: false,
                  data: null,
                });
                dispatch(onDeleteSalesOrderList(deleteModalPreview.data));
              }}
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Main;
