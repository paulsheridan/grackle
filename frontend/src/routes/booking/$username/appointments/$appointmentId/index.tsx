import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { AppointmentsService } from "../../../../../client";

export const Route = createFileRoute(
  "/booking/$username/appointments/$appointmentId/",
)({
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { appointmentId } = Route.useParams();
  const { data: appointment } = useQuery({
    queryKey: ["appointment"],
    queryFn: () =>
      AppointmentsService.getAppointment({ apptId: appointmentId }),
  });

  const address = "123 Music Lane, Suite 100, Nashville, TN";

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Thanks for booking
        </Heading>
        <Text fontSize="lg" textAlign="center">
          You'll be notified when the artist confirms your appointment
        </Text>
        <Box textAlign="center">
          <Text fontSize="xl">{appointment.start}</Text>
          <Text fontSize="xl">{appointment.start}</Text>
        </Box>
        <HStack spacing={4} justify="center">
          <Button colorScheme="blue">Add to Calendar</Button>
          <Button colorScheme="yellow">Reschedule</Button>
          <Button colorScheme="red">Cancel</Button>
          <Button colorScheme="green">Rebook</Button>
        </HStack>
        <Divider />
        <Heading as="h2" size="lg" textAlign="left">
          Location
        </Heading>
        <Box h="300px" w="100%">
          <MapContainer
            center={[36.1627, -86.7816]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[36.1627, -86.7816]}>
              <Popup>{address}</Popup>
            </Marker>
          </MapContainer>
        </Box>
        <Text fontSize="md" textAlign="center">
          {address}
        </Text>
        <Divider />
        <Heading as="h2" size="lg" textAlign="left">
          Payment
        </Heading>
        <Text fontSize="md" textAlign="center">
          Payment due at appointment
        </Text>
      </VStack>
    </Box>
  );
}

export default BookingConfirmation;
