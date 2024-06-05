import {
  Link,
  IconButton,
  ButtonGroup,
  Box,
  Flex,
  HStack,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import HeaderItems from "./HeaderItems";
import { UserBooking } from "../../client";

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const artist = queryClient.getQueryData<UserBooking>(["artist"]);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"lg"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            // mr={12}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Text
              style={{ flex: 1, textAlign: "left" }}
              bgGradient="linear(to-l, purple.400, green.500)"
              bgClip="text"
              fontSize="4xl"
              fontWeight="extrabold"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {artist?.shop_name}
            </Text>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <HeaderItems />
            </HStack>
          </HStack>
          <ButtonGroup>
            <Link href="https://facebook.com" isExternal>
              <IconButton
                icon={<FaFacebook />}
                aria-label="Facebook"
                variant="ghost"
                color="chakra-body-text"
                size="lg"
              />
            </Link>
            <Link href="https://instagram.com" isExternal>
              <IconButton
                icon={<FaInstagram />}
                aria-label="Instagram"
                variant="ghost"
                color="chakra-body-text"
                size="lg"
              />
            </Link>
          </ButtonGroup>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <HeaderItems />
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
