import { Flex, Button, Text, Link, IconButton, HStack } from "@chakra-ui/react";
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
      {/* <Text fontSize="2xl" fontWeight="bold">
        {artist?.shop_name}
      </Text> */}
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
        <Button colorScheme="blackAlpha" variant="outline">
          Book Now
        </Button>
      </HStack>
    </Flex>
  );
};

export default Header;
