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

  // only map 6 items for now

  const chartData = props.data.map((item, index) => {
    if (index < 6) {
      return item.count;
    }
  });

  const labels = props.data.map((item, index) => {
    if (index < 6) {
      return item.status;
    }
  });

  const chartColors = () => [
    colors.primary(0.9),
    colors.warning(0.9),
    colors.pending(0.9),
    colors.secondary(0.9),
    colors.success(0.9),
    colors.info(0.9)
  ];

  const data = useMemo(() => {
    return {
      labels: labels,

      //[props.data[1].productName, props.data[2].productName, props.data[0].productName],
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

  const options = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    };
  });

  return (
    <Chart
      type="pie"
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
