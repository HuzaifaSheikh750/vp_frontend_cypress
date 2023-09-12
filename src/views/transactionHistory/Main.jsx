import * as $_ from "lodash";

import { helper as $h, ConstructJSON as JsonData, keyValue as kv } from "@/utils";
import { CapitalizeFormatter, SimpleButton, pmidFormatter , PaymentStatusFormatter,
} from "../../utils/formaters.jsx";
import { Litepicker, Lucide } from "@/base-components";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import {
  exportTotalTransactions,
  getTransactionHistory as onGetTransactionHistory,
  saveInvoiceFilters
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { ExportJsonCsv } from "react-export-json-csv";
import Select from "react-select";
import jsPDF from "jspdf";
import moment from "moment";

function Main() {
  const TAG = "TRANSACTION_HISTORY";

  const dispatch = useDispatch();

  const { transactionHistory } = useSelector((state) => ({
    transactionHistory: state.TransactionHistoryReducer.TransactionHistorys
  }));

  const { SavedDateRange, SavedPaymentId } = useSelector(
    (state) => state.TransactionHistoryReducer
  );

  const [getTransactionHistory, setTransactionHistory] = useState([]);
  const [getCurrentPage, setCurrentPage] = useState(1);
  const [getPerPage, setPerPage] = useState({ value: "10", label: "10" });
  const [getPaymentId, setPaymentId] = useState(SavedPaymentId);
  const [getDateRange, setDateRange] = useState(SavedDateRange);

  useEffect(() => {
    var date = getDateRange.split("-");

    if (getPerPage.value != transactionHistory.limit) {
      setCurrentPage(1);
      var params = `?invoiceStatus=paid&perPage=${getPerPage.value}&page=1`;

      params += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}` : "";
      params += getPaymentId ? `&invoiceId=${getPaymentId}` : "";
    } else {
      var params = `?invoiceStatus=paid&perPage=${getPerPage.value}&page=${getCurrentPage}`;

      params += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}` : "";
      params += getPaymentId ? `&invoiceId=${getPaymentId}` : "";
    }

    if (transactionHistory.hasOwnProperty("message")) {
    } else if (
      !transactionHistory.hasOwnProperty("docs") ||
      getCurrentPage != transactionHistory.page ||
      getPerPage.value != transactionHistory.limit
    ) {
      dispatch(onGetTransactionHistory(params));
    }

    setTransactionHistory(transactionHistory);
  }, [dispatch, getCurrentPage, getPerPage]);


  const handleFilterFunction = () => {
    let param = `?invoiceStatus=paid&perPage=${getPerPage.value}&page=1`;

    var date = getDateRange.split("-");

    param += date[0] != date[1] ? `&dateRange=${getDateRange.replace(/\s+/g, "")}` : "";
    param += getPaymentId ? `&invoiceId=${getPaymentId}` : "";

    dispatch(
      saveInvoiceFilters({
        dateRange: getDateRange,
        paymentId: getPaymentId,
        paymentStatus: ""
      })
    );

    dispatch(onGetTransactionHistory(param));
    setTransactionHistory(transactionHistory);
  };


  function DescriptionFormatter(props) {
    const description = props.cell._cell.row.data.invoiceNumber;

    return <div>{description ? description : "N/A"}</div>;
  }

  function OrderIdFormatter(props) {
    const orderId = props.cell._cell.row.data.orderId;

    return (
      <div
      // onClick={() => {
      //   setBasicSlideOverPreview(true);
      //   setCurrentOrderId({
      //     value: `${orderId}`,
      //     event: true
      //   });
      // }}
      >
        {orderId}
      </div>
    );
  }



  const handleResetFilter = () => {
    setPaymentId("");
    setDateRange("");
    let param = `?invoiceStatus=paid&perPage=${getPerPage}&page=1`;

    dispatch(
      saveInvoiceFilters({
        dateRange: "",
        paymentId: "",
        paymentStatus: ""
      })
    );

    dispatch(onGetTransactionHistory(param));
    setTransactionHistory(transactionHistory);
  };


  const columns = [
    {
      title: "INVOICE ID",
      field: "invoiceNumber",
      formatter: reactFormatter(<DescriptionFormatter />)
    },
    { title: "Order ID", field: "orderId", formatter: reactFormatter(<OrderIdFormatter />) },

    { title: "Total Quantity", field: "totalQuantity" },
    {
      title: "DATE",
      field: "orderPlaced",
      formatter: pmidFormatter
    },
    {
      title: "INVOICE STATUS",
      field: "invoiceStatus",
      with: 20,
      formatter: reactFormatter(<PaymentStatusFormatter />)
    },
    {
      title: "DEBIT",
      field: "debit",
      sorter: "string",
      headerSort: false,
      formatter: reactFormatter(<SimpleButton />)
    },
    {
      title: "CREDIT",
      field: "credit",
      sorter: "string",
      headerSort: false,
      formatter: reactFormatter(<SimpleButton />)
    }
  ];

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">TRANSACTION HISTORY</h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0"></div>
      </div>
      {/* BEGIN: HTML Table Data */}
      <div className="intro-y box p-5 mt-5">
        <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
          <form id="tabulator-html-filter-form" className="xl:flex sm:mr-auto mb-8">
            <div className="w-48 relative text-slate-500 sm:flex items-center sm:mr-4">
              {/* <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">
                Invoice Id :
              </label> */}
              <input
                id="tabulator-html-filter-value"
                type="text"
                className="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0"
                placeholder="Search by Invoice Id"
                value={getPaymentId}
                onChange={(e) => {
                  setPaymentId(e.target.value);
                }}
              />
              <Lucide icon="Search" className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
            </div>
            <div className="sm:flex items-center sm:mr-4">
              <Litepicker
                onChange={setDateRange}
                value={getDateRange}
                placeholder="Search By Date Placed"
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

            <div className="mt-2 xl:mt-0">
              <button
                id="tabulator-html-filter-go"
                type="button"
                className="btn btn-primary w-full sm:w-16 ml-3"
                onClick={() => handleFilterFunction()}
              >
                Filter
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
          </form>
        
        </div>
        <div className="overflow-x-auto scrollbar-hidden">
          <ReactTabulator columns={columns} data={transactionHistory?.docs} />
        </div>
        {/* BEGIN: Pagination */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-10">
          <nav className="w-full sm:w-auto sm:mr-auto">
            <ul className="pagination">
              {transactionHistory.hasPrevPage ? (
                <div>
                  <li className="page-item">
                    <a className="page-link" href="#123" onClick={() => setCurrentPage(1)}>
                      <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(transactionHistory.prevPage)}
                    >
                      <Lucide icon="ChevronLeft" className="w-4 h-4" />
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(transactionHistory.prevPage)}
                    >
                      {transactionHistory.prevPage}
                    </a>
                  </li>
                </div>
              ) : null}
              <li className="page-item active">
                <a className="page-link" href="#">
                  {transactionHistory.page}
                </a>
              </li>
              {transactionHistory.hasNextPage ? (
                <div>
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(transactionHistory.nextPage)}
                    >
                      {transactionHistory.nextPage}
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={() => setCurrentPage(transactionHistory.nextPage)}
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4" />
                    </a>
                  </li>

                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#123"
                      onClick={() => setCurrentPage(transactionHistory.totalPages)}
                    >
                      <Lucide icon="ChevronsRight" className="w-4 h-4" />
                    </a>
                  </li>
                </div>
              ) : null}
            </ul>
          </nav>
          <Select
            defaultValue={getPerPage}
            onChange={(e) => setPerPage({ value: `${e.value}`, label: `${e.value}` })}
            options={kv.optionsPerPage}
          />
        </div>
      </div>
    </>
  );
}

export default Main;
