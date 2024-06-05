import { HStack, Flex, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { UserBooking } from "../../client";

interface HeaderItemsProps {
  onClose?: () => void;
}

const HeaderItems = ({ onClose }: HeaderItemsProps) => {
  const queryClient = useQueryClient();
  const artist = queryClient.getQueryData<UserBooking>(["artist"]);

  const finalClients = [
    { title: "About", path: `/booking/${artist?.username}/about` },
    { title: "Services", path: `/booking/${artist?.username}/services` },
    { title: "Portfolio", path: `/booking/${artist?.username}/portfolio` },
    { title: "Contact", path: `/booking/${artist?.username}/contact` },
    { title: "Book Now", path: `/booking/${artist?.username}/services` },
  ];

  const listClients = finalClients.map(({ title, path }) => (
    <Flex as={Link} to={path} p={2} key={title} onClick={onClose}>
      <Text ml={2} fontSize="xl" color="chakra-body-text">
        {title}
      </Text>
    </Flex>
  ));

  return <>{listClients}</>;
};

export default HeaderItems;
