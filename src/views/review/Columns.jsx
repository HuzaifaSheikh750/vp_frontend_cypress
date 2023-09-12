import { Bookmark, View } from "lucide-react";

import { helper as $h } from "@/utils";
import { Button } from "reactstrap";
import moment from "moment";

export const Columns = (columnFun) => {
  return [
    {
      name: "User Name",
      sortable: true,
      minWidth: "100px",
      row: "row",
      cell: (row) => {
        return (
          <span className="text-bold-500">
            {row?.userRefId?.name ? $h.capitalizeFirstLetter(row.userRefId.name) : "N/A"}
          </span>
        );
      }
    },
    {
      name: "Posted Date",
      sortable: true,
      minWidth: "200px",
      cell: (row) => {
        return (
          <span className="text-bold-500">
            {" "}
            {moment(row.postedDate).utc().format("DD-MMM-YYYY")}
          </span>
        );
      }
    },
    {
      name: "Title",
      sortable: true,
      minWidth: "100px",
      cell: (row) => {
        return <span className="text-bold-500">{row.title}</span>;
      }
    },
    {
      name: "ACTIONS",
      center: true,
      minWidth: "350px",
      cell: (row) => {
        return (
          <div
            className="
          d-flex
          justify-content-center
          align-items-center"
          >
            <Button
              size="sm"
              color="primary"
              outline
              className="btn btn-icon mr-6"
              onClick={() => {
                columnFun({
                  show: true,
                  type: "Edit",
                  data: row
                });
              }}
            >
              <Bookmark className="font-medium-2 mr-2" size={15} />
              <span className="align-middle ms-50">View</span>
            </Button>
          </div>
        );
      }
    }
  ];
};
