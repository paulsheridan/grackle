import { Grid, Square } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPublic } from "../../../../client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_public/artist/$username/")({
  component: Booking,
});

function Booking() {
  const queryClient = useQueryClient();
  const artist = queryClient.getQueryData<UserPublic>(["artist"]);
  return (
    <Grid
      width="80%"
      minHeight={700}
      height="70vh"
      gridTemplateColumns={{
        base: "1fr 1fr",
        lg: "1fr 1fr 1fr 1fr",
      }}
      gridTemplateRows={{
        base: "auto",
        lg: "4fr 1fr 4fr",
      }}
      gridTemplateAreas={{
        base: `"shopname booknow" "gallery contact" "slogan slogan" "flash pretat" "posttat blog"`,
        lg: `"shopname booknow gallery contact" "flash slogan slogan slogan" "flash pretat posttat blog"`,
      }}
      gap={4}
    >
      <Square gridArea="shopname">shopname</Square>
      <Square
        gridArea="booknow"
        bg="green.500"
        borderRadius="3xl"
        border="2px solid purple"
      >
        booknow
      </Square>
      <Square
        gridArea="gallery"
        bg="red.500"
        borderRadius="3xl"
        border="2px solid purple"
      >
        gallery
      </Square>
      <Square
        gridArea="contact"
        bg="yellow.500"
        borderRadius="3xl"
        border="2px solid purple"
      >
        contact
      </Square>
      <Square gridArea="slogan" borderRadius="3xl">
        slogan
      </Square>
      <Square
        gridArea="flash"
        bg="blue.500"
        borderRadius="3xl"
        border="2px solid purple"
      >
        flash
      </Square>
      <Square
        gridArea="pretat"
        bg="gray.500"
        borderRadius="3xl"
        border="2px solid purple"
      >
        pretat
      </Square>
      <Square
        gridArea="posttat"
        bg="yellow.500"
        borderRadius="3xl"
        border="2px solid purple"
      >
        posttat
      </Square>
      <Square
        gridArea="blog"
        bg="orange.500"
        borderRadius="3xl"
        border="2px solid purple"
      >
        blog
      </Square>
    </Grid>
  );
}
