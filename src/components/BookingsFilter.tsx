"use client";

import * as React from "react";
import { format } from "date-fns";

import {
  FaSliders,
  FaFileCsv,
  FaChevronDown,
  FaListUl,
  FaMagnifyingGlass,
} from "react-icons/fa6";

import { BiSortAlt2 } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { PiFileCsvDuotone } from "react-icons/pi";

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

import { Calendar } from "@/components/ui/calendar";

function BookingFilter({ title }: CardProps) {
  const [date, setDate] = React.useState<Date>();

  return (
    <div>
      <div className="w-max lg:hidden flex items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-2 text-blue-600">
          <BsSearch size={20} />
          Search
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <FaSliders size={20} />
          Filters
        </div>
        <div className="flex items-center gap-2 text-blue-600">
          <PiFileCsvDuotone size={25} />
          Export All
        </div>
      </div>
      <div className="hidden w-max lg:flex lg:flex-1 gap-4 items-start">
        <div className="flex flex-col cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status</span>
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Meeting Room</DropdownMenuItem>
              <DropdownMenuItem>Lecture Room</DropdownMenuItem>
              <DropdownMenuItem>Event Space</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <span> Any </span>
          </div>
        </div>

        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2">
                Booking Date
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
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2">
            Booking Date
            <FaChevronDown />
          </div>
          <div>
            <span> Any </span>
          </div>
        </div>
        <div className="self-end">
          <div className="flex items-center gap-2">
            <FaSliders />
            More Filters
          </div>
        </div>
        {/* 
        <div className="flex flex-col">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                Sort By
                <FaChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Alphabetical (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Alphabetical (Z-A)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <span> Alphabetical (A-Z) </span>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default BookingFilter;
