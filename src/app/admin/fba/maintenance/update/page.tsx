"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Metadata } from "next";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiTwotoneCalendar } from "react-icons/ai";
import { GiBackwardTime } from "react-icons/gi";
import DatePickerReact from "react-datepicker";
import { format, addDays } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Loader from "@/components/Loader";
import MessageDialog from "../components/MessageDialog";
import { cn, getGuid } from "@/lib/utils";
import { UTCToLocal, initTimeComponentDate, handlerSelectTimeByDate, handlerStartAndEndTime } from "@/lib/timeUtils";
import { getAnnoucementByCodeApi, updateAnnoucementApi } from "@/api/modules/annoucement";
import { RichTextEditor } from "@/components/RichTextEditor"
const metadata: Metadata = {
  title: "Maintenance | JTC",
  description: "Maintenance | JTC",
};
interface FormParamsSchema {
  maintenanceStartDate?: Date,
  maintenanceStartTime?: Date,
  maintenanceEndDate?: Date,
  maintenanceEndTime?: Date,
  startTime?: Date,
  endTime?: Date,
  code?: string,
  status?: string | undefined,
  type?: string,
  subject?: string,
  content?: string,
  isDisabled?: boolean
};
const MaintenanceFormSchema = z.object({
  maintenanceStartDate: z.date(),
  maintenanceStartTime: z.date(),
  maintenanceEndDate: z.date(),
  maintenanceEndTime: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  subject: z.string(),
  content: z.string()
});
type MaintenanceFormSchemaValues = z.infer<typeof MaintenanceFormSchema>;

