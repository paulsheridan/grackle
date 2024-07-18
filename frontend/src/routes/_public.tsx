import { Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";

import { UsersService } from "../client";
import Header from "../components/Booking/Header";
import Footer from "../components/Booking/Footer";

export const Route = createFileRoute("/_public")({
  component: Booking,
});

function Booking() {
  const { username } = Route.useParams() as { username: string };
  const { data: user } = useQuery({
    queryKey: ["artist"],
    queryFn: () => UsersService.readByUsername({ username }),
  });

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      justify="center"
      flex="1"
      color="white"
    >
      {user ? (
        <Flex direction="column" minHeight="100vh" w="100%">
          <Header />
          <Flex
            as="section"
            direction="column"
            align="center"
            justify="center"
            flex="1"
            bgGradient="linear(to-r, purple.400, green.400)"
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
    </Flex>
  );
}

export default Booking;
