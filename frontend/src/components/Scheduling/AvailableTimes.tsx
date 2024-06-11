import React from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { format, parseISO, isSameDay } from "date-fns";

interface Window {
  start: string;
  end: string;
}

interface DateData {
  date: string;
  windows: Window[];
}

interface AvailableTimesProps {
  selectedDate: Date | null;
  availability: DateData[];
}

const AvailableTimes: React.FC<AvailableTimesProps> = ({
  selectedDate,
  availability,
}) => {
  let selectedDay = null; // Initialize selectedDay as null

  if (selectedDate) {
    selectedDay = availability.find((item) =>
      isSameDay(parseISO(item.date), selectedDate),
    );
  }

  return (
    <Box mt={4}>
      {selectedDay && selectedDay.windows.length > 0 ? (
        <VStack spacing={2}>
          {selectedDay.windows.map((window, index) => (
            <Button key={index} colorScheme="teal">
              {format(parseISO(window.start), "HH:mm")} -{" "}
              {format(parseISO(window.end), "HH:mm")}
            </Button>
          ))}
        </VStack>
      ) : (
        <Text>No available times</Text>
      )}
    </Box>
  );
};

export default AvailableTimes;
