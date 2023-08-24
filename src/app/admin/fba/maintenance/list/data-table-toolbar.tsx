"use client";
import { Table } from "@tanstack/react-table";
import { format } from "date-fns";
import { statusList } from "./data";
import MaintenanceSearch from "../components/MaintenanceSearch";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const searchOptions = {
    status: statusList,
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col w-full space-y-2">
        <MaintenanceSearch
          searchOptions={searchOptions}
          onChange={(data: any) => {
            table.resetColumnFilters();
            for (const name in data) {
              if (!data[name]) continue;
              let result;
              if (name === "maintenanceStartDate")
                result = format(new Date(data[name]), "PPP");
              else if (name === "maintenanceEndDate")
                result = format(new Date(data[name]), "PPP");
              else result = data[name];

              table.getColumn(name)?.setFilterValue(result);
            }
          }}
        />
      </div>
    </div>
  );
}
