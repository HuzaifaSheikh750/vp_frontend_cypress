import { helper as $h } from "@/utils";
import ReactLoading from "react-loading";
import ReportDonutChart from "@/components/report-donut-chart/Main";
import classnames from "classnames";
import { memo } from "react";

const OrderReportCard = ({ OrderReport, Loading }) => {
  const CalculatePercentage = (data) => {
    if (!data.length) return data;

    let total = 0;
    data.forEach((element) => {
      total += element.count;
    });
    data.forEach((element) => {
      element.percentage = ((element.count / total) * 100).toFixed(1);
    });
    return data;
  };

  return (
    <div className="intro-y box p-5 mt-5">
      {OrderReport.length ? (
        <div>
          <div className="mt-3">
            <ReportDonutChart height={213} data={OrderReport} />
          </div>
          <div className="w-56 sm:w-auto mx-auto mt-4 grid grid-cols-2  ">
            {CalculatePercentage(OrderReport).map((value, index) => {
              return (
                <div
                  key={index}
                  className={classnames({
                    "flex items-center mt-4 mx-2": true
                  })}
                >
                  <div
                    className={classnames({
                      "w-2 h-2 rounded-full mr-3": true,
                      "bg-primary": value.status == "approval",
                      "bg-warning": value.status == "approved",
                      "bg-pending": value.status == "processing",
                      "bg-secondary": value.status == "packing",
                      "bg-success": value.status == "shipping",
                      "bg-info": value.status == "delivered"
                    })}
                  ></div>
                  <span className="truncate">{$h.capitalizeFirstLetter(value.status)}</span>
                  <span className="font-medium ml-auto">{value.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : Loading ? (
        <ReactLoading type="bubbles" color="#1E40AF" />
      ) : (
        <div className="w-auto my-10 text-center font-medium text-lg">No Data Found</div>
      )}
    </div>
  );
};

export default memo(OrderReportCard);
