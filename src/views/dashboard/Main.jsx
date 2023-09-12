import {
  getCancelOrders as onGetCancelOrders,
  getMonthlyOrderReport as onGetMonthlyOrderReport,
  getOpenOrders as onGetOpenOrders,
  getSellOrderReport as onGetSellOrderReport,
  getTopProducts as onGetTopProducts,
  getTotalOrders as onGetTotalOrders,
  getTotalOrdersPayment as onGetTotalOrdersPayment
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

import AllOrdersCard from "./AllOrdersCard";
import AllOrdersPaymentCard from "./AllOrdersPaymentCard";
import CanceledOrdersCard from "./CanceledOrdersCard";
import { Lucide } from "@/base-components";
import OpenOrdersCard from "./OpenOrdersCard";
import OrderReportCard from "./OrderReportCard";
import SalesReportHistoryCard from "./SalesReportHistoryCard";
import TopProductsCard from "./TopProductsCard";
import { useEffect } from "react";

function Main() {
  const dispatch = useDispatch();

  const {
    TotalOrders,
    OpenOrders,
    CancelOrders,
    TotalOrdersPayment,
    TopProducts,
    SalesReport,
    OrderReport,
    TotalOrdersLoading,
    OpenOrdersLoading,
    CancelOrdersLoading,
    TotalOrdersPaymentLoading,
    TopProductsLoading,
    SalesReportLoading,
    OrderReportLoading
  } = useSelector((state) => state.DashboardReducer);

  useEffect(() => {
    dispatch(onGetTotalOrders());
    dispatch(onGetCancelOrders());
    dispatch(onGetMonthlyOrderReport());
    dispatch(onGetOpenOrders());
    dispatch(onGetTopProducts());
    dispatch(onGetSellOrderReport());
    dispatch(onGetTotalOrdersPayment());
  }, [dispatch]);

  function handleButtonClick() {
    dispatch(onGetTotalOrders());
    dispatch(onGetCancelOrders());
    dispatch(onGetMonthlyOrderReport());
    dispatch(onGetOpenOrders());
    dispatch(onGetTopProducts());
    dispatch(onGetSellOrderReport());
    dispatch(onGetTotalOrdersPayment());
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-12">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 mt-8">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Account Statistics</h2>
              <button
                className="ml-auto flex items-center text-primary"
                onClick={handleButtonClick}
                disabled={
                  TotalOrdersLoading ||
                  OpenOrdersLoading ||
                  CancelOrdersLoading ||
                  TotalOrdersPaymentLoading ||
                  TopProductsLoading ||
                  SalesReportLoading ||
                  OrderReportLoading
                }
              >
                <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" /> Reload Data
              </button>
            </div>
            <div className="grid grid-cols-8 gap-4  mt-5">
              <AllOrdersCard TotalOrders={TotalOrders} Loading={TotalOrdersLoading} />
              <OpenOrdersCard OpenOrders={OpenOrders} Loading={OpenOrdersLoading} />
              <AllOrdersPaymentCard
                TotalOrdersPayment={TotalOrdersPayment}
                Loading={TotalOrdersPaymentLoading}
              />

              <CanceledOrdersCard CancelOrders={CancelOrders} Loading={CancelOrdersLoading} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 mt-8">
            <div className="intro-y block sm:flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Sales Report History</h2>
            </div>

            <SalesReportHistoryCard SalesReport={SalesReport} Loading={SalesReportLoading} />
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Monthly Top Products</h2>
            </div>

            <TopProductsCard TopProducts={TopProducts} Loading={TopProductsLoading} />
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Order Report</h2>
            </div>

            <OrderReportCard OrderReport={OrderReport} Loading={OrderReportLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
