import { Grid, GridItem } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPublic } from "../../../client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_public/artist/$username/")({
  component: Booking,
});

function Booking() {
  const queryClient = useQueryClient();
  const artist = queryClient.getQueryData<UserPublic>(["artist"]);
  return (
    <Grid
      padding={4}
      w="90%"
      gridTemplateRows={"150px 1fr"}
      gridTemplateColumns={"150px 1fr"}
      color="blackAlpha.700"
      fontWeight="bold"
      bg="gray.100"
      p="4"
      borderRadius="md"
      gap="4"
    >
      <GridItem pl="2" bg="orange.300">
        Header
      </GridItem>
      <GridItem pl="2" bg="pink.300">
        Nav
      </GridItem>
      <GridItem pl="2" bg="green.300">
        Main
      </GridItem>
      <GridItem pl="2" bg="blue.300">
        Footer
      </GridItem>
    </Grid>
  );
}
