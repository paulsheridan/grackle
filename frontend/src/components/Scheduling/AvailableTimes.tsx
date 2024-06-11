import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { format, parseISO, isSameDay, addMinutes } from "date-fns";
import { Availabilities } from "../../client";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useFormContext } from "react-hook-form";

interface AvailableTimesProps {
  selectedDate: Date | null;
  availability: Availabilities;
}

const AvailableTimes: React.FC<AvailableTimesProps> = ({
  selectedDate,
  availability,
}) => {
  const { register } = useFormContext();
  let selectedDay = null;

  if (selectedDate) {
    selectedDay = availability.data.find((item) =>
      isSameDay(parseISO(item.date), selectedDate),
    );
  }

  return (
    <VStack w="full" h="full" p={6} spacing={6} align="center">
      <Heading size="xl">Pick a Time</Heading>
      <Box mt={4} w="full">
        {selectedDay && selectedDay.windows.length > 0 ? (
          <VStack spacing={2} overflowY="scroll" maxHeight="40vh" w="full">
            {selectedDay.windows.map((window, index) => (
              <Button
                key={index}
                rightIcon={<ArrowForwardIcon />}
                colorScheme="teal"
                variant="outline"
                minHeight={10}
                w="full"
              >
                {format(parseISO(window.start), "hh:mm aaaaa'm'")} -{" "}
                {format(
                  addMinutes(parseISO(window.end), 1), // Add one minute to window.end
                  "hh:mm aaaaa'm'",
                )}
              </Button>
            ))}
          </VStack>
        ) : (
          <Text>No available times</Text>
        )}
      </Box>
    </VStack>
  );
};

export default AvailableTimes;
