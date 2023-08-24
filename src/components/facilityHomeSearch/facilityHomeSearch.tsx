"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { BiSolidTimeFive } from "react-icons/bi";
import { FaCalendar, FaChevronDown, FaCheck } from "react-icons/fa6";

import { Calendar } from "@/components/ui/calendar";

import DatePickerReact from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/facilityHomeSearch/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { FaRegClock } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";

const facilitySearchFormSchema = z.object({
  userId: z.string().optional(),
  facilityType: z.string().optional(),
  buildingName: z.string().optional(),
  bookingDate: z.date().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  capacity: z.number().optional(),
});

function FacilitySearch({ selection }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [bookingDateFrom, setBookingDateFrom] = useState<Date>(
    (selection.bookingDateFrom && new Date(selection.bookingDateFrom)) ||
      new Date()
  );
  const [bookingDateTo, setBookingDateTo] = useState<Date>(
    (selection.bookingDateTo && new Date(selection.bookingDateTo)) || new Date()
  );
  const [bookingTimeFrom, setBookingTimeFrom] = useState<Date>();
  const [minCapacity, setMinCapacity] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(1000);
  const [timeArr, setTimeArr] = useState<Date[]>([]);
  const [startTimeArr, setStartTimeArr] = useState<Date[]>([]);
  const [endTimeArr, setEndTimeArr] = useState<Date[]>([]);

  type FilterObject = {
    bookingDate?: Date;
    buildingName?: string;
    capacity?: number | null;
    endTime?: Date;
    facilityType?: string;
    startTime?: Date;
  };

  const form = useForm<z.infer<typeof facilitySearchFormSchema>>({
    resolver: zodResolver(facilitySearchFormSchema),
    defaultValues: {
      // userId: "",
      // facilityType: "",
      // buildingName: "",
      // bookingDate: "",
      // startTime: "",
      // endTime: "",
      // capacity: 0,
    },
  });

  const handlerSubmitTime = (
    bookingDate?: Date,
    startTime?: Date | string | undefined,
    endTime?: Date | string | undefined
  ) => {
    let bookTime = bookingDate || bookingTimeFrom;
    let bookDate = bookTime ? new Date(bookTime) : new Date();
    const bookingDateString = format(bookDate, "PP");
    if (startTime) {
      const startHourTimeStr = format(new Date(startTime), "h:mm aa");
      const startTimeStr = Date.parse(
        bookingDateString + " " + startHourTimeStr
      );
      startTime = new Date(startTimeStr);
    }
    if (endTime) {
      const endHourTimeStr = format(new Date(endTime), "h:mm aa");
      const endTimeStr = Date.parse(bookingDateString + " " + endHourTimeStr);
      endTime = new Date(endTimeStr);
    }
    return {
      startTime,
      endTime,
    };
  };
  const onSubmit = async (data: any) => {
    let currentQuery = {};
    if (!bookingTimeFrom)
      selection.bookingTimeFrom &&
        setBookingTimeFrom(new Date(selection.bookingTimeFrom));

    for (let item in data) {
      if (data[item] instanceof Date) {
        data[item] = data[item].toISOString();
      }
    }

    let timeObj = handlerSubmitTime(
      data.bookingDate,
      data.startTime,
      data.endTime
    );
    data = {
      ...data,
      startTime:
        timeObj.startTime instanceof Date
          ? timeObj.startTime.toISOString()
          : undefined,
      endTime:
        timeObj.endTime instanceof Date
          ? timeObj?.endTime?.toISOString()
          : undefined,
    };
    console.log("data", data);
    const updatedQuery: any = {
      ...currentQuery,
      ...data,
    };

    const url = qs.stringifyUrl(
      {
        url: "/facility/search",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  };

  useEffect(() => {
    selection.bookingDateFrom &&
      setBookingDateFrom(new Date(selection.bookingDateFrom));
    selection.bookingDateTo &&
      setBookingDateTo(new Date(selection.bookingDateTo));
    selection.bookingTimeFrom &&
      setBookingTimeFrom(new Date(selection.bookingTimeFrom));
    selection.minCapacity && setMinCapacity(selection.minCapacity);
    selection.maxCapacity && setMaxCapacity(selection.maxCapacity);
    selection.timeRanges &&
      setTimeArr(selection.timeRanges.map((time: string) => handlerTime(time)));
    console.log("selection", selection);
  }, [selection]);

  const handlerTime = (timeString: string) => {
    const currentString = format(new Date(), "PP");
    const currentTime = Date.parse(currentString + " " + timeString);
    const currentDate = new Date(currentTime);
    return currentDate;
  };

  // filter startTimeArr
  const filterStartPassTime = useCallback(
    (date: Date, startTimeArr: Date[]) => {
      return startTimeArr.filter((time) => date.getTime() > time.getTime());
    },
    []
  );

  // filter endTimeArr
  const filterEndPassTime = useCallback((date: Date, endTimeArr: Date[]) => {
    return endTimeArr.filter((time) => date.getTime() < time.getTime());
  }, []);

  // set startTimeArr and endTimeArr
  useEffect(() => {
    // set startTimeArr
    if (endDate) setStartTimeArr(filterStartPassTime(endDate, timeArr));
    else setStartTimeArr(timeArr);

    //set endTimeArr
    if (startDate) setEndTimeArr(filterEndPassTime(startDate, timeArr));
    else setEndTimeArr(timeArr);
  }, [timeArr, startDate, endDate, filterStartPassTime, filterEndPassTime]);

  const [facilityTypeOpen, setFacilityTypeOpen] = useState(false);
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [mobileFacilityTypeOpen, setMobileFacilityTypeOpen] = useState(false);
  const [mobileBuildingOpen, setMobileBuildingOpen] = useState(false);

  return (
    <div className="mx-auto mb-4 md:max-w-[606px] max-w-[360px]  rounded-xl shadow-lg flex flex-col bg-blue-500">
      <div className="p-6">
        <div className="text-2xl pb-3 md:text-4xl text-white font-semi mb-2">
          Search Our Facilities
        </div>
        {/* Desktop */}
        <div className="hidden md:block">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <FormField
                    control={form.control}
                    name="facilityType"
                    render={({ field }) => (
                      <FormItem>
                        <Popover
                          open={facilityTypeOpen}
                          onOpenChange={setFacilityTypeOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full h-full justify-between rounded-l-md text-base",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? selection.facilityTypes.find(
                                      (item) => item === field.value
                                    )
                                  : "Any Facility"}
                                <FaChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search facility..."
                                className="h-9 "
                              />
                              <CommandEmpty>No facility found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value={""}
                                  key={""}
                                  onSelect={() => {
                                    form.setValue("facilityType", "");
                                    setFacilityTypeOpen(false);
                                  }}
                                >
                                  {"Any Facility"}
                                  <FaCheck
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      "" === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                                {selection.facilityTypes.map((item) => (
                                  <CommandItem
                                    value={item}
                                    key={item}
                                    onSelect={() => {
                                      form.setValue("facilityType", item);
                                      setFacilityTypeOpen(false);
                                    }}
                                  >
                                    {item}
                                    <FaCheck
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        item === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "flex-1 px-4 text-sm md:text-base h-auto  text-left font-normal bg-white rounded-r-none",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder="Any Facility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Any Facility</SelectItem>
                            {selection.facilityTypes.map((item:string,index:number) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> */}
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="buildingName"
                    render={({ field }) => (
                      <FormItem>
                        <Popover
                          open={buildingOpen}
                          onOpenChange={setBuildingOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              {/* <div className="flex-1 px-4 text-sm md:text-base h-auto  text-left font-normal bg-white rounded-r-none"> */}
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full h-full justify-between rounded-r-md text-base",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? selection.buildings.find(
                                      (item) => item.buildingName === field.value
                                    )?.buildingName
                                  : "Any Building"}
                                <FaChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                              {/* </div> */}
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 ">
                            <Command>
                              <CommandInput
                                placeholder="Search buildings..."
                                className="h-9 "
                              />
                              <ScrollArea className="h-96">
                                <CommandEmpty>No buildings found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value={""}
                                    key={""}
                                    onSelect={() => {
                                      form.setValue("buildingName", "");
                                      setBuildingOpen(false);
                                    }}
                                  >
                                    {"Any Building"}
                                    <FaCheck
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        "" === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                  {selection.buildings.map((item) => (
                                    <CommandItem
                                      value={item.buildingName}
                                      key={item.buildingID}
                                      onSelect={() => {
                                        form.setValue(
                                          "buildingName",
                                          item.buildingName
                                        );
                                        setBuildingOpen(false);
                                      }}
                                    >
                                      {item.buildingName}
                                      <FaCheck
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          item.buildingName === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </ScrollArea>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "flex-1 px-4 text-sm md:text-base h-auto  text-left font-normal bg-white rounded-l-none",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder="Any Building" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Any Building</SelectItem>
                            {selection.buildings.map(
                              (item: any, index: number) => (
                                <SelectItem
                                  key={item.buildingID}
                                  value={item.buildingName}
                                >
                                  {item.buildingName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select> */}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2 row-span-2 grid grid-cols-2">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="bookingDate"
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full px-4 text-sm md:text-base h-auto text-left font-normal rounded-t-md",
                                    // "flex-1 pl-3 text-left font-normal bg-white",

                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <FaCalendar className="ml-auto h-5 w-5  text-gray-400" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < addDays(bookingDateFrom, 0) ||
                                  date > addDays(bookingDateTo, 0)
                                }
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 3}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <DatePickerReact
                              placeholderText="Start Time"
                              className={cn(
                                "flex-1 px-4 text-sm md:text-base h-auto text-left font-normal bg-white flex w-full items-center justify-between rounded-md rounded-r-none rounded-t-none border border-input  ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                !field && "text-muted-foreground"
                              )}
                              wrapperClassName="w-full"
                              selected={startDate}
                              onChange={(date: Date) => {
                                field.onChange(date);
                                setStartDate(date);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              includeTimes={startTimeArr}
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                            />
                            <BiSolidTimeFive className="w-5 h-5 absolute top-3 right-4 text-gray-400" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <DatePickerReact
                              className={cn(
                                "flex-1 px-4 text-sm md:text-base h-auto  text-left font-normal bg-white flex w-full items-center justify-between rounded-md rounded-l-none rounded-t-none border border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                !field && "text-muted-foreground"
                              )}
                              wrapperClassName="w-full"
                              placeholderText="End Time"
                              selected={endDate}
                              onChange={(date: Date) => {
                                field.onChange(date);
                                setEndDate(date);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              includeTimes={endTimeArr}
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                            />
                            <BiSolidTimeFive className="w-5 h-5 absolute top-3 right-4 text-gray-400" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className=" col-span-2">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min={minCapacity}
                            max={maxCapacity}
                            placeholder="Select Capacity"
                            className="text-base px-4 py-2 md:text-base h-auto placeholder-black placeholder-opacity-100"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="px-6 pt-4 pb-2 self-center">
                <Button
                  type="submit"
                  className="bg-white text-sm md:text-base font-normal py-4 px-0 min-w-[210px] max-w-[210px] max-h-[72px] text-blue-500 hover:bg-gray-500"
                >
                  Search Facilities
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Mobile */}
        <div className="block md:hidden">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-md">
                  <FormField
                    control={form.control}
                    name="facilityType"
                    render={({ field }) => (
                      <FormItem>
                        <Popover
                          open={mobileFacilityTypeOpen}
                          onOpenChange={setMobileFacilityTypeOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full h-full justify-between rounded-t-md",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? selection.facilityTypes.find(
                                      (item) => item === field.value
                                    )
                                  : "Any Facility"}
                                <FaChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search facility..."
                                className="h-9 "
                              />
                              <CommandEmpty>No facility found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value={""}
                                  key={""}
                                  onSelect={() => {
                                    form.setValue("facilityType", "");
                                    setMobileFacilityTypeOpen(false);
                                  }}
                                >
                                  {"Any Facility"}
                                  <FaCheck
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      "" === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                                {selection.facilityTypes.map((item) => (
                                  <CommandItem
                                    value={item}
                                    key={item}
                                    onSelect={() => {
                                      form.setValue("facilityType", item);
                                      setMobileFacilityTypeOpen(false);
                                    }}
                                  >
                                    {item}
                                    <FaCheck
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        item === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "flex-1 px-4 text-sm md:text-base h-auto  text-left font-normal bg-white rounded-r-none",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder="Any Facility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Any Facility</SelectItem>
                            {selection.facilityTypes.map((item:string,index:number) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> */}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="buildingName"
                    render={({ field }) => (
                      <FormItem>
                        <Popover
                          open={mobileBuildingOpen}
                          onOpenChange={setMobileBuildingOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              {/* <div className="flex-1 px-4 text-sm md:text-base h-auto  text-left font-normal bg-white rounded-r-none"> */}
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full h-full justify-between rounded-b-md",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? selection.buildings.find(
                                      (item) => item.buildingName === field.value
                                    )?.buildingName
                                  : "Any Building"}
                                <FaChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                              {/* </div> */}
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search buildings..."
                                className="h-9 "
                              />
                              <ScrollArea className="max-h-40">
                                <CommandEmpty>No buildings found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem
                                    value={""}
                                    key={""}
                                    onSelect={() => {
                                      form.setValue("buildingName", "");
                                      setMobileBuildingOpen(false);
                                    }}
                                  >
                                    {"Any Building"}
                                    <FaCheck
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        "" === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                  {selection.buildings.map((item) => (
                                    <CommandItem
                                      value={item.buildingName}
                                      key={item.buildingID}
                                      onSelect={() => {
                                        form.setValue(
                                          "buildingName",
                                          item.buildingName
                                        );
                                        setMobileBuildingOpen(false);
                                      }}
                                    >
                                      {item.buildingName}
                                      <FaCheck
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          item.buildingName === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </ScrollArea>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "flex-1 px-4 text-sm md:text-base h-auto  text-left font-normal bg-white rounded-l-none",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder="Any Building" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Any Building</SelectItem>
                            {selection.buildings.map(
                              (item: any, index: number) => (
                                <SelectItem
                                  key={item.buildingID}
                                  value={item.buildingName}
                                >
                                  {item.buildingName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select> */}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-white rounded-md">
                  <FormField
                    control={form.control}
                    name="bookingDate"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-4 text-sm h-auto rounded-t-md text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <FaCalendar className="ml-auto h-4 w-4 text-gray-400" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < addDays(bookingDateFrom, 0) ||
                                date > addDays(bookingDateTo, 0)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <DatePickerReact
                              placeholderText="Start Time"
                              className={cn(
                                "flex-1 pl-4 text-sm h-auto text-left font-normal bg-white flex w-full items-center justify-between border border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                !field && "text-muted-foreground"
                              )}
                              wrapperClassName="w-full"
                              selected={startDate}
                              onChange={(date: Date) => {
                                field.onChange(date);
                                setStartDate(date);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              includeTimes={startTimeArr}
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                            />
                            <BiSolidTimeFive className="w-4 h-4 absolute top-3 right-5 text-gray-400" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <DatePickerReact
                              className={cn(
                                "flex-1 pl-4 text-sm h-auto text-left font-normal bg-white flex w-full items-center justify-between rounded-b-md border border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                !field && "text-muted-foreground"
                              )}
                              wrapperClassName="w-full"
                              placeholderText="End Time"
                              selected={endDate}
                              onChange={(date: Date) => {
                                field.onChange(date);
                                setEndDate(date);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              includeTimes={endTimeArr}
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                            />
                            <BiSolidTimeFive className="w-4 h-4 absolute top-3 right-5 text-gray-400" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min={minCapacity}
                          max={maxCapacity}
                          placeholder="Select Capacity"
                          className="pl-4 py-2 text-sm h-auto placeholder-black placeholder-opacity-100"
                          {...field}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="px-6 pt-4 pb-2 self-center">
                <Button
                  type="submit"
                  className="bg-white px-4 text-blue-500 hover:bg-grey-500"
                >
                  Search Facilities
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default FacilitySearch;
