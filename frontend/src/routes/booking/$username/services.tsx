import {
  Box,
  Container,
  Flex,
  Heading,
  Skeleton,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Text,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ServicesService, UserPublic } from "../../../client";
import Navbar from "../../../components/Common/Navbar";
import ServiceCard from "../../../components/Booking/ServiceCard";

export const Route = createFileRoute("/booking/$username/services")({
  component: Services,
});

function ServicesCards() {
  const queryClient = useQueryClient();
  const artist = queryClient.getQueryData<UserPublic>(["artist"]);

  const { data: artistServices } = useSuspenseQuery({
    queryKey: ["artistServices"],
    queryFn: () => ServicesService.listAvailableServices({ userId: artist.id }),
  });

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      {artistServices.data.map((service) => (
        <ServiceCard />
      ))}
    </SimpleGrid>
  );
}

function ServicesGrid() {
  return (
    <Container>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <Text>Something went wrong: {error.message}</Text>
        )}
      >
        <Suspense
          fallback={
            <Box>
              {new Array(2).fill(null).map(() => (
                <Box padding="6" boxShadow="lg" bg="white">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={4}
                    spacing="4"
                    skeletonHeight="2"
                  />
                </Box>
              ))}
            </Box>
          }
        >
          <ServicesCards />
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
}

function Services() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        My Services
      </Heading>
      <ServicesGrid />
    </Container>
  );
}
