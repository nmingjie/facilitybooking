"use client";
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
import { toast } from "@/components/ui/use-toast";
import DatePickerReact from "react-datepicker";
import { useState, SyntheticEvent, useEffect, useCallback } from "react";
import { BiSolidTimeFive } from "react-icons/bi";
import { format } from "date-fns";

const DesktopFilterFormSchema = z.object({
  capacity : z.number().optional().nullable(),
  startTime: z.date().optional() || z.string().optional() || z.undefined().optional(),
  endTime: z.date().optional() || z.string().optional() || z.undefined().optional(),
});

type DesktopFilterFormValues = z.infer<typeof DesktopFilterFormSchema>;
type FilterPros = {
  handleClickFilter:any;
  availableSearchSelections:SearchSelectionsParams;
  searchSelections:FilterObject;
}
type FilterObject = {
  bookingDate?:Date;
  buildingName?:string;
  capacity?:number | null;
  endTime?:Date | undefined | string;
  facilityType?:string;
  startTime?:Date | undefined | string;
}
type SearchSelectionsParams = {
  buildings: Array<object>;
  facilityTypes: Array<string>;
  timeRanges: Array<string>;
  bookingDateFrom:string;
  bookingDateTo:string;
  bookingTimeFrom:string;
  bookingTimeTo:string;
  minCapacity: number,
  maxCapacity: number
}
export function DesktopFilterForm({
  handleClickFilter,
  availableSearchSelections,
  searchSelections
}:FilterPros) {
  let [startTime, setStartTime] = useState<Date>();
  let [endTime, setEndTime] = useState<Date>();
  const [bookingTimeFrom,setBookingTimeFrom] = useState<Date>();
  const [minCapacity,setMinCapacity] = useState(0);
  const [maxCapacity,setMaxCapacity] = useState(1000);
  const [timeArr,setTimeArr]=useState<Date[]>([]);
  const [startTimeArr,setStartTimeArr]=useState<Date[]>([]);
  const [endTimeArr,setEndTimeArr]=useState<Date[]>([]);
  const form = useForm<z.infer<typeof DesktopFilterFormSchema>>({
    resolver: zodResolver(DesktopFilterFormSchema),
    defaultValues:{
      capacity:searchSelections.capacity && Number(searchSelections.capacity)
    },
    mode: "onChange",
  });

  useEffect(()=>{
    searchSelections.startTime &&setStartTime(new Date(searchSelections.startTime));
    searchSelections.endTime &&setEndTime(new Date(searchSelections.endTime));
    availableSearchSelections.bookingTimeFrom && setBookingTimeFrom( new Date(availableSearchSelections.bookingTimeFrom));
    availableSearchSelections.minCapacity && setMinCapacity(availableSearchSelections.minCapacity);
    availableSearchSelections.maxCapacity && setMaxCapacity(availableSearchSelections.maxCapacity);
    availableSearchSelections.timeRanges && setTimeArr(availableSearchSelections.timeRanges.map((time: string)=>handlerTime(time)));
  },[availableSearchSelections,searchSelections]);
  const handlerTime = (timeString:string) => {
    const currentString = format(new Date(),'PP')
    const currentTime = Date.parse(currentString+" " + timeString);
    const currentDate = new Date(currentTime);
    return currentDate;
  };
  // filter startTimeArr
  const filterStartPassTime = (date:Date,startTimeArr:Date[]) => {
    return startTimeArr.filter(time => date.getTime() > time.getTime());
  };
  
  // filter endTimeArr
  const filterEndPassTime = (date:Date,endTimeArr:Date[]) => {
    return endTimeArr.filter(time =>date.getTime() < time.getTime());
  };
  // set startTimeArr and endTimeArr
  useEffect(()=>{
    let timeParams:any = {};
    timeParams =handlerSubmitTime(true,new Date(),startTime,endTime);
    // set startTimeArr
    if(endTime)setStartTimeArr(filterStartPassTime(timeParams.endTime,[...timeArr]));
    else setStartTimeArr(timeArr);
    //set endTimeArr
    if(startTime) setEndTimeArr(filterEndPassTime(timeParams.startTime,[...timeArr]));
    else setEndTimeArr(timeArr);
  },[timeArr,startTime,endTime]);

  function onSubmit(data: DesktopFilterFormValues) {
    // When the startTime and endTime have values and are not modified, and there is no initial value for these two times in the data, 
    // the value is assigned in the following way
    if(startTime && !data.startTime) data.startTime = startTime;
    if(endTime && !data.endTime) data.endTime = endTime;
    let timeObj = handlerSubmitTime(false,searchSelections.bookingDate,data.startTime,data.endTime);
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
  function resetForm(e:SyntheticEvent){
    e.preventDefault();
    let data:FilterObject = {
      capacity: null,
      startTime: undefined,
      endTime: undefined
    }
    handleClickFilter(data);
  }
  return (
    <Form {...form} >
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8"
        >
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
                      setStartTime(date);
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
                      setEndTime(date);
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
                  onChange={(event) =>{
                      if (event.target.value == "")
                        field.onChange(null)
                      else
                        field.onChange(Number(event.target.value))
                    }
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end bg-[#F0F0F0] pr-6 text-blue-500">
          <button onClick={resetForm}>Clear All</button>
          <Button className="ml-5" type="submit">
            Apply Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}
