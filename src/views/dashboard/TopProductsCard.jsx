import { helper as $h } from "@/utils";
import ReactLoading from "react-loading";
import ReportPieChart from "@/components/report-pie-chart/Main";
import classnames from "classnames";
import { memo } from "react";

const TopProductsCard = ({ TopProducts, Loading }) => {
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
      {TopProducts.length ? (
        <div>
          <div className="mt-3">
            <ReportPieChart height={213} data={TopProducts} />
          </div>
          <div className="w-56 sm:w-auto mx-auto mt-4 grid grid-cols-2  ">
            {CalculatePercentage(TopProducts).map((value, index) => {
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
                      "bg-primary": index == 0,
                      "bg-pending": index == 2,
                      "bg-warning": index == 1,
                      "bg-secondary": index == 3,
                      "bg-success": index == 4,
                      "bg-info": index == 5
                    })}
                  ></div>
                  <span className="truncate">{$h.capitalizeFirstLetter(value.productName)}</span>
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

export default memo(TopProductsCard);
