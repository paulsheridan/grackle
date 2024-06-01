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
import { ServicesService } from "../../../client";
import ActionsMenu from "../../../components/Common/ActionsMenu";
import Navbar from "../../../components/Common/Navbar";

export const Route = createFileRoute("/booking/$username/services")({
  component: Services,
});

function ServicesTableBody() {
  const { data: services } = useSuspenseQuery({
    queryKey: ["services"],
    queryFn: () => ServicesService.listServices({}),
  });

  return (
    <Tbody>
      {services.data.map((service) => (
        <Tr key={service.id}>
          <Td>{service.user_id}</Td> */}
          <Td>{service.name}</Td>
          <Td>{service.active ? "Active" : "Inactive"}</Td>
          <Td>{service.duration}</Td>
          <Td>{service.max_per_day}</Td>
          <Td>{service.start}</Td>
          <Td>{service.end}</Td>
          <Td>
            <ActionsMenu type={"Service"} value={service} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}
function ServicesTable() {
  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            {/* <Th>ID</Th>
            <Th>User ID</Th> */}
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Duration</Th>
            <Th>Max per Day</Th>
            <Th>Start</Th>
            <Th>End</Th>
            <Th>Actions</Th>
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
            <ServicesTableBody />
          </Suspense>
        </ErrorBoundary>
      </Table>
    </TableContainer>
  );
}

function Services() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Services
      </Heading>

      <Navbar type={"Service"} />
      <ServicesTable />
    </Container>
  );
}
