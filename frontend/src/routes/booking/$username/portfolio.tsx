import { Heading, Flex, Box, Image } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/$username/portfolio")({
  component: Portfolio,
});

const srces = [
  "https://picsum.photos/500/600",
  "https://picsum.photos/600/700",
  "https://picsum.photos/500/800",
  "https://picsum.photos/700/700",
  "https://picsum.photos/500/600",
  "https://picsum.photos/600/400",
  "https://picsum.photos/700/600",
  "https://picsum.photos/900/600",
  "https://picsum.photos/600/600",
  "https://picsum.photos/500/500",
  "https://picsum.photos/500/700",
  "https://picsum.photos/500/600",
  "https://picsum.photos/800/600",
  "https://picsum.photos/500/700",
  "https://picsum.photos/700/600",
  "https://picsum.photos/400/600",
  "https://picsum.photos/500/700",
];

function Images() {
  return (
    <Box
      padding={4}
      w="100%"
      mx="auto"
      // bg="gray.600"
      sx={{ columnCount: [1, 2, 3, 4, 5], columnGap: "8px" }}
    >
      {srces.map((src) => (
        <Image
          key={src}
          w="100%"
          borderRadius="xl"
          mb={2}
          d="inline-block"
          src={src}
          alt="Alt"
        />
      ))}
    </Box>
  );
}

function Portfolio() {
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
      <Heading
        size="lg"
        textAlign={{ base: "center", md: "left" }}
        pt={12}
        position="static"
      >
        My Work
      </Heading>
      <Images />
    </Flex>
  );
}
