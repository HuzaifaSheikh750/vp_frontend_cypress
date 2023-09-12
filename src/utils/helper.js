import Constants from "../constants/Constants";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import jwt from "jwt-decode"; // import dependency

dayjs.extend(duration);

const helpers = {
  cutText(text, length) {
    if (text.split(" ").length > 1) {
      const string = text.substring(0, length);
      const splitText = string.split(" ");
      splitText.pop();
      return splitText.join(" ") + "...";
    } else {
      return text;
    }
  },
  formatDate(date, format) {
    if (!date) return "";
    return dayjs(date).format(format);
  },

  capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return "";
    }
  },
  onlyNumber(string) {
    if (string) {
      return string.replace(/\D/g, "");
    } else {
      return "";
    }
  },

  formatCurrency(num) {
    // if num is not a number, return 0
    if (isNaN(num)) {
      return "0.00";
    }

    // if is string convert to number
    if (typeof num === "string") {
      num = parseFloat(num);
    }

    var p = num.toFixed(2).split(".");
    return (
      p[0]
        .split("")
        .reverse()
        .reduce(function (acc, num, i, orig) {
          return num + (i && !(i % 3) ? "," : "") + acc;
        }, "") +
      "." +
      p[1]
    );
  },

  diffTimeByNow(time) {
    const startDate = dayjs(dayjs().format("YYYY-MM-DD HH:mm:ss").toString());
    const endDate = dayjs(dayjs(time).format("YYYY-MM-DD HH:mm:ss").toString());

    const duration = dayjs.duration(endDate.diff(startDate));
    const milliseconds = Math.floor(duration.asMilliseconds());

    const days = Math.round(milliseconds / 86400000);
    const hours = Math.round((milliseconds % 86400000) / 3600000);
    let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000);
    const seconds = Math.round(
      (((milliseconds % 86400000) % 3600000) % 60000) / 1000
    );

    if (seconds < 30 && seconds >= 0) {
      minutes += 1;
    }

    return {
      days: days.toString().length < 2 ? "0" + days : days,
      hours: hours.toString().length < 2 ? "0" + hours : hours,
      minutes: minutes.toString().length < 2 ? "0" + minutes : minutes,
      seconds: seconds.toString().length < 2 ? "0" + seconds : seconds,
    };
  },
  isset(obj) {
    if (obj !== null && obj !== undefined) {
      if (typeof obj === "object" || Array.isArray(obj)) {
        return Object.keys(obj).length;
      } else {
        return obj.toString().length;
      }
    }

    return false;
  },
  toRaw(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  randomNumbers(from, to, length) {
    const numbers = [0];
    for (let i = 1; i < length; i++) {
      numbers.push(Math.ceil(Math.random() * (from - to) + to));
    }

    return numbers;
  },
  toRGB(colors) {
    const tempColors = Object.assign({}, colors);
    const rgbColors = Object.entries(tempColors);
    for (const [key, value] of rgbColors) {
      if (typeof value === "string") {
        if (value.replace("#", "").length == 6) {
          const aRgbHex = value.replace("#", "").match(/.{1,2}/g);
          tempColors[key] = (opacity = 1) =>
            `rgb(${parseInt(aRgbHex[0], 16)} ${parseInt(
              aRgbHex[1],
              16
            )} ${parseInt(aRgbHex[2], 16)} / ${opacity})`;
        }
      } else {
        tempColors[key] = helpers.toRGB(value);
      }
    }
    return tempColors;
  },
  FindTotal(props) {
    var subtot = 0;
    if (props.hasOwnProperty("products")) {
      props.products.forEach((zone, index) => {
        subtot += zone.unit_price * zone.quantity;
      });
    }
    return subtot;
  },
  CalculateVat(props) {
    if (props.hasOwnProperty("products")) {
      let total = props.products.reduce((accumulator, object) => {
        return accumulator + object.unit_price * object.quantity;
      }, 0);

      return (total / 100) * 5;
    } else return 0;
  },
  isNullObject(obj) {
    return (
      obj === null ||
      typeof obj === "undefined" ||
      Object.keys(obj).length === 0
    );
  },
  isObjEmpty(obj) {
    Object.keys(obj).length === 0;
  },

  currencyCodeFormat(props) {
    return `$${props}.00`;
  },
  getTokenData() {
    return localStorage.getItem(Constants.ACCESS_TOKEN) ?? "";
  },
  getRoleId() {
    const roleData = localStorage.getItem(Constants.ROLE);
    if (roleData && roleData !== "undefined") {
      const role = JSON.parse(roleData);
      return role?.id ?? 0;
    }
    return 0;
  },
  getCompanyName() {
    return localStorage.getItem(Constants.COMPANY_NAME) ?? "";
  },
  getUserData() {
    const userData = localStorage.getItem(Constants.AUTH_USER);
    if (userData && userData !== "undefined") {
      return JSON.parse(userData);
    }
    return {};
  },

  getName() {
    const userData = localStorage.getItem(Constants.AUTH_USER);
    if (userData && userData !== "undefined") {
      const user = JSON.parse(userData);
      return user?.name ?? "";
    }
    return "";
  },
  getEmail() {
    const userData = localStorage.getItem(Constants.AUTH_USER);
    if (userData && userData !== "undefined") {
      const user = JSON.parse(userData);
      return user?.email ?? "";
    }

    return "";
  },
  getUserId() {
    const userData = localStorage.getItem(Constants.AUTH_USER);
    if (userData && userData !== "undefined") {
      const user = JSON.parse(userData);
      return user?.id ?? 0;
    }
    return 0;
  },

  removeSlash(string) {
    if (string) {
      return string.replace(/\//g, "");
    } else {
      return "";
    }
  },
  toHome() {
    const role = helpers.getRoleId();
    let route = "/login";

    switch (role) {
      case Constants.ADMIN_ROLE_ID:
        route = Constants.DEFAULT_ADMIN_MAIN_ROUTE;
        break;
      case Constants.USER_ROLE_ID:
        route = Constants.DEFAULT_USER_MAIN_ROUTE;
        break;
      default:
        localStorage.clear();
    }

    return route;
  },
};

export { helpers as helper };
