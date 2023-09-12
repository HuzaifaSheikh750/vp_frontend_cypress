// import { OrderIdFormatter } from "../../utils/formaters.jsx";

import {
  ActionsFormatter,
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
  },
  {
    title: "Company Name",
    field: "vendor.companyName",
  },
  {
    title: "Description",
    field: "description",
  },

  {
    title: "Document Date",
    field: "documentDate",
    sorter: "date",
  },
  {
    title: "Status",
    field: "status",
    formatter: reactFormatter(<QuotationStatusFormatter />),
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
        type="sourcing"
      />
    ),
  },
];

export default Columns;
