import * as $_ from "lodash";

import { helper as $h, keyValue as kv } from "@/utils";
import {
  Litepicker,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  Tippy,
} from "@/base-components";
import {
  deleteSourcing as onDeleteSourcing,
  getSourcing as onGetSourcing,
  getSpecificSourcing as onGetSpecificSourcing,
} from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Columns from "./Columns.jsx";
import Constants from "../../constants/Constants.js";
import { ReactTabulator } from "react-tabulator";
import Select from "react-select";
import alternateImage from "@/assets/images/gallery.png";
import classnames from "classnames";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [getOrderId, setOrderId] = useState("");
  const [getDateRange, setDateRange] = useState("");
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

  const {
    sourcings,
    sourcing,
    loadingForUpdate,
    updated,
    deleted,
    loadingForDelete,
  } = useSelector((state) => state.SourcingReducer);

  const [basicSlideOverPreview, setBasicSlideOverPreview] = useState(false);
  const [deleteModalPreview, setDeleteModalPreview] = useState({
    show: false,
    data: null,
  });

  useEffect(() => {
    if (updated || deleted) {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      dispatch(onGetSourcing(params));
    }
  }, [updated, deleted]);

  const onSelectPerPage = (e) => {
    setPerPage({ value: `${e.value}`, label: `${e.value}` });
    let param = `?perPage=${e.value}&page=1`;
    if (getCurrentPage !== 1) {
      setCurrentPage(1);
    } else {
      dispatch(onGetSourcing(param));
    }
  };

  useEffect(() => {
    let param = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
    dispatch(onGetSourcing(param));
  }, [dispatch, getCurrentPage]);

  useEffect(() => {
    if (getCurrentOrderId.event) {
      let param = `/${getCurrentOrderId.value}`;
      dispatch(onGetSpecificSourcing(param));
      setCurrentOrderId({ value: "", event: false });
    }
  }, [getCurrentOrderId.event]);

  const handleFilterFunction = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    var date = getDateRange.split("-");
    param += getOrderId ? `&id=${getOrderId}` : "";
    param += getPaymentStatus.value != "" ? `&status=${getPaymentStatus}` : "";
    param +=
      date[0] != date[1]
        ? `&documentDate=${getDateRange.replace(/\s+/g, "")}`.replace("-", "to")
        : "";
    dispatch(onGetSourcing(param));
  };

  const handleResetFilter = () => {
    setOrderId("");
    setPaymentStatus({
      value: "",
      label: "",
    });
    setDateRange("");

    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(onGetSourcing(param));
  };

  const optionTab = {};

  const handleOrderIdClick = (orderId) => {
    setBasicSlideOverPreview(true);
    setCurrentOrderId({
      value: `${orderId}`,
      event: true,
    });
  };
  const handleUpdateClick = (data) => {
    dispatch(onGetSpecificSourcing(`/${data.id}`));
    navigate(`/create-request-for-quotation?id=${data.id}&edit=true`);
  };

  const handleDeleteClick = (data) => {
    setDeleteModalPreview({ show: true, data: data.id });
  };

  const FilteredColumns = (Columns) => {
    if ($h.getRoleId() === Constants.ADMIN_ROLE_ID) {
      return Columns;
    } else if ($h.getRoleId() === Constants.USER_ROLE_ID) {
      return Columns.filter(
        (column) => column.field !== "vendorId" && column.field !== "name"
      );
    }
  };

  function getStatusBadge(status) {
    const statusMap = {
      draft: { bg: "bg-yellow-200", text: "yellow-700" },
      sent: { bg: "bg-blue-200", text: "blue-700" },
      rejected: { bg: "bg-red-200", text: "red-700" },
      approved: { bg: "bg-green-200", text: "green-700" },
    };

    const statusInfo = statusMap[status];

    if (statusInfo) {
      return (
        <span
          className={classnames(
            `${statusInfo.bg}`,
            `text-${statusInfo.text}`,
            "rounded",
            "px-2",
            "ml-1",
            "capitalize"
          )}
        >
          {status}
        </span>
      );
    }

    return null;
  }

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">REQUEST FOR QUOTATION</h2>
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
                options={kv.paymentStatus}
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
          <div
            className="btn btn-primary shadow-md mr-2 "
            onClick={() => navigate("/create-request-for-quotation")}
          >
            <Lucide icon="Plus" className="w-4 h-4 mr-2" />
            Create RFQ
          </div>
        </div>

        {sourcings?.docs?.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hidden">
            <ReactTabulator
              columns={FilteredColumns(
                Columns(
                  handleOrderIdClick,
                  handleUpdateClick,
                  handleDeleteClick
                )
              )}
              data={sourcings?.docs ?? []}
              options={optionTab}
            />
          </div>
        ) : (
          <div className="">
            <div className="flex flex-row items-center justify-center pt-10 pb-10">
              <Lucide icon="Info" className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-medium ">Requests Unavailable</h2>
            </div>
          </div>
        )}
        {sourcings?.docs?.length > 0 && (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {sourcings?.hasPrevPage ? (
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
                        onClick={() => setCurrentPage(sourcings?.prevPage)}
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(sourcings?.prevPage)}
                      >
                        {sourcings.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {sourcings?.page}
                  </a>
                </li>
                {sourcings?.hasNextPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(sourcings?.nextPage)}
                      >
                        {sourcings?.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => setCurrentPage(sourcings?.nextPage)}
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() => setCurrentPage(sourcings?.totalPages)}
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
        size="modal-xl"
        slideOver={true}
        show={basicSlideOverPreview}
        onHidden={() => {
          setBasicSlideOverPreview(false);
        }}
      >
        <ModalHeader className="p-5">
          <h1 className="font-medium text-lg mr-auto">RFQ Details</h1>
        </ModalHeader>
        <ModalBody>
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
                        <th className="whitespace-nowrap text-right">
                          Currency Code
                        </th>
                        <th className="whitespace-nowrap text-right">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourcing.hasOwnProperty("vendorQuoteLine")
                        ? $_.take(
                            sourcing.vendorQuoteLine,
                            sourcing.vendorQuoteLine.length
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
                                {$h.formatCurrency(value?.item?.unitPrice ?? 0)}
                              </td>
                              <td className="text-right">{value.quantity}</td>
                              <td className="text-right">{value?.uom?.name}</td>
                              <td className="text-right">
                                {value?.currencies?.currencyCode}
                              </td>
                              <td className="text-right">
                                {$h.formatCurrency(
                                  value?.item?.unitPrice * value.quantity ?? 0
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
          <div className="intro-y grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
              <div className=" box p-5 rounded-md mt-5">
                <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                  <div className="font-medium text-base truncate">
                    Request Details
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Quote Id: {sourcing.id}
                </div>

                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Document Date:
                  {moment(sourcing.documentDate, "YYYY-MM-DD").format(
                    "DD-MMM-YYYY"
                  )}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Currency :{" "}
                  {sourcing.currencies ? sourcing.currencies.name : "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clock"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Status : {getStatusBadge(sourcing?.status)}
                </div>
                {sourcing?.status === "rejected" &&
                sourcing?.statusChanges &&
                sourcing?.statusChanges?.length > 0 ? (
                  <div className="flex items-center mt-3 capitalize">
                    <Lucide
                      icon="Clock"
                      className="w-4 h-4 text-slate-500 mr-2"
                    />
                    Rejected Reason : {sourcing?.statusChanges[0]?.reason}
                  </div>
                ) : null}
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
                  {sourcing.vendorId ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Vendor Name : {"  "}
                  {sourcing?.vendor?.name ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Description : {"  "}
                  {sourcing.description ?? "N/A"}
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
                  <div className="ml-auto capitalize">
                    {sourcing.paymentMethods
                      ? sourcing.paymentMethods.name
                      : "N/A"}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Payment Term:
                  <div className="ml-auto capitalize">
                    {sourcing.paymentTerm ? sourcing.paymentTerm.name : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                // dispatch(updateSalesOrderStatus(changeStatusModal?.data));
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
              Do you really want to delete this Sourcing ? <br />
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
                dispatch(onDeleteSourcing(deleteModalPreview.data));
                setDeleteModalPreview({
                  show: false,
                  data: null,
                });

                // dispatch(onDeleteSalesOrderList(deleteModalPreview.data));
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
