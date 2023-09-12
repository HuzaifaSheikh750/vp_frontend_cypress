import * as $_ from "lodash";

import { helper as $h, keyValue as kv } from "@/utils";
import {
  ActionsFormatter,
  DateFormatter,
  PaymentStatusFormatter,
} from "../../utils/formaters";
import {
  Litepicker,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  Tippy,
} from "@/base-components";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import {
  deleteInvoice as onDeleteInvoice,
  getInvoice as onGetInvoice,
  getSpecificInvoice as onGetSpecificInvoice,
} from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import Constants from "../../constants/Constants";
import InvoiceTemplate from "../../components/invoice-template/Main.jsx";
import Select from "react-select";
import alternateImage from "../../assets/images/gallery.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef(null);

  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [getOrderId, setOrderId] = useState("");
  const [getDateRange, setDateRange] = useState("");
  const [getPaymentStatus, setPaymentStatus] = useState({
    value: "",
    label: "",
  });
  const [getVendorId, setVendorId] = useState("");

  const [getCurrentOrderId, setCurrentOrderId] = useState({
    value: "",
    event: false,
  });

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);
  const [deleteModalPreview, setDeleteModalPreview] = useState({
    show: false,
    data: null,
  });

  const [autoEditOverPreview, setAutoEditOverPreview] = useState({
    show: false,
    data: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [print, setPrint] = useState({
    show: false,
    id: null,
  });

  const handleOpenModal = (value) => {
    setModalOpen(value);
  };

  const {
    invoices,
    invoice,
    loadingForUpdate,
    updated,
    deleted,
    loadingForDelete,
  } = useSelector((state) => state.InvoiceReducer);

  useEffect(() => {
    let param = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
    dispatch(onGetInvoice(param));
  }, [dispatch, getCurrentPage]);

  useEffect(() => {
    if (updated || deleted) {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      dispatch(onGetInvoice(params));
    }
  }, [updated, deleted]);

  useEffect(() => {
    if (getCurrentOrderId.event) {
      let param = `/${getCurrentOrderId.value}`;
      dispatch(onGetSpecificInvoice(param));
      setCurrentOrderId({ value: "", event: false });
    }
  }, [getCurrentOrderId.event]);

  const handleUpdateClick = (data) => {
    dispatch(onGetSpecificInvoice(`/${data.id}`));
    navigate(`/create-invoice?id=${data.id}&mode=update`);
  };

  const handleDeleteClick = (data) => {
    setDeleteModalPreview({ show: true, data: data.id });
  };

  const handleGenerateInvoiceClick = (data) => {
    dispatch(onGetSpecificInvoice(`/${data.id}`));
    navigate(`/create-invoice?id=${data.id}&mode=create`);
  };

  useEffect(() => {
    if (print.show && invoice) {
      if (invoice.id === print.id) {
        handlePrint();
        // setModalOpen(true);
        setPrint({ show: false, id: null });
      } else if (invoice.id !== print.id) {
        dispatch(onGetSpecificInvoice(`/${print.id}`));
      } else if (!invoice) {
        dispatch(onGetSpecificInvoice(`/${print.id}`));
      }
    }
  }, [invoice]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrintClick = (data) => {
    setPrint({ show: true, id: data.id });
    dispatch(onGetSpecificInvoice(`/${data.id}`));
    // handlePrint();
  };

  const columns = [
    {
      title: "Invoice ID",
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
      title: "Company Name",
      field: "vendor.companyName",
    },
    {
      title: "Due Date",
      field: "dueDate",
      sorter: "date",
      formatter: reactFormatter(<DateFormatter />),
    },

    {
      title: "Payment Status",
      field: "paymentStatus",
      formatter: reactFormatter(<PaymentStatusFormatter />),
    },
    {
      title: "Total Amount",
      field: "totalAmount",
      sorter: "number",
    },
    {
      title: "Payment Terms",
      field: "paymentTerm.name",
      sorter: "number",
    },
    {
      title: "Payment Method",
      field: "paymentMethod.name",
      sorter: "number",
    },
    {
      title: "Actions",
      field: "actions",
      headerHozAlign: "center",
      width: 220,
      formatter: reactFormatter(
        <ActionsFormatter
          handleButtonClick={handleUpdateClick}
          handleDeleteClick={handleDeleteClick}
          handleGenerateInvoiceClick={handleGenerateInvoiceClick}
          handlePrintClick={handlePrintClick}
          type="invoice"
        />
      ),
    },
  ];

  const handleFilterFunction = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    var date = getDateRange.split("-");
    param += getOrderId ? `&id=${getOrderId}` : "";
    param +=
      getPaymentStatus.value != "" ? `&paymentStatus=${getPaymentStatus}` : "";
    param += getVendorId ? `&vendorId=${getVendorId}` : "";
    param +=
      date[0] != date[1]
        ? `&invoiceDate=${getDateRange.replace(/\s+/g, "")}`.replace("-", "to")
        : "";
    dispatch(onGetInvoice(param));
  };

  const handleResetFilter = () => {
    setOrderId("");
    setPaymentStatus({
      value: "",
      label: "",
    });
    setDateRange("");

    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(onGetInvoice(param));
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

  const onSelectPerPage = (e) => {
    setPerPage({ value: `${e.value}`, label: `${e.value}` });
    let param = `?perPage=${e.value}&page=1`;
    if (getCurrentPage !== 1) {
      setCurrentPage(1);
    } else {
      dispatch(onGetInvoice(param));
    }
  };

  const optionTab = {};

  const FilteredColumns = (Columns) => {
    if ($h.getRoleId() === Constants.ADMIN_ROLE_ID) {
      return Columns;
    } else if ($h.getRoleId() === Constants.USER_ROLE_ID) {
      return Columns.filter(
        (column) =>
          column.field !== "vendorId" && column.field !== "vendor.companyName"
      );
    }
  };

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">INVOICES</h2>
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
                  placeholder="Search By Invoice Id"
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
              <div className="w-48 relative text-slate-500 ">
                <input
                  id="tabulator-html-filter-value"
                  type="text"
                  className="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
                  placeholder="Search By Vendor Id"
                  value={getVendorId}
                  onChange={(e) => {
                    setVendorId(e.target.value);
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
                placeholder="Search By invoice Date"
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
                placeholder="Payment Status"
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
                options={kv.paymentStatusOptions}
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
        </div>
        {invoices?.docs?.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hidden">
            <ReactTabulator
              columns={FilteredColumns(columns)}
              data={invoices?.docs ?? []}
              options={optionTab}
            />
          </div>
        ) : (
          <div className="">
            <div className="flex flex-row items-center justify-center pt-10 pb-10">
              <Lucide icon="Info" className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-medium "> Invoices Unavailable</h2>
            </div>
          </div>
        )}
        {invoices?.docs?.length > 0 && (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {invoices?.hasPrevPage ? (
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
                        onClick={() => setCurrentPage(invoices?.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(invoices?.prevPage)}
                      >
                        {invoices.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {invoices?.page}
                  </a>
                </li>
                {invoices?.hasNextPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(invoices?.nextPage)}
                      >
                        {invoices?.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(invoices?.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(invoices?.totalPages)}
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
              onChange={(e) => onSelectPerPage(e)}
              options={kv.optionsPerPage}
            />
          </div>
        )}
      </div>
      <Modal
        backdrop={loadingForDelete ? "static" : ""}
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
              <div className="text-3xl mt-5">Are you sure?</div>
              <div className="text-slate-500 mt-2">
                Do you really want to delete this Invoice ? <br />
                This process cannot be undone.
              </div>
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
                dispatch(onDeleteInvoice(deleteModalPreview.data));

                setDeleteModalPreview({
                  show: false,
                  data: null,
                });
              }}
            >
              Proceed
            </button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop={loadingForUpdate ? "static" : ""}
        show={autoEditOverPreview.isOpen}
        onHidden={() => {
          setAutoEditOverPreview({
            isOpen: false,
            data: null,
          });
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            {loadingForUpdate ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-5">
                <div className="text-2xl mt-5 mb-3">
                  Please wait <br /> while we are processing your request
                </div>
              </div>
            ) : (
              <div>
                <Lucide
                  icon="PackageCheck"
                  className="w-16 h-16 text-success mx-auto mt-3"
                />
                <div className="text-3xl mt-5">Are you sure?</div>
                <div className="text-slate-500 mt-2">
                  Do you really want to assign this schedule to this user?
                  <br />
                  This process cannot be undone.
                </div>
              </div>
            )}
          </div>
          {loadingForUpdate ? null : (
            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                onClick={() => {
                  autoEditOverPreview.data.done(false);
                  setAutoEditOverPreview({
                    isOpen: false,
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
                // onClick={() => handleTruckIdChange()}
              >
                Proceed
              </button>
            </div>
          )}
        </ModalBody>
      </Modal>
      <Modal
        size="modal-xl"
        slideOver={true}
        show={basicSlideOverPreview}
        onHidden={() => {
          setBasicSlideOverPreview(false);
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="font-medium text-lg mr-auto">Invoice Details</h1>
        </ModalHeader>
        <ModalBody>
          {invoice?.invoiceLine?.length > 0 ? (
            <>
              <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                <h2 className="text-base font-medium mr-auto">
                  Products Details
                </h2>
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
                            <th className="text-right">Unit Price</th>

                            <th className="text-center">Quantity</th>

                            <th className="text-center">Unit of Measure</th>
                            <th className="whitespace-nowrap text-right">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice?.invoiceLine
                            ? $_.take(
                                invoice.invoiceLine,
                                invoice.invoiceLine.length
                              ).map((value, key) => (
                                <tr key={key}>
                                  <td className="!py-4">
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 image-fit zoom-in">
                                        <Tippy
                                          tag="img"
                                          className="rounded-lg border-2 border-white shadow-md tooltip"
                                          src={
                                            value.item.imageUrl ??
                                            alternateImage
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

                                  <td className="text-right">
                                    {value?.quantity ?? "N/A"}
                                  </td>

                                  <td className="text-right">
                                    {value?.uom?.name ?? "N/A"}
                                  </td>
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
            </>
          ) : (
            <div className="flex flex-row items-center justify-center pt-10 pb-10">
              <Lucide icon="Info" className="w-6 h-6 mr-2" />
              <h2 className="text-base font-medium "> Products Unavailable</h2>
            </div>
          )}

          <div className="intro-y grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className=" box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">Details</div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Invoice Id: {invoice?.id ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Purchase Order Id: {invoice?.purchaseOrderId ?? "N/A"}
                </div>

                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Currency : {invoice?.currency?.name ?? "N/A"}
                </div>

                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Due Date :
                  {moment(invoice.dueDate).utc().format("DD-MMM-YYYY")}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clock"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Status:
                  {invoice.paymentStatus === "unpaid" ? (
                    <span className="bg-danger/20 text-danger rounded px-2 ml-1 capitalize">
                      {invoice.paymentStatus}
                    </span>
                  ) : (
                    <span className="bg-success/20 text-success rounded px-2 ml-1 capitalize">
                      {invoice.paymentStatus}
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
                  {invoice.vendorId ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Vendor Name : {"  "}
                  {invoice?.vendor?.name ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Comment : {"  "}
                  {invoice.comment ?? "N/A"}
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
                  Shipping Address:
                  <div className="ml-auto capitalize">
                    {invoice?.shippingAddress ?? "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Payment Method:
                  <div className="ml-auto capitalize">
                    {invoice?.paymentMethod?.name ?? "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2 "
                  />
                  Payment Term:
                  <div className="ml-auto capitalize">
                    {invoice?.paymentTerm?.name ?? "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Tax Rate
                  <div className="ml-auto">
                    {invoice.taxRate ? invoice.taxRate : 0}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="CreditCard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Tax Type
                  <div className="ml-auto">
                    {invoice.taxType ? invoice.taxType : 0}
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
                      invoice.taxAmount ? invoice.taxAmount : 0
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
                      invoice.discountAmount ? invoice.discountAmount : 0
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
                      invoice.discountPercentage
                        ? invoice.discountPercentage
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
                      invoice.totalExclTax ? invoice.totalExclTax : 0
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
                      invoice.totalAmount ? invoice.totalAmount : 0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <InvoiceTemplate
        componentRef={componentRef}
        modalOpen={modalOpen}
        setModalOpen={handleOpenModal}
        invoice={invoice}
      />
    </>
  );
}

export default Main;
