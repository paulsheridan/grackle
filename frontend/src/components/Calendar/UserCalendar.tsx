import { Badge } from "@chakra-ui/react";
import { endOfMonth, startOfMonth } from "date-fns";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useCallback, useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FiBookmark, FiBox } from "react-icons/fi";
import {
  AppointmentsService,
  type AppointmentPublicWithClient,
} from "../../client";
import EditAppointment from "../Appointments/EditAppointment";

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
  const [appts, setAppts] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const editAppointmentModal = useDisclosure();

  const handleEventClick = useCallback((event) => {
    setSelectedAppointment(event);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchAppts(
      startOfMonth(date).toISOString(),
      endOfMonth(date).toISOString(),
    );
  }, [date]);

  const handleEditClick = useCallback(() => {
    setIsEditModalOpen(true);
    setIsModalOpen(false); // Close the details modal when opening edit modal
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  async function fetchAppts(start: string, end: string) {
    try {
      const response = await AppointmentsService.listAppointmentsBetween({
        start,
        end,
      });
      const appointments = response.data.map(
        (appointment: AppointmentPublicWithClient) => ({
          start: new Date(appointment.start),
          end: new Date(appointment.end),
          title: `${appointment.client.first_name} ${appointment.client.last_name}`,
          apptId: appointment.id,
        }),
      );
      setAppts(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  const handleNavigate = useCallback((newDate: Date, view: View) => {
    setDate(newDate);
  }, []);

  return (
    <div className="appointments">
      <DnDCalendar
        localizer={localizer}
        events={appts}
        defaultView="month"
        startAccessor={(event) => new Date(event.start)}
        endAccessor={(event) => new Date(event.end)}
        style={{ height: "100vh" }}
        onNavigate={handleNavigate}
        onSelectEvent={handleEventClick}
      />
      {selectedAppointment && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedAppointment.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>
                Start:{" "}
                {format(
                  new Date(selectedAppointment.start),
                  "MMMM d, yyyy h:mm a",
                )}
              </p>
              <p>
                End:{" "}
                {format(
                  new Date(selectedAppointment.end),
                  "MMMM d, yyyy h:mm a",
                )}
              </p>
              <p>Description: {selectedAppointment.description}</p>
              {/* Add more appointment details here as needed */}
              <Button onClick={handleEditClick}>Edit</Button>{" "}
              {/* Edit button */}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {selectedAppointment && isEditModalOpen && (
        <EditAppointment
          appointment={selectedAppointment}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
