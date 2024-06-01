import { HStack, Flex, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

interface HeaderItemsProps {
  username: string;
  onClose?: () => void;
}

const HeaderItems = ({ username, onClose }: HeaderItemsProps) => {
  const finalClients = [
    { title: "About", path: `/booking/${username}/about` },
    { title: "Services", path: `/booking/${username}/services` },
    { title: "Portfolio", path: `/booking/${username}/portfolio` },
  ];

  const listClients = finalClients.map(({ title, path }) => (
    <Flex as={Link} to={path} p={2} key={title} onClick={onClose}>
      <Text ml={2}>{title}</Text>
    </Flex>
  ));

  return (
    <>
      <HStack spacing={8} align="center">
        {listClients}
      </HStack>
    </>
  );
};

export default HeaderItems;
