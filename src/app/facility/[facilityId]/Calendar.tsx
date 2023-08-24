import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import request from "@/api/request";

import { useEffect, useState } from "react";

import "./css/FullCalendarStyle.css";

type CalendarParam = {
  facilityId: string;
  bookingDate: Date;
  setReservation: Function;
};

type UrlInfoParam = {
  facilityId: string;
  bookingDate: string;
};

type BookingParam = {
  bookingTimeFrom: string;
  bookingTimeTo: string;
  itemStatus: string;
};

type DateClickParam = {
  allDay: boolean;
  date: Date;
  dateStr: string;
  jsEvent: MouseEvent;
};

type DatesSetParam = {
  end: Date;
  endStr: string;
  start: Date;
  startStr: string;
  timeZone: string;
};

export function Calendar({
  facilityId,
  bookingDate,
  setReservation,
}: CalendarParam) {
  const [params, setParams] = useState<UrlInfoParam>({
    facilityId,
    bookingDate: new Date(bookingDate).toISOString(),
  });
  const [availability, setAvailability] = useState<object>([]);
  const [eventSelected, setEventSelected] = useState<object>([
    {
      title: "Current Selection",
      status: "Current Selection",
      start: new Date(Math.ceil(Date.now() / 3600000) * 3600000),
      end: new Date(Math.ceil(Date.now() / 3600000) * 3600000 + 1800000),
      color: "#006CEB",
    },
  ]);

  useEffect(() => {
    const getAvailInfo = async () => {
      const offset = new Date(params.bookingDate).getTimezoneOffset();
      let date = new Date(
        new Date(params.bookingDate).getTime() - offset * 60 * 1000
      );

      const avail = await request.get(
        `/api/facilities/${facilityId}/getAvailability?bookingDate=${
          date.toISOString().split("T")[0]
        }`
      );

      const availData = avail.data?.data;

      if (availData) {
        let eventFromData: BookingParam[] | [] =
          avail.data.isSuccess && availData.bookings ? availData.bookings : [];

        if (
          Array.isArray(availData.bookings) &&
          availData.bookings.length !== 0
        ) {
          let eventFromDataParsed = eventFromData.map((item) => {
            return {
              start: item.bookingTimeFrom,
              end: item.bookingTimeTo,
              title: item.itemStatus,
              status: item.itemStatus,
              color:
                item.itemStatus === "BOOKED"
                  ? "#5549C1"
                  : item.itemStatus === "BLOCK-OUT"
                  ? "#CCCCCC"
                  : "#000000",
              editable: false,
            };
          });

          setAvailability(eventFromDataParsed);
        }
      }
    };

    try {
      getAvailInfo();
    } catch (e: any) {
      throw new Error(e);
    }
  }, [facilityId, bookingDate, params]);

  function eventChange(changeInfo: any) {
    setReservation({
      bookingDate: changeInfo.event.start,
      startTime: changeInfo.event.start,
      endTime: changeInfo.event.end,
    });
  }

  function datesSet(dateInfo: DatesSetParam) {
    setParams({
      ...params,
      bookingDate: new Date(dateInfo.start).toISOString(),
    });
  }

  function dateClick(info: DateClickParam) {
    setEventSelected([
      {
        title: "Current Selection",
        status: "Current Selection",
        start: info.date,
        end: new Date(info.date.getTime() + 30 * 60 * 1000),
        color: "#006CEB",
      },
    ]);

    setReservation({
      bookingDate: info.date,
      startTime: info.date,
      endTime: new Date(info.date.getTime() + 30 * 60 * 1000),
    });
  }

  function select(selectionInfo: any) {
    setEventSelected([
      {
        title: "Current Selection",
        status: "Current Selection",
        start: selectionInfo.start,
        end: selectionInfo.end,
        color: "#006CEB",
      },
    ]);

    setReservation({
      bookingDate: selectionInfo.start,
      startTime: selectionInfo.start,
      endTime: selectionInfo.end,
    });
  }

  return (
    <div>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        weekends={true}
        allDaySlot={false}
        eventSources={[availability, eventSelected]}
        editable={true}
        eventStartEditable={true}
        selectable={true}
        eventDurationEditable={true}
        eventContent={renderEventContent}
        timeZone="local"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        // avail
        slotMinTime={"07:00:00"}
        slotMaxTime={"22:00:00"}
        slotDuration="00:30:00"
        longPressDelay={0}
        eventOverlap={false}
        eventChange={eventChange}
        dragScroll={true}
        datesSet={datesSet}
        dateClick={dateClick}
        select={select}
      />
    </div>
  );
}

// a custom render function
function renderEventContent(eventInfo: any) {
  return (
    <div className="w-full h-full flex flex-row justify-items-center align-items-center">
      {eventInfo.event.title === "Current Selection" ? (
        <>
          <b className="mx-auto my-auto">
            {eventInfo.event.title} : {eventInfo.timeText}
          </b>
        </>
      ) : (
        <b className="mx-auto my-auto">{eventInfo.event.title}</b>
      )}
    </div>
  );
}
