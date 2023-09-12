import { Edit2, Trash } from "react-feather";

import { helper as $h } from "@/utils";
import { Button } from "reactstrap";

export const Columns = (columnFun) => {
  return [
    {
      name: "ID",
      sortable: true,
      minWidth: "100px",
      cell: (row) => {
        return <span className="text-bold-500">{row.userId}</span>;
      }
    },
    {
      name: "NAME",
      sortable: true,
      minWidth: "100px",
      row: "row",
      cell: (row) => {
        return (
          <span className="text-bold-500">
            {row.name ? $h.capitalizeFirstLetter(row.name) : ""}
          </span>
        );
      }
    },
    {
      name: "EMAIL",
      sortable: true,
      minWidth: "200px",
      cell: (row) => {
        return <span className="text-bold-500">{row.email}</span>;
      }
    },
    {
      name: "PHONE",
      sortable: true,
      minWidth: "100px",
      cell: (row) => {
        return <span className="text-bold-500">{row.phoneNumber}</span>;
      }
    }
  ];
};
