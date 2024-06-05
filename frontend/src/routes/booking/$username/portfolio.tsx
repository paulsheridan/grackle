import { Heading, Flex, Box, Image } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/booking/$username/portfolio")({
  component: Portfolio,
});

const srces = [
  "https://picsum.photos/500/600",
  "https://picsum.photos/600/700",
  "https://picsum.photos/500/800",
  "https://picsum.photos/1200/700",
  "https://picsum.photos/500/400",
  "https://picsum.photos/600/400",
  "https://picsum.photos/700/600",
  "https://picsum.photos/900/600",
  "https://picsum.photos/1100/600",
  "https://picsum.photos/500/500",
  "https://picsum.photos/400/400",
  "https://picsum.photos/500/400",
  "https://picsum.photos/800/400",
  "https://picsum.photos/500/700",
  "https://picsum.photos/700/400",
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
      sx={{ columnCount: [1, 2, 3, 4], columnGap: "8px" }}
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
    >
      <Heading
        m="7"
        fontSize={{
          base: "4xl",
          md: "5xl",
        }}
      >
        My Work
      </Heading>
      <Images />
    </Flex>
  );
}