export default function Page() {
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Get url params
  const params = useSearchParams();
  let searchParams: any = params ? qs.parse(params.toString()) : {};
  const form = useForm<MaintenanceFormSchemaValues>({
    resolver: zodResolver(MaintenanceFormSchema),
    defaultValues: async () => await getMaintenanceInfo(),
    mode: "onChange",
  });
  // Used to control the date and time range
  const [maintenanceStartDate, setMaintenanceStartDate] = useState<Date>();
  const [maintenanceEndDate, setMaintenanceEndDate] = useState<Date>();
  const [maintenanceStartTime, setMaintenanceStartTime] = useState<Date>();
  const [maintenanceEndTime, setMaintenanceEndTime] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  // The default end time is 23:59
  let defaultEndHourStr: string = "23:59:59";

  const [maintenance, setMaintenance] = useState<FormParamsSchema>({});

  // Initializes the data for the control date and time range
  const initControlData = (data: FormParamsSchema) => {
    console.log('searchParams', data)
    data.maintenanceStartDate && setMaintenanceStartDate(UTCToLocal(data.maintenanceStartDate));
    data.maintenanceEndDate && setMaintenanceEndDate(UTCToLocal(data.maintenanceEndDate));
    data.maintenanceStartTime && setMaintenanceStartTime(initTime(data.maintenanceStartTime));
    data.maintenanceEndTime && setMaintenanceEndTime(initTime(data.maintenanceEndTime));
    data.startTime && setStartTime(UTCToLocal(data.startTime));
    data.endTime && setEndTime(UTCToLocal(data.endTime));
  };
  const initTime = (time?: Date) => {
    let dateTime = time ? UTCToLocal(time) : new Date()
    const timeString = format(dateTime, "h:mm aa");
    return initTimeComponentDate(timeString);
  };
  const getMaintenanceInfo = async () => {
    setLoading(true);
    if (searchParams && searchParams.maintenanceId) {
      try {
        const { data } = await getAnnoucementByCodeApi(searchParams.maintenanceId)
        console.log('data', data)
        if (data.isSuccess) {
          if (data.data) {
            initControlData(data.data)
            setLoading(false);
            return handlerMaintenanceInfo(data.data)
          }
        }
      } catch (error) {
        console.log("error", error)
      }
    }
    setLoading(false);
    return maintenance
  };
  const handlerMaintenanceInfo = (data: FormParamsSchema) => {
    let maintenanceSearch = {
      ...data,
      maintenanceStartDate: data.maintenanceStartDate && UTCToLocal(data.maintenanceStartDate),
      maintenanceEndDate: data.maintenanceEndDate && UTCToLocal(data.maintenanceEndDate),
      maintenanceStartTime: data.maintenanceStartTime && initTime(data.maintenanceStartTime),
      maintenanceEndTime: data.maintenanceEndTime && initTime(data.maintenanceEndTime),
      startTime: data.startTime && UTCToLocal(data.startTime),
      endTime: data.endTime && UTCToLocal(data.endTime)
    };
    setMaintenance(maintenanceSearch);
    return maintenanceSearch
  };
  const updateMaintenance = async () => {
    setLoading(true);
    try {
      const { data } = await updateAnnoucementApi(maintenance);
      console.log("data", data)
      if (data.isSuccess) {
        console.log("update success")
        router.back()
      } else {
        console.log("error", data.error?.message)
      }
    } catch (error) {
      console.log("error", error)
    }
    setLoading(false);
  };

  // time Indicates the matching date
  let timeMatchingInfo: any = {
    maintenanceStartTime: "maintenanceStartDate",
    maintenanceEndTime: "maintenanceEndDate",
  };

  const onSubmit: SubmitHandler<FieldValues> = async (formParams: any) => {
    let params: any = {}
    for (const key in formParams) {
      params[key] = formParams[key]
      if (params[key] instanceof Date) {
        let dateKey = timeMatchingInfo[key] || undefined;
        if (dateKey) {
          params[key] = handlerSelectTimeByDate(params[dateKey], params[key])
        }
        params[key] = params[key];
      }
    }
    const timeObj = handlerStartAndEndTime(params.startTime, params.endTime)
    params.startTime = timeObj.startTime && timeObj.startTime instanceof Date ? timeObj.startTime : formParams.startTime;
    params.endTime = timeObj.endTime && timeObj.endTime instanceof Date ? timeObj.endTime : formParams.endTime;
    console.log('params', params, timeObj)
    console.log('maintenance', maintenance)
    onOpenChange(true, params);
  };
  const handlerConfirm = () => {
    setIsOpen(false)
    updateMaintenance()
  };
  const onOpenChange = (bool: boolean, params?: object | undefined) => {
    setIsOpen(bool);
    if (params) {
      setMaintenance({ ...maintenance, ...params });
      console.log("maintenance", maintenance, params)
    }
  };

  return (
    <div className="container px-0 font-display">
      <div className="py-4 ml-4 text-4xl font-medium md:text-7xl lg:ml-32">
        Update System Maintenance
      </div>
      <div className="mt-6 mx-4 pb-10">
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <div>
              <div className="FormLabel text-xl text-neutral-500 mb-7">Reference ID: {searchParams ? (searchParams.maintenanceId ? searchParams.maintenanceId : "") : ""}</div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="maintenanceStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Maintenance Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full py-3 px-6 text-xl h-auto text-left font-normal rounded-md",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Start Date</span>
                              )}
                              <AiTwotoneCalendar className="ml-auto h-5 w-5  text-gray-400" />
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
                            onSelect={(date) => {
                              field.onChange(date);
                              setMaintenanceStartDate(date);
                            }}
                            disabled={
                              (date) => date < addDays(new Date(), -1) || (maintenanceEndDate ? (date > addDays(maintenanceEndDate, 0)) : false)
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
                  name="maintenanceEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Maintenance End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full py-3 px-6 text-xl h-auto text-left font-normal rounded-md",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>End Date</span>
                              )}
                              <AiTwotoneCalendar className="ml-auto h-5 w-5  text-gray-400" />
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
                            onSelect={(date) => {
                              field.onChange(date);
                              setMaintenanceEndDate(date);
                            }}
                            disabled={
                              (date) => date < addDays(new Date(), -1) || (maintenanceStartDate ? (date < addDays(maintenanceStartDate, 0)) : false)
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
                  name="maintenanceStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Maintenance Start Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DatePickerReact
                            placeholderText="Start Date Time"
                            className={cn(
                              "flex-1 py-3 px-6 text-xl h-auto text-left font-normal bg-white flex w-full items-center justify-between rounded-md border border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                              !field && "text-muted-foreground"
                            )}
                            wrapperClassName="w-full"
                            selected={field.value}
                            onChange={(date: Date) => {
                              field.onChange(date);
                              setMaintenanceStartTime(date);
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            filterTime={(time: Date) => {
                              const selectedDate = new Date(time);
                              return maintenanceEndTime ? maintenanceEndTime.getTime() > selectedDate.getTime() : true;
                            }}
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                          <GiBackwardTime className="w-5 h-5 absolute top-4 right-6 text-gray-400" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maintenanceEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Maintenance End Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DatePickerReact
                            className={cn(
                              "flex-1 py-3 px-6 text-xl h-auto text-left font-normal bg-white flex w-full items-center justify-between rounded-md border border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                              !field && "text-muted-foreground"
                            )}
                            wrapperClassName="w-full"
                            placeholderText="End Date Time"
                            selected={field.value}
                            onChange={(date: Date) => {
                              field.onChange(date);
                              setMaintenanceEndTime(date);
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            filterTime={(time: Date) => {
                              const selectedDate = new Date(time);
                              return maintenanceStartTime ? maintenanceStartTime.getTime() < selectedDate.getTime() : true;
                            }}
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                          <GiBackwardTime className="w-5 h-5 absolute top-4 right-6 text-gray-400" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Reflect Message Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full py-3 px-6 text-xl h-auto text-left font-normal rounded-md",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Start Date</span>
                              )}
                              <AiTwotoneCalendar className="ml-auto h-5 w-5  text-gray-400" />
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
                            onSelect={(date) => {
                              field.onChange(date);
                              setStartTime(date);
                            }}
                            disabled={
                              (date) => date < addDays(new Date(), -1) ||
                                (maintenanceStartDate ? (date > addDays(maintenanceStartDate, -1)) : true) ||
                                (endTime ? (date > addDays(endTime, 0)) : false)
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
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Reflect Message End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full py-3 px-6 text-xl h-auto text-left font-normal rounded-md",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>End Date</span>
                              )}
                              <AiTwotoneCalendar className="ml-auto h-5 w-5  text-gray-400" />
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
                            onSelect={(date) => {
                              field.onChange(date);
                              setEndTime(date);
                            }}
                            disabled={
                              (date) => date < addDays(new Date(), -1) ||
                                (maintenanceEndDate ? (date >= addDays(maintenanceEndDate, 0)) : true) ||
                                (startTime ? (date < addDays(startTime, 0)) : false)
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Maintenance Banner Message*</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={(content: any, delta: any, source: any, editor: any) => {
                            let text = editor.getText() ? editor.getText().trim() : "";
                            if (text) {
                              field.onChange(content);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="FormLabel text-xl text-neutral-500">Maintenance Full Details Message*</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={(content: any, delta: any, source: any, editor: any) => {
                            let text = editor.getText() ? editor.getText().trim() : "";
                            if (text) {
                              field.onChange(content);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="p-4 text-xl mr-4 cursor-pointer"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="p-4 text-xl cursor-pointer"
                  >
                    Submit
                  </Button>

                </div>
              </form>
            </Form>
          </>
        )}
      </div>
      <MessageDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        handlerConfirm={handlerConfirm}
        title="Confirm Update"
        message="Are you sure to update this maintenance record?"
      ></MessageDialog>
    </div>
  );
}
