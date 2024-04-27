import {
  Container,
  Flex,
  Heading,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AppointmentsService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";

export const Route = createFileRoute("/_layout/appointments")({
  component: Appointments,
});

function AppointmentsTableBody() {
  const { data: appointments } = useSuspenseQuery({
    queryKey: ["appointments"],
    queryFn: () => AppointmentsService.listAppointments({}),
  });

  return (
    <Tbody>
      {appointments.data.map((appointment) => (
        <Tr key={appointment.id}>
          {/* <Td>{appointment.id}</Td>
          <Td>{appointment.user_id}</Td> */}
          <Td>{appointment.start}</Td>
          <Td>{appointment.end}</Td>
          <Td>{appointment.confirmed ? "Confirmed" : "Not Confirmed"}</Td>
          <Td>{appointment.canceled ? "Canceled" : "Not Canceled"}</Td>
          <Td>{appointment.client_id}</Td>
          <Td>{appointment.service_id}</Td>
          <Td>
            <ActionsMenu type={"Appointment"} value={appointment} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}
function AppointmentsTable() {
  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            {/* <Th>ID</Th>
            <Th>User ID</Th> */}
            <Th>Start</Th>
            <Th>End</Th>
            <Th>Confirmed</Th>
            <Th>Canceled</Th>
            <Th>Client ID</Th>
            <Th>Service ID</Th>
          </Tr>
        </Thead>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Tbody>
              <Tr>
                <Td colSpan={4}>Something went wrong: {error.message}</Td>
              </Tr>
            </Tbody>
          )}
        >
          <Suspense
            fallback={
              <Tbody>
                {new Array(5).fill(null).map((_, index) => (
                  <Tr key={index}>
                    {new Array(4).fill(null).map((_, index) => (
                      <Td key={index}>
                        <Flex>
                          <Skeleton height="20px" width="20px" />
                        </Flex>
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            }
          >
            <AppointmentsTableBody />
          </Suspense>
        </ErrorBoundary>
      </Table>
    </TableContainer>
  );
}

function Appointments() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Appointments Management
      </Heading>

      <Navbar type={"Appointment"} />
      <AppointmentsTable />
    </Container>
  );
}
