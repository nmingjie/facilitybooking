"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import qs from "query-string";

import { useRouter, useSearchParams } from "next/navigation";

import { useCallback, useEffect } from "react";

import {
  FaSliders,
  FaMapLocation,
  FaChevronDown,
  FaListUl,
} from "react-icons/fa6";
import { BiSortAlt2 } from "react-icons/bi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";

import { DesktopFilterForm } from "./DesktopFilterForm";
import { MobileFilterForm } from "./MobileFilterForm";
import request from "@/api/request";

type FilterObject = {
  bookingDate?:Date;
  buildingName?:string;
  capacity?:number;
  endTime?:Date;
  facilityType?:string;
  startTime?:Date;
}
type FilterPros = {
  handleViewModeClick:any;
  mode:string;
  handleClickSort:any;
  sortOrder:any;
}
type SearchSelections = {
  buildings: Array<Building>;
  facilityTypes: Array<string>;
  timeRanges: Array<string>;
  bookingDateFrom:string;
  bookingDateTo:string;
  bookingTimeFrom:string;
  bookingTimeTo:string;
  minCapacity: number,
  maxCapacity: number
}
type Building = {
  buildingAddress:string;
  buildingCode:string;
  buildingID:string;
  buildingName:string;
  facilityType:string;
}
function FacilitiesFilter({handleViewModeClick,mode,handleClickSort,sortOrder}:FilterPros) {
  const router = useRouter();
  const params = useSearchParams();
  let searchSelections: FilterObject = params ? qs.parse(params.toString()) : {};
  const [date, setDate] = React.useState<Date | undefined>(searchSelections.bookingDate && new Date(searchSelections.bookingDate));
  const [availableSearchSelections, setAvailableSearchSelections] = React.useState<SearchSelections>();
  const [desktopFilterOpen, setDesktopFilterOpen] = React.useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  useEffect(() => {
    request.get("/api/fb/Search").then((res) => {
      setAvailableSearchSelections(res.data);
    }).catch((e) => {
      throw new Error(e);
    })
  }, []);

  let sortOrderForm:any = {
    ASC: "Alphabetical (A-Z)",
    DSC: "Alphabetical (Z-A)",
  };

  const handleClickFilter = useCallback(
    (data:FilterObject) => {

      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString());
      }
      const updatedQuery: any = {
        ...currentQuery,
        ...data
      };
      for (let item in data) {
        let temp:any = data[item as keyof typeof data];
        if (temp instanceof Date) {
          updatedQuery[item] = temp.toISOString();
        }
      }
      searchSelections = {...updatedQuery};
      const url = qs.stringifyUrl(
        {
          url: "/facility/search/",
          query: updatedQuery,
        },
        { skipNull: true }
      );

      router.push(url);
      setMobileFilterOpen(false);
      setDesktopFilterOpen(false);

    },
    [router, params]
  );

  // Booking Date
  useEffect(() => {
    console.log("in effect 1", date);
    let currentQuery = params === null ? {} : qs.parse(params.toString());
    let timeParams:any = {};
    if(currentQuery.startTime || currentQuery.endTime) 
      timeParams = assemblyTime(date,currentQuery.startTime,currentQuery.endTime);
    handleClickFilter({ bookingDate: date, startTime: timeParams.startTime,  endTime:timeParams.endTime});
  }, [date]);

  const assemblyTime = (bookingDate?:Date | undefined,startTime?:Date | string | undefined,endTime?:Date |string |undefined)=>{
    let bookTime= bookingDate || availableSearchSelections?.bookingTimeFrom;
    let bookDate = bookTime ? (new Date(bookTime)):new Date();
    const bookingDateString = format(bookDate ,'PP');
    if(startTime){
      const startHourTimeStr = format(new Date(startTime), "h:mm aa");
      const startTimeStr = Date.parse(bookingDateString+" " + startHourTimeStr);
      startTime = new Date(startTimeStr);
    }
    if(endTime){
      const endHourTimeStr = format(new Date(endTime), "h:mm aa");
      const endTimeStr = Date.parse(bookingDateString+" " + endHourTimeStr);
      endTime = new Date(endTimeStr);
    }
    return {
      startTime,
      endTime
    }
  };
  return (
    <div>
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
              <DialogHeader className="bg-[#3A3A3A] text-white">
                <DialogTitle>More Filters</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <MobileFilterForm
                  handleClickFilter={handleClickFilter}
                  availableSearchSelections={availableSearchSelections}
                  searchSelections={searchSelections}
                />
              </DialogDescription>
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
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={() => handleClickSort("ASC")}>
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClickSort("DSC")}>
                Alphabetical (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <BiSortAlt2 />
          Sort By */}
        </div>
        {/* <div className="flex items-center gap-2" onClick={handleViewModeClick}>
          <div>
            <FaMapLocation />
            Map View
          </div>
        </div> */}
        {mode === "map" ? (
          <div
            className="flex items-center gap-2"
            onClick={() => handleViewModeClick("list")}
          >
            <FaListUl />
            List View
          </div>
        ) : (
          <div
            className="flex items-center gap-2"
            onClick={() => handleViewModeClick("map")}
          >
            <FaMapLocation />
            Map View
          </div>
        )}
      </div>
      <div className="hidden w-full lg:flex lg:flex-1 gap-4 items-start">
        <div className="flex flex-col flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold"> Facility Type</span>
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleClickFilter({ facilityType: "" })}
              >
                Any
              </DropdownMenuItem>
              {availableSearchSelections&&availableSearchSelections.facilityTypes &&
                availableSearchSelections.facilityTypes.map((item:string) => (
                  // value={item} onValueChange={handleClickFacilityType}
                  <DropdownMenuItem
                    key={item}
                    onClick={() => handleClickFilter({ facilityType: item })}
                  >
                    {" "}
                    {item}{" "}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <span>
              {" "}
              {searchSelections.facilityType
                ? searchSelections.facilityType
                : "Any"}{" "}
            </span>
          </div>
        </div>

        <div className="flex flex-col cursor-pointer flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Building Name</span>
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleClickFilter({ buildingName: "" })}
              >
                Any
              </DropdownMenuItem>
              {availableSearchSelections&&availableSearchSelections.buildings &&
                availableSearchSelections.buildings.map((building:any) => (
                  <DropdownMenuItem
                    key={building.buildingID}
                    onClick={() =>
                      handleClickFilter({ buildingName: building.buildingName })
                    }
                  >
                    {" "}
                    {building.buildingName}{" "}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <span>
              {" "}
              {searchSelections.buildingName
                ? searchSelections.buildingName
                : "Any"}{" "}
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
              {/* <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button> */}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={
                  (date) => date < addDays(availableSearchSelections&&availableSearchSelections.bookingDateFrom?new Date(availableSearchSelections.bookingDateFrom):new Date(),0) || date > addDays(availableSearchSelections&&availableSearchSelections.bookingDateTo?new Date(availableSearchSelections.bookingDateTo):new Date(),0)
                }
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 3}
              />
            </PopoverContent>
          </Popover>
          {/* <div className="flex items-center gap-2">
            Booking Date
            <FaChevronDown />
          </div> */}
          <div>
            {searchSelections.bookingDate ? (
              format(new Date(searchSelections.bookingDate), "PPP")
            ) : date ? (
              format(date, "PPP")
            ) : (
              <span>Any</span>
            )}
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
            <DialogContent>
              <DialogHeader className="bg-[#3A3A3A] text-white">
                <DialogTitle>More Filters</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <DesktopFilterForm
                  handleClickFilter={handleClickFilter}
                  availableSearchSelections={availableSearchSelections}
                  searchSelections={searchSelections}
                />
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold"> Sort By</span>
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={() => handleClickSort("ASC")}>
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClickSort("DSC")}>
                Alphabetical (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <span> {sortOrderForm[sortOrder]} </span>
          </div>
        </div>
        <div className="self-end flex-1">
          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer border-b-4 border-transparent",
              mode === "list" && "border-blue-500 text-blue-500"
            )}
            onClick={() => handleViewModeClick("list")}
          >
            <FaListUl />
            List View
          </div>
        </div>
        <div className="self-end flex-1">
          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer border-b-4 border-transparent",
              mode === "map" && " border-blue-500 text-blue-500"
            )}
            onClick={() => handleViewModeClick("map")}
          >
            <FaMapLocation />
            Map View
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacilitiesFilter;
