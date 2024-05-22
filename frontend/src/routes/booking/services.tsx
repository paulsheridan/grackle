import { Text, Flex } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/services")({
  component: Services,
});

function Services() {
  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      justify="center"
      flex="1"
      color="white"
      p={10}
    >
      <Text fontSize="4xl" fontWeight="bold" mb={4}>
        Services
      </Text>
    </Flex>
  );
}
