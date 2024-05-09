import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
} from "@chakra-ui/react";
import { FiCheck, FiX } from "react-icons/fi";
import { type AppointmentEvent } from "./models";
import ActionsMenu from "../../components/Common/ActionsMenu";

interface AppointmentDetailProps {
  event: AppointmentEvent;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentDetail = ({
  event,
  isOpen,
  onClose,
}: AppointmentDetailProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form">
          <ModalHeader>Appointment Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Appointment</Tab>
                <Tab>Client</Tab>
                <Tab>Service</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Card>
                    <CardHeader>
                      <Heading size="md">Appointment Details</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing="4">
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Confirmed
                          </Heading>
                          {event.appointment.confirmed === true ? (
                            <FiCheck size={50} />
                          ) : (
                            <FiX size={50} />
                          )}
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            When
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            Scheduled on {event.appointment.start}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Notes
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            These are example notes. There is no actual notes
                            object yet.
                          </Text>
                        </Box>
                      </Stack>
                    </CardBody>
                  </Card>
                </TabPanel>
                <TabPanel>
                  <Card>
                    <CardHeader>
                      <Heading size="md">Client Details</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing="4">
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Summary
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            Name:{" "}
                            {event.client?.first_name +
                              " " +
                              event.client?.last_name}
                            <br />
                            Birthday: {event.client?.birthday}
                            <br />
                            Pronouns: {event.client?.pronouns}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Contact
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            Phone Number: {event.client?.phone_number}
                            <br />
                            Email: {event.client?.email}
                            <br />
                            Preferred Contact: {event.client?.preferred_contact}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Notes
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            Here are some notes about the client. They don't
                            exist on the backend yet, so this is just a
                            placeholder.
                          </Text>
                        </Box>
                      </Stack>
                    </CardBody>
                  </Card>
                </TabPanel>
                <TabPanel>
                  <Card>
                    <CardHeader>
                      <Heading size="md">Service Details</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing="4">
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Name
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            {event.service?.name}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Duration
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            {event.service?.duration + " minutes."}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Notes
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            These are notes about the service I'm providing.
                            It's a really good service and everyone likes it and
                            I make money so often.
                          </Text>
                        </Box>
                      </Stack>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter gap={3}>
            <ActionsMenu type={"Appointment"} value={event.appointment} />
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppointmentDetail;
