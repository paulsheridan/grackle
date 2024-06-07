import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const Availability = () => {
  const [date, setDate] = useState(new Date());
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <VStack w="full" h="full" p={6} spacing={6} align="flex-start">
      <Heading size="xl">Pick a Date</Heading>
      <SimpleGrid columns={2} columnGap={3} rowGap={2} w="full">
        <GridItem colSpan={2}>
          <SingleDatepicker
            name="date-input"
            date={date}
            onDateChange={setDate}
          />
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default Availability;
