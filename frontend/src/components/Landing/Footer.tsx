import { Flex, Text, Box, Image } from "@chakra-ui/react";
import Logo from "../../assets/images/gracklesmall.png";

export default function Footer() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={0}
      p={12}
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
    >
      <Box>{/* <Image src={Logo} alt="logo" p={6} boxSize="140px" /> */}</Box>
      <Text>© 2024 Gracle. All Rights Reserved.</Text>
    </Flex>
  );
}
