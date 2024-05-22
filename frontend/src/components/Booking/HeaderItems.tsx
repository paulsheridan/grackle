import { HStack, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

const items = [
  { title: "About", path: "/booking/about" },
  { title: "Services", path: "/booking/services" },
  { title: "Portfolio", path: "/booking/portfolio" },
];

interface HeaderItemsProps {
  onClose?: () => void;
}

const HeaderItems = ({ onClose }: HeaderItemsProps) => {
  const finalClients = items;

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
