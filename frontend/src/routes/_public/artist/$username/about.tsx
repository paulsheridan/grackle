import { Text, Flex, Heading } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/artist/$username/about")({
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
    >
      <Heading
        fontSize={{
          base: "4xl",
          md: "5xl",
        }}
      >
        Meet the Artist
      </Heading>
      <Text fontSize="xl" mb={8}>
        I am a living tattoo.
      </Text>
    </Flex>
  );
}
