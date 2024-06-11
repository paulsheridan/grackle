import React from "react";
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Availabilities, ServicesService } from "../../client";

interface Window {
  start: string;
  end: string;
}

interface DateData {
  date: string;
  windows: Window[];
}

interface DatePickerCalendarProps {
  onDateChange: (date: Date) => void;
  serviceId: string;
}

const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  serviceId,
  onDateChange,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const {
    data: availability,
    status,
    error,
  } = useQuery<Availabilities>({
    queryKey: ["availability", currentMonth],
    queryFn: () =>
      ServicesService.getServiceAvailability({
        svcId: serviceId,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      }),
  });

  const handleDateClick = (day: Date) => {
    let selectedDay = null; // Initialize selectedDay as null
    if (availability) {
      selectedDay = availability.data.find((item) =>
        isSameDay(parseISO(item.date), day),
      );
    }
    if (selectedDay && selectedDay.windows.length > 0) {
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
        return false; // Return false if availability is null
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

        days.push(
          <GridItem
            key={day.toString()}
            textAlign="center"
            p={2}
            cursor={dateHasWindows ? "pointer" : "not-allowed"}
            bg={isSameMonth(day, monthStart) ? "white" : "gray.100"}
            color={isSameDay(day, new Date()) ? "white" : "black"}
            bgColor={
              isSameDay(day, new Date())
                ? "blue.500"
                : dateHasWindows
                  ? "green.200"
                  : "gray.200"
            }
            borderRadius="md"
            _hover={dateHasWindows ? { bgColor: "blue.200" } : {}}
            onClick={() => dateHasWindows && handleDateClick(cloneDay)}
          >
            <Text>{formattedDate}</Text>
          </GridItem>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid templateColumns="repeat(7, 1fr)" gap={2} key={day.toString()}>
          {days}
        </Grid>,
      );
      days = [];
    }

    return <Box>{rows}</Box>;
  };

  return (
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
  );
};

export default DatePickerCalendar;
