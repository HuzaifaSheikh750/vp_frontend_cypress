import { helper as $h, keyValue as kv } from "@/utils";
import { Edit2, Trash } from "react-feather";

import Constants from "../constants/Constants";
import { Lucide } from "@/base-components";
import classnames from "classnames";
import moment from "moment";

export const pmidFormatter = function (cell, formatterParams) {
  return moment(cell.getValue()).utc().format("DD-MMM-YYYY");
};

export function OrderStatusFormatter(props) {
  const orderStatusCell = props.cell._cell.row.data.orderStatus;
  return (
    <div
      className={classnames({
        "whitespace-nowrap": true,

        "text-green-700": orderStatusCell == "approved",
        "text-success": orderStatusCell == "approval",
        "text-info": orderStatusCell == "processing",
        "text-danger": orderStatusCell == "cancelled",
        "text-warning": orderStatusCell == "packing",
        "text-primary":
          orderStatusCell == "shipping" || orderStatusCell == "delivered",
      })}
    >
      {$h.capitalizeFirstLetter(orderStatusCell)}
    </div>
  );
}

export const DateFormatter = function ({ cell }) {
  if (!cell.getValue()) return "";
  const date = moment(cell.getValue());
  return date.isValid() ? date.format("DD-MMM-YYYY") : "Invalid date";
};

export function CommitmentStatusFormatter({ cell }) {
  const status = cell.getValue();
  const displayText =
    kv.commitmentStatusOptions.find((item) => item.value === status)?.label ||
    status;
  return (
    <div
      className={classnames({
        "whitespace-nowrap": true,
        "text-blue-700": status === "product_quantity",
        "text-green-700": status === "product_value",
        "text-orange-700": status === "product_category_value",
        "text-red-700": status === "value",
      })}
    >
      {displayText}
    </div>
  );
}

export function QuotationStatusFormatter({ cell }) {
  const status = cell.getValue();

  const displayText =
    kv.paymentStatus.find((item) => item.value === status)?.label || status;
  return (
    <div
      className={classnames({
        "whitespace-nowrap": true,
        // yellow for draft
        "text-yellow-700": status === "draft",
        // blue for sent
        "text-blue-700": status === "sent",
        // red for rejected
        "text-red-700": status === "rejected",
        // green for approved
        "text-green-700": status === "approved",
      })}
    >
      {displayText}
    </div>
  );
}

export function POStatusFormatter({ cell }) {
  const status = cell.getValue();

  const displayText =
    kv.purchaseOrderStatus.find((item) => item.value === status)?.label ||
    status;

  return (
    <div
      className={classnames({
        "whitespace-nowrap": true,
        // yellow for draft
        "text-yellow-700": status === "open",
        // blue for sent
        "text-blue-700": status === "received",
        // red for rejected
        "text-red-700": status === "cancelled",
        // green for approved
        "text-green-700": status === "invoiced",
      })}
    >
      {displayText}
    </div>
  );
}

export function AmountFormatter({ cell }) {
  const amount = cell.getValue();
  return $h.formatCurrency(amount);
}

export function AgreementStatusFormatter({ cell }) {
  const status = cell.getValue();
  const displayText =
    kv.agreementStatusOptions.find((item) => item.value === status)?.label ||
    status;
  return (
    <div
      className={classnames({
        "whitespace-nowrap": true,
        "text-blue-700": status === "on_hold",
        "text-green-700": status === "effective",
        "text-red-700": status === "closed",
      })}
    >
      {displayText}
    </div>
  );
}

export function PaymentStatusFormatter({ cell }) {
  const status = cell.getValue();
  const displayText =
    kv.paymentStatusOptions.find((item) => item.value === status)?.label ||
    status;
  return (
    <div
      className={classnames({
        "whitespace-nowrap": true,
        "text-orange-700": status === "unpaid",
        "text-green-700": status === "paid",
      })}
    >
      {displayText}
    </div>
  );
}

