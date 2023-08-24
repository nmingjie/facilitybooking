import { UTCToLocal, initTimeComponentDate, handlerSelectTimeByDate, handlerStartAndEndTime } from "@/lib/timeUtils";
import { format, addDays } from "date-fns";


function formatterDate(date: Date, formatterStr: string) {
  return format(UTCToLocal(date), formatterStr)
}
type MaintenanceConfigSchema={
  displayName:string,
  columnName:string,
  formatter?:((value?: Date) => string),
  isRichTextEditor?:boolean
}
export const maintenanceConfig:MaintenanceConfigSchema[]= [
  {
    displayName: "Reference ID",
    columnName: "code",
  },
  {
    displayName: "Maintenance Start Date",
    columnName: "maintenanceStartDate",
    formatter: (value?: Date) => {
      if (value) {
        return formatterDate(value, "PP")
      } else {
        return ""
      }
    },
  },
  {
    displayName: "Maintenance End Date",
    columnName: "maintenanceEndDate",
    formatter: (value?: Date) => {
      if (value) {
        return formatterDate(value, "PP")
      } else {
        return ""
      }
    },
  },
  {
    displayName: "Maintenance Start Time",
    columnName: "maintenanceStartTime",
    formatter: (value?: Date) => {
      if (value) {
        return formatterDate(value, "h:mm aa")
      } else {
        return ""
      }
    },
  },
  {
    displayName: "Maintenance End Time",
    columnName: "maintenanceEndTime",
    formatter: (value?: Date) => {
      if (value) {
        return formatterDate(value, "h:mm aa")
      } else {
        return ""
      }
    },
  },
  {
    displayName: "Status",
    columnName: "status",
  },
  {
    displayName: "Reflect Message Start Date",
    columnName: "startTime",
    formatter: (value?: Date) => {
      if (value) {
        return formatterDate(value, "PP")
      } else {
        return ""
      }
    },
  },
  {
    displayName: "Reflect Message End Date",
    columnName: "endTime",
    formatter: (value?: Date) => {
      if (value) {
        return formatterDate(value, "PP")
      } else {
        return ""
      }
    },
  },
  {
    displayName: "Maintenance Banner Message",
    columnName: "subject",
    isRichTextEditor:true
  },
  {
    displayName: "Maintenance Full Details Message",
    columnName: "content",
    isRichTextEditor:true
  },
];