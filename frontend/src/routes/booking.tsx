import { Container, Flex, Box } from "@chakra-ui/react";
// import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";

import Header from "../components/Booking/Header";

export const Route = createFileRoute("/booking")({
  component: Booking,
});

function Booking() {
  return (
    <Container maxW="full">
      <Flex direction="column" minHeight="100vh" w="100%">
        <Header />
        <Flex
          as="section"
          direction="column"
          align="center"
          justify="center"
          flex="1"
          bgGradient="linear(to-r, purple.400, pink.400)"
          color="white"
        >
          <Outlet />
        </Flex>
        <Box
          as="footer"
          textAlign="center"
          p={5}
          bg="rgba(0, 0, 0, 0.2)"
          color="black"
        >
          Made with Grackle
        </Box>
      </Flex>
    </Container>
  );
}

export default Booking;
