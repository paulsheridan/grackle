import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useState } from "react";
import { Availabilities } from "../../client";

interface DatePickerCalendarProps {
  availability: Availabilities;
  onDateChange: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
}

const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  availability,
  onDateChange,
  currentMonth,
  setCurrentMonth,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateClick = (day: Date) => {
    let selectedDay = null; // Initialize selectedDay as null
    if (availability) {
      selectedDay = availability.data.find((item) =>
        isSameDay(parseISO(item.date), day),
      );
    }
    if (selectedDay && selectedDay.windows.length > 0) {
      setSelectedDate(day);
      onDateChange(day);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button onClick={handlePreviousMonth}>Previous</Button>
        <Text fontSize="lg" fontWeight="bold">
          {format(currentMonth, "MMMM yyyy")}
        </Text>
        <Button onClick={handleNextMonth}>Next</Button>
      </Box>
    );
  };

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <Box textAlign="center" fontWeight="bold" key={i}>
          {format(addDays(date, i), "EEEEEE")}
        </Box>,
      );
    }

    return <SimpleGrid columns={7}>{days}</SimpleGrid>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days: JSX.Element[] = [];
    let day = startDate;
    let formattedDate = "";

    const isDateWithWindows = (date: Date) => {
      if (!availability) {
        return false;
      }
      return availability.data.some(
        (item) =>
          isSameDay(parseISO(item.date), date) && item.windows.length > 0,
      );
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        const dateHasWindows = isDateWithWindows(day);
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <GridItem
            key={day.toString()}
            textAlign="center"
            p={2}
            cursor={dateHasWindows ? "pointer" : "not-allowed"}
            bg={isSameMonth(day, monthStart) ? "white" : "gray.100"}
            color={isSameDay(day, new Date()) ? "white" : "black"}
            bgColor={
              isSelected
                ? "red.500"
                : isSameDay(day, new Date())
                  ? "blue.500"
                  : dateHasWindows
                    ? "green.200"
                    : "gray.200"
            }
            borderRadius="xl"
            _hover={dateHasWindows ? { bgColor: "blue.200" } : {}}
            onClick={() => dateHasWindows && handleDateClick(cloneDay)}
            minHeight="44px"
            m={1}
          >
            <Text>{formattedDate}</Text>
          </GridItem>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid templateColumns="repeat(7, 1fr)" key={day.toString()}>
          {days}
        </Grid>,
      );
      days = [];
    }

    return <Box>{rows}</Box>;
  };

  return (
    <VStack w="full" h="full" p={6} spacing={6} align="center">
      <Heading size="xl">Pick a Date</Heading>
      <Box
        p={4}
        borderWidth={1}
        borderRadius="md"
        width="100%"
        maxWidth="400px"
        minWidth="400px"
      >
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </Box>
    </VStack>
  );
};

export default DatePickerCalendar;
