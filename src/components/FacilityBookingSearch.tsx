"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { FaSliders, FaChevronDown } from "react-icons/fa6";
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Calendar } from "@/components/ui/calendar";

// import { DesktopFilterForm } from "./DesktopFilterForm";
// import { MobileFilterForm } from "./MobileFilterForm";

import DatePickerReact from "react-datepicker";

import { Button } from "@/components/ui/button";

type FilterObject = {
  status?: string;
  bookingDate?: Date | string;
  buildingName?: string;
  capacity?: string;
  bookingTimeTo?: Date | string;
  facilityType?: string;
  bookingTimeFrom?: Date | string;
  order?: string;
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
  bookingDate?: string;
  bookingTimeFrom?: string;
  bookingTimeTo?: string;
  order?: string;
};
function FacilityBookingSearch({
  onChange,
  searchOptions,
  defaultCondition,
}: FilterPros) {
  const [searchSelection, setSearchSelection] =
    React.useState<SearchSelections>(defaultCondition ? defaultCondition : {});
  const [desktopFilterOpen, setDesktopFilterOpen] = React.useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

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
    setMobileFilterOpen(false);
    setDesktopFilterOpen(false);
  };

  const handleDateFilterStartTime = (time: Date) => {
    let currentTime;
    const selectedTime = new Date(time);
    if (
      searchSelection.bookingDate &&
      format(new Date(searchSelection.bookingDate), "yyyy-MM-dd") ===
        format(new Date(), "yyyy-MM-dd")
    )
      currentTime = new Date();
    else if (searchSelection.bookingTimeTo)
      currentTime = new Date(searchSelection.bookingTimeTo);
    else return true;

    return currentTime.getTime() > selectedTime.getTime();
  };

  const handleDateFilterEndTime = (time: Date) => {
    let currentTime;
    const selectedTime = new Date(time);

    if (
      searchSelection.bookingDate &&
      format(new Date(searchSelection.bookingDate), "yyyy-MM-dd") ===
        format(new Date(), "yyyy-MM-dd")
    )
      currentTime = new Date();
    else if (searchSelection.bookingTimeFrom)
      currentTime = new Date(searchSelection.bookingTimeFrom);
    else return true;

    return currentTime.getTime() < selectedTime.getTime();
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
      <div className="w-max lg:hidden flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Dialog open={desktopFilterOpen} onOpenChange={setDesktopFilterOpen}>
            <DialogTrigger>
              <div className="flex items-center gap-2">
                <FaSliders />
                Filter
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogDescription>
                  {/* <MobileFilterForm
                    handleClickFilter={handleClickFilter}
                    availableSearchSelections={availableSearchSelections}
                    searchSelections={searchSelections}
                  /> */}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span> Sort By</span>
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleClickFilter({ order: "ASC" })}
              >
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleClickFilter({ order: "DSC" })}
              >
                Alphabetical (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="hidden w-full lg:flex lg:flex-1 gap-4 items-start">
        <div className="flex flex-col flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold"> Status</span>
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleClickFilter({ status: "" })}
              >
                Any
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
              {searchSelection.status ? searchSelection.status : "Any"}{" "}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="font-semibold"> Booking Date</span>

                <FaChevronDown />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  searchSelection.bookingDate
                    ? new Date(searchSelection.bookingDate)
                    : undefined
                }
                onSelect={(date) => handleClickFilter({ bookingDate: date })}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 3}
                footer={
                  <div className={"flex justify-end"}>
                    <Button
                      asChild={false}
                      onClick={() => {
                        handleClickFilter({ bookingDate: undefined });
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
            {searchSelection.bookingDate ? (
              format(new Date(searchSelection.bookingDate), "PPP")
            ) : (
              <span>Any</span>
            )}
          </div>
        </div>

        <div className="flex flex-col cursor-pointer flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Start Time</span>
                <DatePickerReact
                  selected={
                    searchSelection.bookingTimeFrom
                      ? new Date(searchSelection.bookingTimeFrom)
                      : undefined
                  }
                  onChange={(date: Date) => {
                    handleClickFilter({ bookingTimeFrom: date });
                  }}
                  customInput={<FaChevronDown />}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  filterTime={handleDateFilterStartTime}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                >
                  <div>
                    <Button
                      asChild={false}
                      onClick={() => {
                        handleClickFilter({ bookingTimeFrom: undefined });
                      }}
                      className="bg-black hover:bg-slate-200 hover:text-black"
                    >
                      {" "}
                      Clear Time
                    </Button>
                  </div>
                </DatePickerReact>
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>

          <div>
            <span>
              {" "}
              {searchSelection.bookingTimeFrom
                ? format(new Date(searchSelection.bookingTimeFrom), "h:mm aa")
                : "Any"}{" "}
            </span>
          </div>
        </div>

        <div className="flex flex-col cursor-pointer flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">End Time</span>
                <DatePickerReact
                  selected={
                    searchSelection.bookingTimeTo
                      ? new Date(searchSelection.bookingTimeTo)
                      : undefined
                  }
                  onChange={(date: Date) => {
                    handleClickFilter({ bookingTimeTo: date });
                  }}
                  customInput={<FaChevronDown />}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  filterTime={handleDateFilterEndTime}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                >
                  <div className="display: contents">
                    <Button
                      asChild={false}
                      onClick={() => {
                        handleClickFilter({ bookingTimeTo: undefined });
                      }}
                      className="bg-black hover:bg-slate-200 hover:text-black"
                    >
                      {" "}
                      Clear Time
                    </Button>
                  </div>
                </DatePickerReact>
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>

          <div>
            <span>
              {" "}
              {searchSelection.bookingTimeTo
                ? format(new Date(searchSelection.bookingTimeTo), "h:mm aa")
                : "Any"}{" "}
            </span>
          </div>
        </div>
        <div className="self-end flex-1">
          <Dialog open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <DialogTrigger>
              <div className="flex items-center gap-2">
                <FaSliders />
                More Filters
              </div>
            </DialogTrigger>
            {/* <DialogContent>
              <DialogHeader>
                <DialogDescription></DialogDescription>
              </DialogHeader>
            </DialogContent> */}
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default FacilityBookingSearch;
