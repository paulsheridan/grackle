import {
  Flex,
  Button,
  Text,
  Link,
  IconButton,
  HStack,
  ButtonGroup,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

import HeaderItems from "./HeaderItems";
import { UserBooking } from "../../client";

interface HeaderProps {
  onClose?: () => void;
}

const Header = ({ onClose }: HeaderProps) => {
  const queryClient = useQueryClient();
  const artist = queryClient.getQueryData<UserBooking>(["artist"]);
  return (
    <Flex
      as="header"
      justify="space-between"
      align="center"
      p={5}
      color="black"
    >
      <Flex
        as={Link}
        href={`/booking/${artist?.username}`}
        fontSize="2xl"
        fontWeight="bold"
        key={artist?.shop_name}
        onClick={onClose}
      >
        <Text ml={2}>{artist?.shop_name}</Text>
      </Flex>
      <HStack spacing={8} align="center">
        <HeaderItems />
        <ButtonGroup>
          <Link href="https://facebook.com" isExternal>
            <IconButton
              icon={<FaFacebook />}
              aria-label="Facebook"
              variant="ghost"
              color="black"
              mr={2}
            />
          </Link>
          <Link href="https://instagram.com" isExternal>
            <IconButton
              icon={<FaInstagram />}
              aria-label="Instagram"
              variant="ghost"
              color="black"
              mr={2}
            />
          </Link>
          <Link to={`/booking/${artist?.username}/about`}>
            <Button
              colorScheme="blackAlpha"
              variant="outline"
              onClick={onClose}
            >
              Book Now
            </Button>
          </Link>
        </ButtonGroup>
      </HStack>
    </Flex>
  );
};

export default Header;
