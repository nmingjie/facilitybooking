"use client";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

import { format } from "date-fns";

import { statuses } from "./data";
import { BsSearch } from "react-icons/bs";
import { PiFileCsvDuotone } from "react-icons/pi";
import FacilityBookingSearch from "@/components/FacilityBookingSearch";
import CsvExportor from "csv-exportor";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data: TData[];
}

type CSVHeaderParam = string[];
type CSVBodyParam = {
  brid: string;
  buildingName: string;
  facilityName: string;
  bookingDate: string;
  bookingTimeForm: string;
  bookingTimeTo: string;
  status: string;
};
type OriginCSVDataParam = {
  bookingDate: string;
  bookingTimeForm: string;
  bookingTimeTo: string;
  brid: string;
  buildingID: string;
  buildingName: string;
  facilityName: string;
  facilityType: string;
  imagePath: string;
  locationLat: number;
  locationLng: number;
  status: string;
};

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const createCSVData = (
    data: OriginCSVDataParam[]
  ): [CSVHeaderParam, CSVBodyParam[]] | boolean => {
    if (!Array.isArray(data)) return false;

    const customTitle = [
      "S/No.",
      "Day",
      "Date",
      "Company",
      "Shared Facility",
      "Usage",
      "Booking category",
      "Start Time",
      "End Time",
      "Duration",
      "Unit Rate",
      "Amount",
      "Discount",
      "Amount(After discount)",
      "Tenant Discounted Rate",
      "8% GST",
      "Amount Payable",
      "Remarks(N.A.)",
      "Development",
    ];
    const correspondingField = [
      "sno",
      "day",
      "bookingDate",
      "companyName",
      "facilityName",
      "usage",
      "bookingCategory",
      "bookingTimeFrom",
      "bookingTimeTo",
      "duration",
      "unitRate",
      "amount",
      "discount",
      "discountedAmount",
      "countTenant",
      "gst",
      "totalAmount",
      "remarks",
      "buildingName",
    ];

    const methodOfCleanUpData = {
      needAddDollarSymbol: [
        "unitRate",
        "amount",
        "discountedAmount",
        "countTenant",
        "gst",
        "totalAmount",
      ],
      needFormatTime: ["bookingTimeFrom", "bookingTimeTo"],
      needFormatDate: ["bookingDate"],
      needSkipField: ["remarks"],
      init: function (title: string, data: any) {
        if (this.judgeShouldAddDollarSymbol(title))
          return data === undefined
            ? ""
            : `$ ${data === 0 ? data : data.toFixed(2)}`;
        if (this.judgeShouldCleanUpTimeFormat(title))
          return format(new Date(data), "h:mm aa");
        if (this.judgeShouldCleanUpDateFormat(title))
          return format(new Date(data), "PPP");
        if (this.judgeShouldSkipField(title)) return "";
        return data;
      },
      judgeShouldAddDollarSymbol: function (title: string) {
        return this.needAddDollarSymbol.includes(title);
      },
      judgeShouldCleanUpTimeFormat: function (title: string) {
        return this.needFormatTime.includes(title);
      },
      judgeShouldCleanUpDateFormat: function (title: string) {
        return this.needFormatDate.includes(title);
      },
      judgeShouldSkipField: function (title: string) {
        return this.needSkipField.includes(title);
      },
    };

    const tempCSVBody: CSVBodyParam[] = [];
    for (const [index, eachData] of data.entries()) {
      let temp = {
        sno: index + 1,
      };
      for (const title of correspondingField) {
        if (title === "sno") continue;
        let result;
        if (title === "countTenant")
          result =
            (eachData["amount" as keyof typeof eachData] as number) * 0.5;
        result = methodOfCleanUpData.init(
          title,
          result || eachData[title as keyof typeof eachData]
        );
        temp = { ...temp, [title]: result };
      }

      tempCSVBody.push(temp as any);
    }

    return [customTitle, tempCSVBody];
  };

  const searchOptions = {
    status: statuses,
  };

  const handleExportAllClick = () => {
    if (!data) return;
    const result: any = createCSVData(data as OriginCSVDataParam[]);
    if (!result) return;

    const [title, body] = result;
    CsvExportor.downloadCsv(body, { header: title }, "Facility Bookings.csv");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col w-full space-y-2">
        <div className="flex flex-wrap">
          <div className="font-medium text-xl leading-8">Search</div>
          <div className="pb-4 flex flex-nowrap w-full">
            <Input
              frontIcon={
                <div className="h-full  px-5 flex items-center">
                  <BsSearch className="text-blue-600" />
                </div>
              }
              outSiderClass="border-gray-300 border items-center rounded-md w-full"
              customInputClass="border-0 h-14 w-full placeholder:border-gray-300 rounded-md"
              placeholder="Search Booking Reference ID,Building Name,Facility Name,Facility Type"
              value={
                (table.getColumn("buildingName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("buildingName")
                  ?.setFilterValue(event.target.value)
              }
            />
            <div
              className="flex mx-4 items-start w-44 text-blue-600 cursor-pointer"
              onClick={handleExportAllClick}
            >
              <PiFileCsvDuotone className="h-6 w-6" />
              <span className="text-blue-600">Export All</span>
            </div>
          </div>
        </div>

        <FacilityBookingSearch
          searchOptions={searchOptions}
          onChange={(data: any) => {
            table.resetColumnFilters();
            for (const name in data) {
              if (!data[name]) continue;
              let result;
              if (name === "bookingDate")
                result = format(new Date(data[name]), "PPP");
              else if (name === "bookingTimeFrom" || name === "bookingTimeTo")
                result = format(new Date(data[name]), "h:mm aa");
              else result = data[name];

              table.getColumn(name)?.setFilterValue(result);
            }
          }}
        />
      </div>
    </div>
  );
}
