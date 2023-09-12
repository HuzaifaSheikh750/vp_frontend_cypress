import * as $_ from "lodash";
import moment from "moment";
import { helper as $h } from "./helper";

export function ConstructJSON(props, type) {
  switch (type) {
    case "ORDER_MANAGEMENT":
      let JsonArray = [];
      props.map((value, index) => {
        let NewData = {
          orderId: value.orderId,
          orderStatus: value.orderStatus,
          orderPlaced: moment(value.orderPlaced).utc().format("DD/MM/YYYY"),
          expectedDeliveryDate: moment(value.expectedDeliveryDate).utc().format("DD/MM/YYYY"),
          totalQty: value.totalQuantity
        };
        JsonArray.push(NewData);
      });

      const Headers = [
        {
          key: "orderId",
          name: "Order ID"
        },
        {
          key: "expectedDeliveryDate",
          name: "Expected Delivery Date"
        },
        {
          key: "orderPlaced",
          name: "Order Placed  "
        },
        {
          key: "orderStatus",
          name: "Order Status "
        },
        {
          key: "totalQty",
          name: "Total Quantity"
        }
      ];

      return [JsonArray, Headers];

    case "TRANSACTION_HISTORY":
      let JsonArray2 = [];
      props.map((value, index) => {
        let NewData = {
          PaymentStatus: $h.capitalizeFirstLetter(value.status),
          orderId: value.hasOwnProperty("orderRefId") ? value.orderRefId.orderId : "",
          paymentDate: moment(value.paymentDate).utc().format("DD/MM/YYYY"),
          paymentId: value.paymentId,

          totalQuantity: value.hasOwnProperty("orderRefId") ? value.orderRefId.totalQuantity : "",
          debit:
            value.status == "refund"
              ? value.hasOwnProperty("orderRefId")
                ? $h.formatCurrency(value.orderRefId.totalAmount)
                : ""
              : "",
          credit:
            value.status == "paid"
              ? value.hasOwnProperty("orderRefId")
                ? $h.formatCurrency(value.orderRefId.totalAmount)
                : ""
              : ""
        };
        JsonArray2.push(NewData);
      });

      const Headers2 = [
        {
          key: "PaymentStatus",
          name: "Payment Status"
        },
        {
          key: "paymentDate",
          name: "Payment Date"
        },
        {
          key: "totalQuantity",
          name: "Total Quantity"
        },
        {
          key: "orderId",
          name: "Order ID"
        },
        {
          key: "paymentId",
          name: "Payment ID"
        },
        {
          key: "debit",
          name: "Debit"
        },
        {
          key: "credit",
          name: "Credit "
        }
      ];

      return [JsonArray2, Headers2];

    case "SALES_ORDER_LIST":
      let JsonArray3 = [];
      props.map((value, index) => {
        let NewData = {
          orderId: value.orderId,
          orderStatus: value.orderStatus,
          orderPlaced: moment(value.orderPlaced).utc().format("DD/MM/YYYY"),
          expectedDeliveryDate: moment(value.expectedDeliveryDate).utc().format("DD/MM/YYYY"),
          totalQty: value.totalQuantity
        };
        JsonArray3.push(NewData);
      });

      const Headers3 = [
        {
          key: "orderId",
          name: "Order ID"
        },
        {
          key: "expectedDeliveryDate",
          name: "Expected Delivery Date"
        },
        {
          key: "orderPlaced",
          name: "Order Placed  "
        },
        {
          key: "orderStatus",
          name: "Order Status "
        },
        {
          key: "totalQty",
          name: "Total Quantity"
        }
      ];

      return [JsonArray3, Headers3];

    default:
      return [[], []];
  }
}
