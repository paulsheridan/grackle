import { useCallback, useState } from "react";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type ApiError, AppointmentsService } from "../../client";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function UserCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
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
        startAccessor="start"
        endAccessor="end"
        onNavigate={onNavigate}
        style={{ height: "100vh" }}
      />
    </div>
  );
}
