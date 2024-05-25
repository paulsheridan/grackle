import { Text, Flex } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/$username/about")({
  component: About,
});

function About() {
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
        About Me
      </Text>
      <Text fontSize="xl" mb={8}>
        I am a living tattoo.
      </Text>
    </Flex>
  );
}
