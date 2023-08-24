"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { FaCalendar as CalendarIcon } from "react-icons/fa6";
import { Calendar } from "@/components/ui/calendar";

import DatePickerReact from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useState } from "react";

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
  // const params = useSearchParams();

  // const [facilityType, setFacilityType] = useState("");
  // const [buildingName, setBuildingName] = useState("");
  // const [startTime, setBathroomCount] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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

  //   function onSubmit(data) {
  //     console.log("test")
  // console.log(data);
  //   }
  const onSubmit = useCallback(
    async (data) => {
      // if (step !== STEPS.INFO) {
      //   return onNext();
      // }

      let currentQuery = {};

      // if (params) {
      //   currentQuery = qs.parse(params.toString());
      // }
      console.log("my data,", data);

      // data = Object.fromEntries(
      //   Object.entries(data).filter(([_, v]) => v != "" && v != null)
      // );

      for (let item in data) {
        if (data[item] instanceof Date) {
          data[item] = data[item].toISOString();
        }
      }
      // if (data.bookingDate) {
      //   data.bookingDate = data.bookingDate.toISOString()
      // }

      const updatedQuery: any = {
        ...currentQuery,
        ...data,
        // facilityType: data.facilityType,
        // buildingName: data.buildingName,

        // locationValue: location?.value,
        // guestCount,
        // roomCount,
        // bathroomCount
      };

      // if (dateRange.startDate) {
      //   updatedQuery.startDate = formatISO(dateRange.startDate);
      // }

      // if (dateRange.endDate) {
      //   updatedQuery.endDate = formatISO(dateRange.endDate);
      // }

      const url = qs.stringifyUrl(
        {
          url: "/facility/search",
          query: updatedQuery,
        },
        { skipNull: true }
      );

      // setStep(STEPS.LOCATION);
      // searchModal.onClose();
      router.push(url);
    },
    [
      // step,
      // searchModal,
      // location,
      router,
      // guestCount,
      // roomCount,
      // dateRange,
      // onNext,
      // bathroomCount,
      // params
    ]
  );

  return (
    <div className="mx-auto mb-4 md:w-3/4 rounded-xl shadow-lg flex flex-col bg-blue-500">
      <div className="p-6">
        <div className="text-4xl text-white font-semi mb-2">
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "flex-1 pl-3 text-left font-normal bg-white rounded-r-none",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder="Any Facility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Any Facility</SelectItem>
                            {selection.facilityTypes.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "flex-1 pl-3 text-left font-normal bg-white rounded-l-none",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <SelectValue placeholder="Any Building" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Any Building</SelectItem>
                            {selection.buildings.map((item) => (
                              <SelectItem
                                key={item.buildingID}
                                value={item.buildingName}
                              >
                                {item.buildingName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                                    "w-full pl-3 text-left font-normal rounded-b-none",
                                    // "flex-1 pl-3 text-left font-normal bg-white",

                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                                disabled={
                                  (date) => date < addDays(new Date(), 2)
                                  // ||
                                  // date < new Date("1900-01-01")
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
                          <DatePickerReact
                            placeholderText="Start Time"
                            className={cn(
                              "flex-1 pl-3 text-left font-normal bg-white flex h-10 w-full items-center justify-between rounded-md rounded-r-none rounded-t-none border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
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
                          <DatePickerReact
                            className={cn(
                              "flex-1 pl-3 text-left font-normal bg-white flex h-10 w-full items-center justify-between rounded-md rounded-l-none rounded-t-none border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
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
                            min="0"
                            placeholder="Select Capacity"
                            className="placeholder-black placeholder-opacity-100"
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
                  className="bg-white text-blue-500 hover:bg-grey-500"
                >
                  Search
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
                {/* <div className="md:flex"> */}
                <FormField
                  control={form.control}
                  name="facilityType"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "flex-1 pl-3 text-left font-normal bg-white",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <SelectValue placeholder="Any Facility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Any Facility</SelectItem>
                          {selection.facilityTypes.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buildingName"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "flex-1 pl-3 text-left font-normal bg-white",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <SelectValue placeholder="Any Building" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Any Building</SelectItem>
                          {selection.buildings.map((item) => (
                            <SelectItem
                              key={item.buildingID}
                              value={item.buildingName}
                            >
                              {item.buildingName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {/* </div> */}

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
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
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
                        <DatePickerReact
                          placeholderText="Start Time"
                          className={cn(
                            "flex-1 pl-3 text-left font-normal bg-white flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
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
                        <DatePickerReact
                          className={cn(
                            "flex-1 pl-3 text-left font-normal bg-white flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Select Capacity"
                          className="placeholder-black placeholder-opacity-100"
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
                  className="bg-white text-blue-500 hover:bg-grey-500"
                >
                  Search
                </Button>
              </div>
            </form>
          </Form>
        </div>
        {/* <div className="text-md">
          <ul className="space-y-2">
            <li>
              <div className="flex items-center space-x-2">
                <FaRegClock />
                <Label>
                  {" "}
                  FacilityType PlaceHolder - FacilityName Placeholder
                </Label>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-2">
                <FaRegClock />
                <Label> Facility Max Cap Placeholder</Label>
              </div>
            </li>
            <li>
              <div className="flex items-center space-x-2">
                <FaRegClock />
                <Label> Facility Status Placeholder</Label>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex justify-between pt-4">
          <div className="flex items-center space-x-2 text-blue-500">
            <FaRegClock />
            <Label> Location Placeholder</Label>
          </div>
          <Label>
            {" "}
            <div>$ (Price Placeholder)/Hour</div>
          </Label>
        </div> */}
      </div>
      {/* <div className="px-6 pt-4 pb-2 self-center">
        <Link href="/facility/search">
          <Button type="submit" className="bg-white text-blue-500">

            Search
          </Button>
        </Link>
      </div> */}
    </div>
  );
}

export default FacilitySearch;
