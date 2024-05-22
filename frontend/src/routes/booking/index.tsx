import { Text, Flex, Button } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/")({
  component: Booking,
});

function Booking() {
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
        Welcome to Our Booking Service
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
