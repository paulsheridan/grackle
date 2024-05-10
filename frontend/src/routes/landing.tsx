import { Flex } from "@chakra-ui/react";
import Header from "../components/Landing/Header";
import Footer from "../components/Landing/Footer";
import Hero from "../components/Landing/Hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/landing")({
  component: Landing,
});

function Landing() {
  return (
    <Flex direction="column" align="center" maxW={{ xl: "1200px" }} m="0 auto">
      <Header />
      <Hero
        title="Adapted Chakra Landing Page Tutorial"
        subtitle="Used Create-React-App Chakra Template"
        image="https://source.unsplash.com/collection/404339/800x600"
        ctaText="Create your account now"
        ctaLink="/signup"
      />
      <Footer />
    </Flex>
  );
}
