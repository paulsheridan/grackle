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
import { ClientsService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";

export const Route = createFileRoute("/_layout/clients")({
  component: Clients,
});

function ClientsTableBody() {
  const { data: clients } = useSuspenseQuery({
    queryKey: ["clients"],
    queryFn: () => ClientsService.listClients({}),
  });

  return (
    <Tbody>
      {clients.data.map((client) => (
        <Tr key={client.id}>
          <Td>
            {client.first_name} {client.last_name}
          </Td>
          <Td color={!client.pronouns ? "ui.dim" : "inherit"}>
            {client.pronouns || "N/A"}
          </Td>
          <Td>{client.email}</Td>
          <Td>{client.phone_number}</Td>
          <Td>{client.birthday}</Td>
          <Td>{client.preferred_contact}</Td>
          <Td>
            <ActionsMenu type={"Client"} value={client} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}
function ClientsTable() {
  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            {/* <Th>ID</Th> */}
            <Th>Name</Th>
            <Th>Pronouns</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Birthday</Th>
            <Th>Preferred Contact</Th>
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
            <ClientsTableBody />
          </Suspense>
        </ErrorBoundary>
      </Table>
    </TableContainer>
  );
}

function Clients() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Clients
      </Heading>

      <Navbar type={"Client"} />
      <ClientsTable />
    </Container>
  );
}
