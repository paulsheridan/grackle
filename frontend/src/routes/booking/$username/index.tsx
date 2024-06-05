import { Text, Flex, Button } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPublic } from "../../../client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/booking/$username/")({
  component: Booking,
});

function Booking() {
  const queryClient = useQueryClient();
  const artist = queryClient.getQueryData<UserPublic>(["artist"]);
  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      justify="center"
      flex="1"
    >
      <Text fontSize="4xl" fontWeight="bold" mb={4}>
        Book with {artist?.shop_name}
      </Text>
      <Text fontSize="xl" mb={8}>
        Schedule your appointment easily and conveniently.
      </Text>
      <Button colorScheme="whiteAlpha" variant="solid" size="lg">
        Get Started
      </Button>
    </Flex>
  );
}
