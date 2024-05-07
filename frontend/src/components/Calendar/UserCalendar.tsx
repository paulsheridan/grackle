import { Badge } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useCallback, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { FiBookmark, FiBox } from "react-icons/fi";
import {
  AppointmentsService,
  type AppointmentPublicWithClient,
} from "../../client";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

export default function UserCalendar() {
  const [date, setDate] = useState(new Date());
  const { data: appointments } = useSuspenseQuery({
    queryKey: ["appointments"],
    queryFn: () => AppointmentsService.listAppointments(),
  });
  const mappedAppts = appointments.data.map(
    (appointment: AppointmentPublicWithClient) => ({
      start: appointment.start,
      end: appointment.end,
      title: appointment.client.first_name + " " + appointment.client.last_name,
    }),
  );

  return (
    <div className="appointments">
      <DnDCalendar
        localizer={localizer}
        events={mappedAppts}
        defaultView="week"
        startAccessor={(event) => {
          return new Date(event.start);
        }}
        endAccessor={(event) => {
          return new Date(event.end);
        }}
        onNavigate={useCallback((newDate: any) => setDate(newDate), [setDate])}
        style={{ height: "100vh" }}
      />
    </div>
  );
}
