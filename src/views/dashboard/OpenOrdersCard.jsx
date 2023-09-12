import { Lucide } from "@/base-components";
import ReactLoading from "react-loading";
import { memo } from "react";

const OpenOrdersCard = ({ OpenOrders, Loading }) => {
  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-2 intro-y">
      <div className="report-box zoom-in">
        <div className="box p-5">
          <div className="flex">
            <Lucide icon="CreditCard" className="report-box__icon text-pending" />
          </div>
          <div className="text-3xl font-medium leading-8 mt-6">
            {OpenOrders.OpenOrders ? (
              <div className="text-3xl font-medium leading-8 mt-6">{OpenOrders.OpenOrders}</div>
            ) : Loading ? (
              <ReactLoading type="bubbles" color="#1E40AF" />
            ) : (
              <div className="text-3xl font-medium leading-8 mt-6">-</div>
            )}
          </div>
          <div className="text-base text-slate-500 mt-1">Open Orders</div>
        </div>
      </div>
    </div>
  );
};

export default memo(OpenOrdersCard);
