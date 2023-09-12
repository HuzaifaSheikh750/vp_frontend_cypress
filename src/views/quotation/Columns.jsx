import {
  ActionsFormatter,
  AmountFormatter,
  OrderIdFormatter,
  QuotationStatusFormatter,
} from "../../utils/formaters.jsx";

import { reactFormatter } from "react-tabulator";

const Columns = (handleOrderIdClick, handleButtonClick, handleDeleteClick) => [
  {
    title: "Quote ID",
    field: "id",
    sorter: "number",
    headerHozAlign: "center",
    formatter: reactFormatter(
      <OrderIdFormatter handleOrderIdClick={handleOrderIdClick} />
    ),
  },
  {
    title: "Vendor ID",
    field: "vendorId",
    sorter: "number",
    headerHozAlign: "center",
  },
  {
    title: "Company Name",
    field: "vendor.companyName",
    headerHozAlign: "center",
  },
  {
    title: "Document ID",
    field: "vendorDocumentNum",
    headerHozAlign: "center",
  },
  {
    title: "Document Date",
    field: "documentDate",
    sorter: "date",
    headerHozAlign: "center",
  },
  {
    title: "Status",
    field: "status",
    formatter: reactFormatter(<QuotationStatusFormatter />),
  },
  {
    title: "Total Amount",
    field: "totalAmount",
    sorter: "number",
    headerHozAlign: "center",
    formatter: reactFormatter(<AmountFormatter />),
  },
  {
    title: "Payment Terms",
    field: "paymentTerm.name",
    sorter: "number",
  },
  {
    title: "Payment Method",
    field: "paymentMethods.name",
    sorter: "number",
  },
  {
    title: "Actions",
    field: "actions",
    headerHozAlign: "center",
    width: 220,
    formatter: reactFormatter(
      <ActionsFormatter
        handleButtonClick={handleButtonClick}
        handleDeleteClick={handleDeleteClick}
        type="quotation"
      />
    ),
  },
];

export default Columns;
