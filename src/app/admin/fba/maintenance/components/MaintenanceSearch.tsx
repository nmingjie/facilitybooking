"use client";

import * as React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { VscAdd } from "react-icons/vsc";

type FilterObject = {
  status?: string;
  maintenanceStartDate?: Date | string | null;
  maintenanceEndDate?: Date | string | null;
};

type SearchOptionStatusParam = {
  label: string;
  value: string;
}[];

type FilterPros = {
  onChange?: any;
  searchOptions?: {
    status: SearchOptionStatusParam;
  };
  defaultCondition?: object;
};
type SearchSelections = {
  status?: string;
  maintenanceStartDate?: string;
  maintenanceEndDate?: string;
};
function MaintenanceSearch({
  onChange,
  searchOptions,
  defaultCondition,
}: FilterPros) {
  const [searchSelection, setSearchSelection] =
    React.useState<SearchSelections>(defaultCondition ? defaultCondition : {});
  const router = useRouter();

  const handleClickFilter = (data: FilterObject) => {
    for (const item in data) {
      let temp: any = data[item as keyof typeof data];
      if (temp instanceof Date) {
        data[item as keyof typeof data] = temp.toISOString();
      }
    }

    const currentSearch: any = {
      ...searchSelection,
      ...data,
    };

    if (onChange) onChange(currentSearch);

    setSearchSelection(currentSearch);
  };

  return (
    <div>
      <style>
        {`
          .react-datepicker__children-container{
            width:fit-content;
            position: relative;
            left: 40px;
          }

          .react-datepicker__time-container{
            float:inherit;
          }
          `}
      </style>
      <div className="flex px-4 lg:px-32  justify-between  mt-6">
        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="font-semibold"> Maintenance Start Date</span>

                <FaChevronDown />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  searchSelection.maintenanceStartDate
                    ? new Date(searchSelection.maintenanceStartDate)
                    : undefined
                }
                onSelect={(date) => handleClickFilter({ maintenanceStartDate: date })}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 3}
                footer={
                  <div className={"flex justify-end"}>
                    <Button
                      asChild={false}
                      onClick={() => {
                        handleClickFilter({ maintenanceStartDate: undefined });
                      }}
                      className="bg-black hover:bg-slate-200 hover:text-black"
                    >
                      {" "}
                      Clear Date
                    </Button>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>
          <div>
            {searchSelection.maintenanceStartDate ? (
              format(new Date(searchSelection.maintenanceStartDate), "PPP")
            ) : (
              <span>All Dates</span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="font-semibold"> Maintenance End Date</span>

                <FaChevronDown />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  searchSelection.maintenanceEndDate
                    ? new Date(searchSelection.maintenanceEndDate)
                    : undefined
                }
                onSelect={(date) => handleClickFilter({ maintenanceEndDate: date })}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 3}
                footer={
                  <div className={"flex justify-end"}>
                    <Button
                      asChild={false}
                      onClick={() => {
                        handleClickFilter({ maintenanceEndDate: undefined });
                      }}
                      className="bg-black hover:bg-slate-200 hover:text-black"
                    >
                      {" "}
                      Clear Date
                    </Button>
                  </div>
                }
              />
            </PopoverContent>
          </Popover>
          <div>
            {searchSelection.maintenanceEndDate ? (
              format(new Date(searchSelection.maintenanceEndDate), "PPP")
            ) : (
              <span>All Dates</span>
            )}
          </div>
        </div>
        <div className="flex flex-col ">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex cursor-pointer items-center gap-2">
                <span className="font-semibold"> Status</span>
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleClickFilter({ status: "" })}
              >
                All Status
              </DropdownMenuItem>
              {searchOptions &&
                searchOptions.status &&
                searchOptions.status.map((item) => (
                  <DropdownMenuItem
                    key={item.value}
                    onClick={() => handleClickFilter({ status: item.value })}
                  >
                    {" "}
                    {item.label}{" "}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <span>
              {" "}
              {searchSelection.status ? searchSelection.status : " All Status"}{" "}
            </span>
          </div>
        </div>
        <div className="text-blue-500">
          <Button variant="ghost" onClick={() => router.push("/admin/fba/maintenance/create")} className="p-4 text-lg w-28  cursor-pointer ">
            <VscAdd className="w-5 h-5 mr-2"></VscAdd>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceSearch;
