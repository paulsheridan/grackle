import { Box, Container, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import type { UserPublic } from "../../client";

export const Route = createFileRoute("/_layout/appointments")({
  component: Dashboard,
});

function Dashboard() {
  const queryClient = useQueryClient();

  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl">
            {currentUser?.full_name || currentUser?.email}'s Schedule
          </Text>
          <Text>Welcome to Grackle!</Text>
        </Box>
      </Container>
    </>
  );
}
