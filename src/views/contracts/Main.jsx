import * as $_ from "lodash";

import {
  ActionsFormatter,
  AgreementStatusFormatter,
  CommitmentStatusFormatter,
  DateFormatter,
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
  deletePurchaseAgreement as onDeletePurchaseAgreement,
  getPurchaseAgreement as onGetPurchaseAgreement,
  getSpecificPurchaseAgreement as onGetSpecificPurchaseAgreement,
} from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { helper as $h } from "@/utils";
import Constants from "../../constants/Constants";
import Select from "react-select";
import alternateImage from "../../assets/images/gallery.png";
import { keyValue as kv } from "@/utils";
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
  const [getCommitmentStatus, setCommitmentStatus] = useState({
    value: "",
    label: "",
  });

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

  // const {
  //   purchaseAgreements,
  //   purchaseAgreement,
  //   loadingForUpdate,
  //   updated,
  //   deleted,
  //   loadingForDelete,
  // } = useSelector((state) => state.PurchaseOrderReducer);

  const {
    purchaseAgreements,
    purchaseAgreement,
    loadingForUpdate,
    updated,
    deleted,
    loadingForDelete,
  } = useSelector((state) => state.PurchaseAgreementReducer);

  useEffect(() => {
    let param = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
    dispatch(onGetPurchaseAgreement(param));
  }, [dispatch, getCurrentPage]);

  useEffect(() => {
    if (updated || deleted) {
      var params = `?perPage=${getPerPage.value}&page=${getCurrentPage}`;
      dispatch(onGetPurchaseAgreement(params));
    }
  }, [updated, deleted]);

  useEffect(() => {
    if (getCurrentOrderId.event) {
      let param = `/${getCurrentOrderId.value}`;
      dispatch(onGetSpecificPurchaseAgreement(param));
      setCurrentOrderId({ value: "", event: false });
    }
  }, [getCurrentOrderId.event]);

  const handleUpdateClick = (data) => {
    dispatch(onGetSpecificPurchaseAgreement(`/${data.id}`));
    navigate(`/create-contract?id=${data.id}&edit=true`);
  };

  const handleDeleteClick = (data) => {
    setDeleteModalPreview({ show: true, data: data.id });
  };

  const columns = [
    {
      title: "Contract ID",
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
      title: "Start Date",
      field: "startDate",
      sorter: "date",
      formatter: reactFormatter(<DateFormatter />),
    },
    {
      title: "End Date",
      field: "endDate",
      sorter: "date",
      formatter: reactFormatter(<DateFormatter />),
    },
    {
      title: "Contract Status",
      field: "agreementStatus",
      formatter: reactFormatter(<AgreementStatusFormatter />),
    },
    {
      title: "Commitment Status",
      field: "commitmentStatus",
      formatter: reactFormatter(<CommitmentStatusFormatter />),
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
          type="agreement"
        />
      ),
    },
  ];

  const paymentStatus = [
    { value: "paid", label: "Paid" },
    { value: "refund", label: "Refund" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const handleFilterFunction = () => {
    let param = `?perPage=${getPerPage.value}&page=1`;
    var date = getDateRange.split("-");
    // param += getOrderId ? `&id=${getOrderId}` : "";
    param +=
      getPaymentStatus.value != ""
        ? `&agreementStatus=${getPaymentStatus}`
        : "";
    param +=
      getCommitmentStatus.value != ""
        ? `&commitmentStatus=${getCommitmentStatus}`
        : "";
    param +=
      date[0] != date[1]
        ? `&dateRange=${getDateRange.replace(/\s+/g, "")}`.replace("-", "to")
        : "";
    dispatch(onGetPurchaseAgreement(param));
  };

  const handleResetFilter = () => {
    // setOrderId("");
    setPaymentStatus({
      value: "",
      label: "",
    });
    setCommitmentStatus({
      value: "",
      label: "",
    });

    setDateRange("");

    let param = `?perPage=${getPerPage.value}&page=1`;
    dispatch(onGetPurchaseAgreement(param));
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
      dispatch(onGetPurchaseAgreement(param));
    }
  };

  const optionTab = {};

  const FilteredColumns = (Columns) => {
    if ($h.getRoleId() === Constants.ADMIN_ROLE_ID) {
      return Columns;
    } else if ($h.getRoleId() === Constants.USER_ROLE_ID) {
      return Columns.filter(
        (column) =>
          column.field !== "vendorId" &&
          column.field !== "vendor.companyName" &&
          column.field !== "actions"
      );
    }
  };

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">CONTRACT</h2>
      </div>
      <div className="intro-y box p-5 mt-5 ">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start mb-9">
          <form id="tabulator-html-filter-form" className="xl:flex sm:mr-auto">
            <div className="sm:flex items-center sm:mr-4">
              <Litepicker
                value={getDateRange}
                placeholder="Search By Start Date"
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
                placeholder="Agreement Status"
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "1em",
                    color: "#A5B2C4",
                    fontWeight: 400,
                  }),
                }}
                className="form-control sm:w-50 mt-2 sm:mt-0 "
                value={getPaymentStatus.value}
                onChange={(e) => {
                  setPaymentStatus(e.value);
                }}
                options={kv.agreementStatusOptions}
              />
            </div>
            <div className="sm:flex items-center sm:mr-4">
              <Select
                className="form-control sm:w-50 mt-2 sm:mt-0 ml-5"
                placeholder="Commitment Status"
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "1em",
                    color: "#A5B2C4",
                    fontWeight: 400,
                  }),
                }}
                value={getCommitmentStatus.value}
                onChange={(e) => {
                  setCommitmentStatus(e.value);
                }}
                options={kv.commitmentStatusOptions}
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
          {$h.getRoleId() === Constants.ADMIN_ROLE_ID && (
            <div
              className="btn btn-primary shadow-md mr-2 "
              onClick={() => navigate("/create-contract")}
            >
              <Lucide icon="Plus" className="w-4 h-4 mr-2" />
              Create Contract
            </div>
          )}
        </div>
        {purchaseAgreements?.docs?.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hidden">
            <ReactTabulator
              columns={FilteredColumns(columns)}
              data={purchaseAgreements?.docs ?? []}
              options={optionTab}
            />
          </div>
        ) : (
          <div className="">
            <div className="flex flex-row items-center justify-center pt-10 pb-10">
              <Lucide icon="Info" className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-medium "> Contracts Unavailable</h2>
            </div>
          </div>
        )}
        {purchaseAgreements?.docs?.length > 0 && (
          <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-6">
            <nav className="w-full sm:w-auto sm:mr-auto">
              <ul className="pagination">
                {purchaseAgreements?.hasPrevPage ? (
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
                        onClick={() =>
                          setCurrentPage(purchaseAgreements?.prevPage)
                        }
                      >
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() =>
                          setCurrentPage(purchaseAgreements?.prevPage)
                        }
                      >
                        {purchaseAgreements.prevPage}
                      </a>
                    </li>
                  </>
                ) : null}
                <li className="page-item active">
                  <a className="page-link" href="#">
                    {purchaseAgreements?.page}
                  </a>
                </li>
                {purchaseAgreements?.hasNextPage ? (
                  <>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() =>
                          setCurrentPage(purchaseAgreements?.nextPage)
                        }
                      >
                        {purchaseAgreements?.nextPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() =>
                          setCurrentPage(purchaseAgreements?.nextPage)
                        }
                      >
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#123"
                        onClick={() =>
                          setCurrentPage(purchaseAgreements?.totalPages)
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
                Do you really want to delete this Purchase Order ? <br />
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
                dispatch(onDeletePurchaseAgreement(deleteModalPreview.data));

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
          <h1 className="text-lg font-medium mr-auto">Contract Details</h1>
        </ModalHeader>
        <ModalBody>
          <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
            <h2 className="text-base font-medium mr-auto">Products Details</h2>
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
                          Product Id
                        </th>
                        <th className="whitespace-nowrap text-right">
                          Quantity
                        </th>
                        <th className="whitespace-nowrap text-right">
                          Unit of Measure
                        </th>
                        <th className="whitespace-nowrap text-right">Site</th>
                        <th className="whitespace-nowrap text-right">
                          Warehouse
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseAgreement?.contractLine
                        ? $_.take(
                            purchaseAgreement.contractLine,
                            purchaseAgreement.contractLine.length
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
                                {value?.itemId ?? "N/A"}
                              </td>

                              <td className="text-right">
                                {value?.quantity ?? "N/A"}
                              </td>

                              <td className="text-right">
                                {value?.uom?.name ?? "N/A"}
                              </td>
                              <td className="text-right">
                                {value?.site?.name ?? "N/A"}
                              </td>
                              <td className="text-right">
                                {value?.warehouse?.name ?? "N/A"}
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
                    Contract Details
                  </div>
                </div>
                <div className="flex items-center">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Contract Id: {purchaseAgreement?.id ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Site : {purchaseAgreement?.site?.name ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Warehouse : {purchaseAgreement?.warehouse?.name ?? "N/A"}
                </div>

                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Currency : {purchaseAgreement?.currency?.name ?? "N/A"}
                </div>

                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Start Date :
                  {moment(purchaseAgreement.startDate)
                    .utc()
                    .format("DD-MMM-YYYY")}
                </div>

                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Calendar"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  End Date :
                  {moment(purchaseAgreement.endDate)
                    .utc()
                    .format("DD-MMM-YYYY")}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clock"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Agreement Status :{" "}
                  <AgreementStatusFormatter
                    cell={{
                      getValue: () => purchaseAgreement?.agreementStatus ?? "",
                    }}
                  />
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clock"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Commitment Status :{" "}
                  <CommitmentStatusFormatter
                    cell={{
                      getValue: () => purchaseAgreement.commitmentStatus,
                    }}
                  />
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
                  {purchaseAgreement?.vendor?.id ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Vendor Name : {"  "}
                  {purchaseAgreement?.vendor?.name ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Credit Limit : {"  "}
                  {purchaseAgreement?.vendor?.creditLimit ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Tax Registration Number : {"  "}
                  {purchaseAgreement?.vendor?.taxRegistrationNumber ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Billing Address : {"  "}
                  {purchaseAgreement?.vendor?.billingAddress ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Shipping Address : {"  "}
                  {purchaseAgreement?.vendor?.shippingAddress ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Email : {"  "}
                  {purchaseAgreement?.vendor?.email ?? "N/A"}
                </div>
                <div className="flex items-center mt-3">
                  <Lucide
                    icon="Clipboard"
                    className="w-4 h-4 text-slate-500 mr-2"
                  />
                  Phone Number : {"  "}
                  {purchaseAgreement?.vendor?.phoneNumber ?? "N/A"}
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
