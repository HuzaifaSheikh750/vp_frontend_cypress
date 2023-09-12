import { Lucide } from "@/base-components";
import ReactLoading from "react-loading";
import { memo } from "react";

const AllOrders = ({ TotalOrders, Loading }) => {
  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-2 intro-y">
      <div className="report-box zoom-in">
        <div className="box p-5">
          <div className="flex">
            <Lucide icon="ShoppingCart" className="report-box__icon text-primary" />
          </div>
          {TotalOrders.TotalOrders ? (
            <div className="text-3xl font-medium leading-8 mt-6">{TotalOrders.TotalOrders}</div>
          ) : Loading ? (
            <ReactLoading type="bubbles" color="#1E40AF" />
          ) : (
            <div className="text-3xl font-medium leading-8 mt-6">-</div>
          )}
          <div className="text-base text-slate-500 mt-1">All Orders</div>
        </div>
      </div>
    </div>
  );
};

export default memo(AllOrders);
