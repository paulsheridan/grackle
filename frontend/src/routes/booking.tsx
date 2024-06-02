import { Container, Flex, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { createContext, useContext } from "react";

import Header from "../components/Booking/Header";
import Footer from "../components/Landing/Footer";
import { UserBooking, UsersService } from "../client";

export const Route = createFileRoute("/booking")({
  component: Booking,
});

function Booking() {
  const { username } = Route.useParams() as { username: string };
  console.log(username);
  const { data: user } = useQuery({
    queryKey: ["artist"],
    queryFn: () => UsersService.readByUsername({ username }),
  });
  console.log(user);

  return (
    <Container maxW="full">
      {user ? (
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
            <Footer />
          </Flex>
        </Flex>
      ) : (
        <Flex justify="center" align="center" height="100vh" width="full">
          <Spinner size="xl" color="ui.main" />
        </Flex>
      )}
    </Container>
  );
}

export default Booking;
