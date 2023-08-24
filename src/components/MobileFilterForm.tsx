"use client";

import { format, addDays } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import DatePickerReact from "react-datepicker";
import { FaCalendar as CalendarIcon } from "react-icons/fa6";
import { BiSolidTimeFive } from "react-icons/bi";
import { useState, SyntheticEvent, useEffect, useCallback } from "react";

const MobileFilterFormSchema = z.object({
  facilityType: z.string().optional(),
  buildingName: z.string().optional(),
  bookingDate: z.date().optional(),
  startTime: z.date().optional()  || z.string() || z.undefined(),
  endTime: z.date().optional()  || z.string() || z.undefined(),
  capacity: z.number().optional().nullable()
});

type MobileFilterFormValues = z.infer<typeof MobileFilterFormSchema>;

type FilterPros = {
  handleClickFilter:any;
  availableSearchSelections:SearchSelections;
  searchSelections:FilterObject;
}
type FilterObject = {
  bookingDate?:Date;
  buildingName?:string;
  capacity?:number | null;
  endTime?:Date;
  facilityType?:string;
  startTime?:Date;
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
export function MobileFilterForm({
  handleClickFilter,
  availableSearchSelections,
  searchSelections,
}:FilterPros) {
  let [startTime, setStartDate] = useState<Date | undefined>(searchSelections.startTime && new Date(searchSelections.startTime));
  let [endTime, setEndDate] = useState<Date | undefined>(searchSelections.endTime && new Date(searchSelections.endTime));
  const [bookingDate,setBookingDate] = useState<Date | undefined>(searchSelections.bookingDate && new Date(searchSelections.bookingDate));
  const [bookingDateFrom,setBookingDateFrom] = useState<Date>((availableSearchSelections.bookingDateFrom && new Date(availableSearchSelections.bookingDateFrom))||new Date());
  const [bookingDateTo,setBookingDateTo] = useState<Date>((availableSearchSelections.bookingDateTo && new Date(availableSearchSelections.bookingDateTo))||new Date());
  const [bookingTimeFrom,setBookingTimeFrom] = useState<Date>();
  const [minCapacity,setMinCapacity] = useState(0);
  const [maxCapacity,setMaxCapacity] = useState(1000);
  const [timeArr,setTimeArr]=useState<Date[]>([]);
  const [startTimeArr,setStartTimeArr]=useState<Date[]>([]);
  const [endTimeArr,setEndTimeArr]=useState<Date[]>([]);


  const form = useForm<MobileFilterFormValues>({
    resolver: zodResolver(MobileFilterFormSchema),
    defaultValues:{
      capacity:searchSelections.capacity && Number(searchSelections.capacity)
    },
    mode: "onChange",
  });

  function onSubmit(data: MobileFilterFormValues) {
    if(!bookingTimeFrom)  availableSearchSelections.bookingTimeFrom && setBookingTimeFrom( new Date(availableSearchSelections.bookingTimeFrom));
    // If the following fields have initial values and have not changed, but there is no initial value in data, they are assigned in the following way
    if(startTime && !data.startTime) data.startTime = startTime;
    if(endTime && !data.endTime) data.endTime = endTime;
    if(bookingDate && !data.bookingDate) data.bookingDate = bookingDate;
    if(searchSelections.buildingName && !data.buildingName) data.buildingName = searchSelections.buildingName;
    if(searchSelections.facilityType && !data.facilityType) data.facilityType = searchSelections.facilityType;

    let timeObj = handlerSubmitTime(false,data.bookingDate,data.startTime,data.endTime);
    data={
      ...data,
      startTime:timeObj.startTime instanceof Date ? timeObj.startTime.toISOString() : undefined,
      endTime:timeObj.endTime instanceof Date ? timeObj?.endTime?.toISOString() : undefined
    }

    handleClickFilter(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  useEffect(()=>{
    availableSearchSelections.bookingDateFrom && setBookingDateFrom( new Date(availableSearchSelections.bookingDateFrom));
    availableSearchSelections.bookingDateTo && setBookingDateTo( new Date(availableSearchSelections.bookingDateTo));
    availableSearchSelections.bookingTimeFrom && setBookingTimeFrom( new Date(availableSearchSelections.bookingTimeFrom));
    availableSearchSelections.minCapacity && setMinCapacity(availableSearchSelections.minCapacity);
    availableSearchSelections.maxCapacity && setMaxCapacity(availableSearchSelections.maxCapacity);
    availableSearchSelections.timeRanges && setTimeArr(availableSearchSelections.timeRanges.map((time: string)=>handlerTime(time)));
  },[availableSearchSelections]);

  const handlerTime = (timeString:string) => {
    const currentString = format(new Date(),'PP')
    const currentTime = Date.parse(currentString+" " + timeString);
    const currentDate = new Date(currentTime);
    return currentDate;
  };
  const handlerSubmitTime = (type=false,bookingDate?:Date,startTime?:Date | string | undefined,endTime?:Date |string |undefined)=>{
    let bookTime= bookingDate || bookingTimeFrom;
    let bookDate = bookTime ? (new Date(bookTime)):new Date();
    if(type) bookDate = new Date();
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
  // filter startTimeArr
  const filterStartPassTime = useCallback((date:Date,startTimeArr:Date[]) => {
    return startTimeArr.filter(time => date.getTime() > time.getTime());
  },[]);
  
  // filter endTimeArr
  const filterEndPassTime = useCallback((date:Date,endTimeArr:Date[]) => {
    return endTimeArr.filter(time =>date.getTime() < time.getTime());
  },[]);
  
  // set startTimeArr and endTimeArr
  useEffect(()=>{
    let timeParams:any = handlerSubmitTime(true,new Date(),startTime,endTime);
    // set startTimeArr
    if(endTime)setStartTimeArr(filterStartPassTime(timeParams.endTime,timeArr));
    else setStartTimeArr(timeArr);
     //set endTimeArr
     if(startTime) setEndTimeArr(filterEndPassTime(timeParams.startTime,timeArr));
     else setEndTimeArr(timeArr);
   },[timeArr,startTime,endTime,filterStartPassTime,filterEndPassTime]);

  function resetForm(e:SyntheticEvent){
    e.preventDefault();
    let data:FilterObject = {
      capacity: null,
      startTime: undefined,
      endTime: undefined,
      buildingName:undefined,
      facilityType:undefined,
      bookingDate:undefined
    }
    handleClickFilter(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField
          control={form.control}
          name="facilityType"
          render={({ field }) => (
            <FormItem className="px-6">
              <FormLabel>Facility Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={
                  searchSelections.facilityType
                    ? searchSelections.facilityType
                    : ""
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Facility Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value=""
                    // onClick={() => handleClickFilter({ facilityType: "" })}
                  >
                    Any
                  </SelectItem>
                  {availableSearchSelections.facilityTypes &&
                    availableSearchSelections.facilityTypes.map((item,index) => (
                      <SelectItem
                        key={item+index}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="buildingName"
          render={({ field }) => (
            <FormItem className="px-6">
              <FormLabel>Building Name</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={
                  searchSelections.buildingName
                    ? searchSelections.buildingName
                    : ""
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value=""
                    // onClick={() => handleClickFilter({ facilityType: "" })}
                  >
                    Any
                  </SelectItem>
                  {availableSearchSelections.facilityTypes &&
                    availableSearchSelections.buildings.map((building,index) => (
                      <SelectItem
                        key={building.buildingID + index}
                        value={building.buildingName}
                      >
                        {building.buildingName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bookingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col px-6">
              <FormLabel>Booking Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal rounded-md",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {bookingDate ? (
                        format(new Date(bookingDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 text-black"/>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
                    disabled={
                      (date) => date < addDays(bookingDateFrom,0) || date > addDays(bookingDateTo,0)
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
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="px-6">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <div className="relative">
                  <DatePickerReact
                    placeholderText="Start Time"
                    className={cn(
                      "flex-1 pl-3 text-left font-normal bg-white flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      !field && "text-muted-foreground"
                    )}
                    wrapperClassName="w-full"
                    selected={startTime}
                    onChange={(date: Date) => {
                      field.onChange(date);
                      setStartDate(date);
                    }}
                    includeTimes={startTimeArr}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                  <BiSolidTimeFive className="w-4 h-4 absolute top-3 right-4 text-black"/>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="px-6">
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <div className="relative">
                  <DatePickerReact
                    className={cn(
                      "flex-1 pl-3 text-left font-normal bg-white flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      !field && "text-muted-foreground"
                    )}
                    wrapperClassName="w-full"
                    placeholderText="End Time"
                    selected={endTime}
                    onChange={(date: Date) => {
                      field.onChange(date);
                      setEndDate(date);
                    }}
                    includeTimes={endTimeArr}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  />
                  <BiSolidTimeFive className="w-4 h-4 absolute top-3 right-4 text-black"/>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem className="px-6">
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={minCapacity}
                  max={maxCapacity}
                  placeholder="Select Capacity"
                  className="placeholder-black placeholder-opacity-100"
                  {...field}
                  onChange={(event) => {
                    if (event.target.value == "")
                      field.onChange(null)
                    else
                      field.onChange(Number(event.target.value))
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end bg-[#F0F0F0] pr-6 text-blue-500">
          <button onClick={resetForm}>Clear All</button>
          <Button className="ml-5"type="submit">
            Apply Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}
