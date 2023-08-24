"use client";
import {format,parseISO } from "date-fns";

const defaultStartTimeStr = "00:00:00";
const defaultEndTimeStr = "23:59:59";


export function UTCToLocal (time:Date){
    let localDate = parseISO(time + "Z")
    return localDate;
}


/**
 * 
 * @param currentString - 
 * @param timeString - hh:mm aa
 * @returns {Date}
 */
export function getDateByString(currentString:string,timeString:string){
  const hourTime = Date.parse(currentString + " " + timeString);
  return new Date(hourTime);
}

/**
 * The Time component is initialized to the current time.[timeString - hh:mm aa]
 * @param timeString - hh:mm aa
 * @returns {Date}
 */
export function initTimeComponentDate (timeString:string){
  const currentString = format(new Date(), 'PP')
  return getDateByString(currentString,timeString);
}

/**
 * startTime -> xxxx 00:00:00,endTime -> xxxxxx 23:59:59
 * @param startTime 
 * @param endTime
 * @returns {startTime:Date,endTime:Date}
 */
export const handlerStartAndEndTime = (startTime: Date , endTime: Date) => {
  if (startTime) {
    const startHourTimeStrString = format(startTime, 'PP')
    startTime = getDateByString(startHourTimeStrString,defaultStartTimeStr);;
  }
  if (endTime) {
    const endHourTimeStrString = format(endTime, 'PP')
    endTime = getDateByString(endHourTimeStrString,defaultEndTimeStr);
  }
  return {
    startTime,
    endTime
  }
}

/**
 * The time is spliced according to date
 * @param date 
 * @param time 
 * @returns {Date}
 */
export function handlerSelectTimeByDate (date:Date,time:Date){
    let selectDate = date ? (new Date(date)) : new Date();
    const selectDateString = format(selectDate, 'PP');
    const hourTimeStr = format(new Date(time), "h:mm aa");
    return getDateByString(selectDateString,hourTimeStr);
}

