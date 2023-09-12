import { Chart } from "@/base-components";
import PropTypes from "prop-types";
import { colorScheme as colorSchemeStore } from "@/stores/color-scheme";
import { colors } from "@/utils";
import { darkMode as darkModeStore } from "@/stores/dark-mode";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

function Main(props) {
  const darkMode = useRecoilValue(darkModeStore);
  const colorScheme = useRecoilValue(colorSchemeStore);

  const chartData = props.data.map((item) => item.count);

  const labels = props.data.map((item) => item.status);

  const chartColors = () => {
    return props.data.map((item) => {
      if (item.status === "approval") {
        return colors.primary(0.9);
      } else if (item.status === "approved") {
        return colors.warning(0.9);
      } else if (item.status === "processing") {
        return colors.pending(0.9);
      } else if (item.status === "packing") {
        return colors.secondary(0.9);
      } else if (item.status === "shipping") {
        return colors.success(0.9);
      } else if (item.status === "delivered") {
        return colors.info(0.9);
      }
    });
  };

  const data = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          data: chartData,
          backgroundColor: colorScheme ? chartColors() : "",
          hoverBackgroundColor: colorScheme ? chartColors() : "",
          borderWidth: 5,
          borderColor: darkMode ? colors.darkmode[700]() : colors.white
        }
      ]
    };
  });

  // const OrderReport = [
  //   {
  //     status: "approval",
  //     count: 43,
  //     percent: 67,
  //   },
  //   {
  //     status: "approved",
  //     count: 43,
  //     percent: 67,
  //   },
  //   {
  //     status: "processing",
  //     count: 43,
  //     percent: 67,
  //   },
  //   {
  //     status: "packing",
  //     count: 43,
  //     percent: 67,
  //   },
  //   {
  //     status: "shipping",
  //     count: 43,
  //     percent: 67,
  //   },
  //   {
  //     status: "delivered",
  //     count: 43,
  //     percent: 67,
  //   },
  // ];

  const options = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      cutout: "80%"
    };
  });

  return (
    <Chart
      type="doughnut"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

Main.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string
};

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: ""
};

export default Main;
