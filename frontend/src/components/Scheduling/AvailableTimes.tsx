import React, { useState } from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { format, parseISO, isSameDay, addMinutes } from "date-fns";
import { Availabilities } from "../../client";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface AvailableTimesProps {
  selectedDate: Date | null;
  availability: Availabilities;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const AvailableTimes: React.FC<AvailableTimesProps> = ({
  selectedDate,
  availability,
  selectedTime,
  setSelectedTime,
}) => {
  let selectedDay = null;

  if (selectedDate) {
    selectedDay = availability.data.find((item) =>
      isSameDay(parseISO(item.date), selectedDate),
    );
  }

  const handleButtonClick = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <VStack w="full" h="full" p={6} spacing={6} align="center">
      <Heading size="xl">Pick a Time</Heading>
      <Box mt={4} w="full">
        {selectedDay && selectedDay.windows.length > 0 ? (
          <VStack spacing={2} overflowY="scroll" maxHeight="40vh" w="full">
            {selectedDay.windows.map((window, index) => {
              const startTime = format(
                parseISO(window.start),
                "hh:mm aaaaa'm'",
              );
              const endTime = format(
                addMinutes(parseISO(window.end), 1), // Add one minute to window.end
                "hh:mm aaaaa'm'",
              );
              const timeRange = `${startTime} - ${endTime}`;

              return (
                <Button
                  key={index}
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="teal"
                  variant={selectedTime === timeRange ? "solid" : "outline"}
                  minHeight={10}
                  w="full"
                  onClick={() => handleButtonClick(timeRange)}
                >
                  {timeRange}
                </Button>
              );
            })}
          </VStack>
        ) : (
          <Text>No available times</Text>
        )}
      </Box>
      {selectedTime && <Text>Selected Time: {selectedTime}</Text>}
    </VStack>
  );
};

export default AvailableTimes;