export const OrderIdFormatter = function ({ cell, handleOrderIdClick }) {
  const orderId = cell._cell.row.data.id;

  return (
    <div
      className="underline decoration-dotted whitespace-nowrap"
      onClick={() => handleOrderIdClick(orderId)}
    >
      {orderId}
    </div>
  );
};

export const ActionsFormatter = function ({
  cell,
  handleButtonClick,
  handleDeleteClick,
  handleGenerateInvoiceClick,
  handlePrintClick,
  type,
}) {
  const data = cell._cell.row.data;

  if (type === "purchase_order") {
    if ($h.getRoleId() === Constants.ADMIN_ROLE_ID) {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <button
            className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
            onClick={() => handleButtonClick(data)}
          >
            <Edit2 className="font-medium-2 mr-2" size={15} />
            Update
          </button>
          <button
            className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
            onClick={() => {
              handleDeleteClick(data);
            }}
          >
            <Trash className="font-medium-2 mr-2" size={15} /> Delete
          </button>
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <button
            className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
            onClick={() => handleGenerateInvoiceClick(data)}
          >
            <Edit2 className="font-medium-2 mr-2" size={15} />
            Generate Invoice
          </button>
        </div>
      );
    }
  } else if (
    type === "sourcing" ||
    type === "quotation" ||
    type === "agreement"
  ) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
          disabled={data.status === "approved"}
          onClick={() => handleButtonClick(data)}
        >
          <Edit2 className="font-medium-2 mr-2" size={15} />
          Update
        </button>
        <button
          className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
          disabled={data.status === "approved"}
          onClick={() => {
            handleDeleteClick(data);
          }}
        >
          <Trash className="font-medium-2 mr-2" size={15} /> Delete
        </button>
      </div>
    );
  } else if (type === "invoice") {
    if ($h.getRoleId() !== Constants.ADMIN_ROLE_ID) {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <button
            className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
            onClick={() => handleButtonClick(data)}
          >
            <Edit2 className="font-medium-2 mr-2" size={15} />
            Update
          </button>
          <button
            className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
            onClick={() => {
              handleDeleteClick(data);
            }}
          >
            <Trash className="font-medium-2 mr-2" size={15} /> Delete
          </button>
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <button
            className="btn btn-secondary btn-sm  sm:w-17 mt-2 sm:mt-0 mr-2 ml-2 text-primary hover:bg-primary hover:text-primary hover:border-primary"
            onClick={() => handlePrintClick(data)}
          >
            <Lucide icon="FileText" className="w-4 h-4 mr-2" />
            Print Invoice
          </button>
        </div>
      );
    }
  }
};

export const CapitalizeFormatter = function (cell, formatterParams) {
  var status = $h.capitalizeFirstLetter(cell.getValue());

  return status == "Paid"
    ? `<div class ="text-success">
    ${status}</div>`
    : `<div class ="text-danger">
    ${status}</div>`;
};

export function SimpleButton(props) {
  const rowData = props.cell._cell.row.data;
  const columnHeader = props.cell._cell.column.field;

  return columnHeader == "credit" && rowData.invoiceStatus == "refund"
    ? $h.formatCurrency(rowData.totalAmount)
    : columnHeader == "debit" && rowData.invoiceStatus == "paid"
    ? $h.formatCurrency(rowData.totalAmount)
    : "";
}

// export function PaymentStatusFormatter(props) {
//   const StatusCell = props.cell._cell.row.data.invoiceStatus;

//   return (
//     <div
//       className={classnames({
//         "flex items-center  whitespace-nowrap": true,
//         "text-success": StatusCell == "paid",
//         "text-info": StatusCell == "refund",
//         "text-danger": StatusCell == "unpaid",
//       })}
//     >
//       <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
//       {$h.capitalizeFirstLetter(StatusCell)}
//     </div>
//   );
// }
