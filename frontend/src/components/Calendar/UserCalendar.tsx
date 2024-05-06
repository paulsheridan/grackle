import { useCallback, useState } from "react";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type ApiError, AppointmentsService } from "../../client";

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
  const onNavigate = useCallback((newDate: any) => setDate(newDate), [setDate]);
  const { data: appointments } = useSuspenseQuery({
    queryKey: ["appointments"],
    queryFn: () => AppointmentsService.listAppointments(),
  });

  return (
    <div className="appointments">
      <DnDCalendar
        localizer={localizer}
        events={appointments.data}
        startAccessor={(event) => {
          return new Date(event.start);
        }}
        endAccessor={(event) => {
          return new Date(event.end);
        }}
        onNavigate={onNavigate}
        style={{ height: "100vh" }}
      />
    </div>
  );
}
