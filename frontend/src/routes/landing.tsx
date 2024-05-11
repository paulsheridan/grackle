import { Flex } from "@chakra-ui/react";
import Header from "../components/Landing/Header";
import Footer from "../components/Landing/Footer";
import Hero from "../components/Landing/Hero";
import { createFileRoute } from "@tanstack/react-router";
import Logo from "../assets/images/GrackleBlue.png";

export const Route = createFileRoute("/landing")({
  component: Landing,
});

function Landing() {
  return (
    <Flex direction="column" align="center" maxW={{ xl: "1800px" }} m="0 auto">
      <Header />
      <Hero
        title="Welcome to Tattoo"
        subtitle="It's called Grackle and it's for scheduling!"
        image={Logo}
        ctaText="Sign Up Now!"
        ctaLink="/signup"
      />
      <Footer />
    </Flex>
  );
}
