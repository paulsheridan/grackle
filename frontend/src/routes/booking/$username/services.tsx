import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ServicesService, UserPublic } from "../../../client";
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
    <SimpleGrid spacing={4} columns={{ sm: 2, md: 3 }}>
      {artistServices.data.map((service) => (
        <ServiceCard service={service} />
      ))}
    </SimpleGrid>
  );
}

function ServicesGrid() {
  return (
    <Container maxW="full">
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
      <Heading
        size="lg"
        textAlign={{ base: "center", md: "left" }}
        pt={12}
        position="static"
      >
        My Services
      </Heading>
      <ServicesGrid />
    </Container>
  );
}
