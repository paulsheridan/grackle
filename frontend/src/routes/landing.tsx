import { Flex } from "@chakra-ui/react";
import Header from "../components/Landing/Header";
import Footer from "../components/Landing/Footer";
import Hero from "../components/Landing/Hero";
import { createFileRoute } from "@tanstack/react-router";
import Logo from "../assets/images/GrackleBlue.png";
import Pricing from "../components/Landing/Pricing";

export const Route = createFileRoute("/landing")({
  component: Landing,
});

function Landing() {
  return (
    <Flex direction="column" w="100%">
      <Header />
      <Hero
        title="Welcome to Tattoo"
        subtitle="It's called Grackle and it's for booking tattoos!"
        image={Logo}
        ctaText="Sign Up Now!"
        ctaLink="/signup"
      />
      <Pricing />
      <Footer />
    </Flex>
  );
}
