import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  useToast,
  Grid,
  GridItem,
  VStack,
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
import { useSuspenseQuery } from "@tanstack/react-query";
import { ServicesService } from "../../client";

const Calendar = ({ selectedDate, onDateChange, windowsData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const toast = useToast();
  const serviceId = "your_service_id"; // Replace 'your_service_id' with the actual service ID

  // Fetch new month worth of appointments using useSuspenseQuery
  const { data: availability, status } = useSuspenseQuery({
    queryKey: [
      "availability",
      currentMonth.getMonth(),
      currentMonth.getFullYear(),
    ],
    queryFn: () => ServicesService.getServiceAvailability({ svcId: serviceId }),
  });

  useEffect(() => {
    // Handle fetching new month appointments when month changes
    if (status === "success") {
      // Update windowsData with the fetched data
      // Here, assume availability.data is in the same format as windowsData
      windowsData = availability.data;
    }
  }, [status, availability, windowsData]);

  const handleDateClick = (day) => {
    const selectedDay = windowsData.find((item) =>
      isSameDay(parseISO(item.date), day),
    );
    if (selectedDay && selectedDay.windows.length > 0) {
      onDateChange(day);
    }
    toast({
      title: "Date Selected",
      description: format(day, "yyyy-MM-dd"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const isDateWithWindows = (date) => {
      return windowsData.some(
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
            key={day}
            textAlign="center"
            p={2}
            cursor={dateHasWindows ? "pointer" : "not-allowed"}
            bg={isSameMonth(day, monthStart) ? "white" : "gray.100"}
            color={isSameDay(day, selectedDate) ? "white" : "black"}
            bgColor={
              isSameDay(day, selectedDate)
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
        <Grid templateColumns="repeat(7, 1fr)" gap={2} key={day}>
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

const AvailableTimes = ({ selectedDate, windowsData }) => {
  const selectedDay = windowsData.find((item) =>
    isSameDay(parseISO(item.date), selectedDate),
  );

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

const DatePickerCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <Calendar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        windowsData={[]} // Initialize with empty array, data will be updated by useSuspenseQuery
      />
      <Box mt={4}>Selected Date: {format(selectedDate, "yyyy-MM-dd")}</Box>
      <AvailableTimes selectedDate={selectedDate} windowsData={[]} />{" "}
      {/* Initialize with empty array */}
    </Box>
  );
};

export default DatePickerCalendar;
