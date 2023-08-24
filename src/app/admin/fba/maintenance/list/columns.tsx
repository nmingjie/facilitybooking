"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions"
import { format} from "date-fns";
import { UTCToLocal } from "@/lib/timeUtils";

type Maintenance = {
  code: string;
  maintenanceStartDate: Date;
  maintenanceEndDate: Date;
  maintenanceStartTime: Date;
  maintenanceEndTime: Date;
  startTime: Date;
  endTime: Date;
  status: string;
};

export const columns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Reference ID"
      />
    ),

    cell: ({ row }) => <div className="w-auto">{row.getValue("code")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  {
    accessorKey: "maintenanceStartDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Maintenance Start Date"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {row.getValue("maintenanceStartDate") ? (
            <span>
              {" "}
              {format(UTCToLocal (row.getValue("maintenanceStartDate")), "PPP")}{" "}
            </span>
          ) : (
            <></>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || !row.getValue(id)) return false;
      const cellTime = format(UTCToLocal (row.getValue(id)), "PPP");
      return value.includes(cellTime);
    },
  },
  {
    accessorKey: "maintenanceEndDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Maintenance End Date"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {row.getValue("maintenanceEndDate") ? (
            <span>
              {" "}
              {format(UTCToLocal (row.getValue("maintenanceEndDate")), "PPP")}{" "}
            </span>
          ) : (
            <></>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || !row.getValue(id)) return false;
      const cellTime = format(UTCToLocal (row.getValue(id)), "PPP");
      return value.includes(cellTime);
    },
  },
  {
    accessorKey: "maintenanceStartTime",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Start Time"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {row.getValue("maintenanceStartTime") ? (
            <span>
              {" "}
              {format(
                UTCToLocal (row.getValue("maintenanceStartTime")),
                "h:mm aa"
              )}{" "}
            </span>
          ) : (
            <></>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || !row.getValue(id)) return false;
      const cellTime = format(UTCToLocal (row.getValue(id)), "h:mm aa");
      return value.includes(cellTime);
    },
  },
  {
    accessorKey: "maintenanceEndTime",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="End Time"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {row.getValue("maintenanceEndTime") ? (
            <span>
              {" "}
              {format(UTCToLocal (row.getValue("maintenanceEndTime")), "h:mm aa")}{" "}
            </span>
          ) : (
            <></>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || !row.getValue(id)) return false;
      const cellTime = format(UTCToLocal (row.getValue(id)), "h:mm aa");
      return value.includes(cellTime);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {(row.getValue("status")?(row.getValue("status") as string).toLowerCase() === "upcoming" ? (
            <span className="text-amber-400"> {row.getValue("status")} </span>
          ) : (
            <span className="text-green-500"> {row.getValue("status")} </span>
          ):(<span>{" "}</span>))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
