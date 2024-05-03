import { Box, Container, Text, Heading, Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import { AppointmentsService } from "../../client";
import Navbar from "../../components/Common/Navbar";
import { Suspense } from "react";

import UserCalendar from "../../components/Calendar/UserCalendar";

export const Route = createFileRoute("/_layout/calendar")({
  component: Schedule,
});

const appointments = (info) => {
  useSuspenseQuery({
    queryKey: ["appointments"],
    queryFn: () => AppointmentsService.listAppointmentsBetween(info),
  });
};

function Schedule() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        User Schedule
      </Heading>
      <Navbar type={"Appointments"} />
      <Suspense fallback={<CalendarSpinner />}>
        <UserCalendar />
      </Suspense>
    </Container>
  );
}

const CalendarSpinner = () => {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  );
};
