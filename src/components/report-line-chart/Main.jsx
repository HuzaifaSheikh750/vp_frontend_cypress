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

  const data = useMemo(() => {
    return {
      labels: [
        //labels
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],

      datasets: [
        {
          //currSales
          label: "# of Votes",
          data: props.data.map((item) => item.currSales || 0),
          // if it exists or else 0
          // props.data.map((item) => item.currSales || 0),

          borderWidth: 2,
          borderColor: colorScheme ? colors.primary(0.8) : "",
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
        },
        {
          //prev
          label: "# of Votes",
          data: props.data.map((item) => item.prevSales || 0),

          //          [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
          borderWidth: 2,
          borderDash: [2, 2],
          borderColor: darkMode ? colors.slate["400"](0.6) : colors.slate["400"](),
          backgroundColor: "transparent",
          pointBorderColor: "transparent",
          tension: 0.4
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
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 12
            },
            color: colors.slate["500"](0.8)
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            font: {
              size: 12
            },
            color: colors.slate["500"](0.8),
            callback: function (value) {
              return "$" + value;
            }
          },
          grid: {
            color: darkMode ? colors.slate["500"](0.3) : colors.slate["300"](),
            borderDash: [2, 2],
            drawBorder: false,
            borderWidth: 5
          }
        }
      }
    };
  });

  return (
    <Chart
      type="line"
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
