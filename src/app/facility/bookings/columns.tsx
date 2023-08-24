"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { format } from "date-fns";

type Booking = {
  brid: number;
  buildingName: string;
  facilityName: string;
  bookingDate: Date;
  bookingTimeFrom: Date;
  bookingTimeTo: Date;
  status: string;
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "brid",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Booking Reference ID"
      />
    ),

    cell: ({ row }) => <div className="w-[80px]">{row.getValue("brid")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  {
    accessorKey: "buildingName",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Building Name"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span> {row.getValue("buildingName")} </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return (
        value.includes(row.getValue(id)) ||
        (typeof row.getValue(id) === "string" &&
          (row.getValue(id) as string).includes(value))
      );
    },
  },
  {
    accessorKey: "facilityName",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Facility Name"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span> {row.getValue("facilityName")} </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "bookingDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-white"
        column={column}
        title="Booking Date"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {row.getValue("bookingDate") ? (
            <span>
              {" "}
              {format(new Date(row.getValue("bookingDate")), "PPP")}{" "}
            </span>
          ) : (
            <></>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || !row.getValue(id)) return false;
      const cellTime = format(new Date(row.getValue(id)), "PPP");
      return value.includes(cellTime);
    },
  },
  {
    accessorKey: "bookingTimeFrom",
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
          {row.getValue("bookingTimeFrom") ? (
            <span>
              {" "}
              {format(
                new Date(row.getValue("bookingTimeFrom")),
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
      const cellTime = format(new Date(row.getValue(id)), "h:mm aa");
      return value.includes(cellTime);
    },
  },
  {
    accessorKey: "bookingTimeTo",
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
          {row.getValue("bookingTimeTo") ? (
            <span>
              {" "}
              {format(new Date(row.getValue("bookingTimeTo")), "h:mm aa")}{" "}
            </span>
          ) : (
            <></>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || !row.getValue(id)) return false;
      const cellTime = format(new Date(row.getValue(id)), "h:mm aa");
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
          {(row.getValue("status") as string).toLowerCase() === "in-progress" ? (
            <span className="text-amber-400"> {row.getValue("status")} </span>
          ) : (
            <span> {row.getValue("status")} </span>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
