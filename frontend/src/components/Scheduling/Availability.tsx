import { GridItem, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import DatePickerCalendar from "./DatePickerCalendar";

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
          <DatePickerCalendar />
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default Availability;
