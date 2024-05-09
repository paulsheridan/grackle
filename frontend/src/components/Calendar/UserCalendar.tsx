import { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useDisclosure } from "@chakra-ui/react";
import { AppointmentsService, type ApptJoinSvcClient } from "../../client";
import AppointmentDetail from "../Appointments/AppointmentDetail";
import { AppointmentEvent } from "../Appointments/models";

export default function UserCalendar() {
  const [apptsStart, setApptsStart] = useState(new Date());
  const [apptsEnd, setApptsEnd] = useState(new Date());
  const [appts, setAppts] = useState<AppointmentEvent[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentEvent>();
  const detailModal = useDisclosure();

  useEffect(() => {
    fetchAppts(apptsStart.toISOString(), apptsEnd.toISOString());
  }, [apptsStart, apptsEnd]);

  async function fetchAppts(start: string, end: string) {
    try {
      const response = await AppointmentsService.joinApptsSvcClientsBetween({
        start,
        end,
      });
      const appointments: AppointmentEvent[] = response.data.map(
        (rawAppt: ApptJoinSvcClient): AppointmentEvent => ({
          appointment: {
            id: rawAppt.id,
            confirmed: rawAppt.confirmed,
            canceled: rawAppt.canceled,
            user_id: rawAppt.user_id,
            service_id: rawAppt.service_id,
            client_id: rawAppt.client_id,
            start: rawAppt.start,
            end: rawAppt.end,
          },
          service: rawAppt.service,
          client: rawAppt.client,
          start: new Date(rawAppt.start),
          end: new Date(rawAppt.end),
          id: rawAppt.id,
          title: ` ${rawAppt.service?.name}: ${rawAppt.client?.first_name} ${rawAppt.client?.last_name}`,
        }),
      );

      setAppts(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  const handleNavigate = useCallback((arg: any) => {
    setApptsStart(arg.start);
    setApptsEnd(arg.end);
  }, []);

  const handleEventClick = useCallback(
    (arg: any) => {
      setSelectedAppointment(arg.event.extendedProps);
      detailModal.onOpen();
    },
    [detailModal],
  );

  return (
    <div className="appointments">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        locale="en-US"
        initialView="dayGridMonth"
        events={appts}
        eventClick={handleEventClick}
        height="80vh"
        datesSet={handleNavigate}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
      />
      {selectedAppointment && (
        <AppointmentDetail
          event={selectedAppointment}
          isOpen={detailModal.isOpen}
          onClose={detailModal.onClose}
        />
      )}
    </div>
  );
}
