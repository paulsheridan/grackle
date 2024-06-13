import {
  Box,
  Button,
  Container,
  GridItem,
  SimpleGrid,
  SkeletonText,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ApiError,
  AppointmentsService,
  Availabilities,
  ClientAppointmentRequest,
  ServicesService,
  UserPublic,
} from "../../../../../client";
import useCustomToast from "../../../../../hooks/useCustomToast";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import AvailableTimes from "../../../../../components/Scheduling/AvailableTimes";
import CustomerDetails from "../../../../../components/Scheduling/CustomerDetails";
import DatePickerCalendar from "../../../../../components/Scheduling/DatePickerCalendar";

export const Route = createFileRoute("/booking/$username/services/$serviceId/")(
  {
    component: ScheduleService,
  },
);

function BookingForm() {
  const { serviceId } = Route.useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [apptStart, setApptStart] = useState<string | null>(null);
  const [apptEnd, setApptEnd] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const methods = useForm<ClientAppointmentRequest>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  const artist = queryClient.getQueryData<UserPublic>(["artist"]);

  const { data: availability = { data: [] } } = useQuery<Availabilities>({
    queryKey: ["availability", currentMonth],
    queryFn: () =>
      ServicesService.getServiceAvailability({
        svcId: serviceId,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      }),
  });

  const mutation = useMutation({
    mutationFn: (data: ClientAppointmentRequest) =>
      AppointmentsService.requestAppointment({
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Your appointment has been requested!", "success");
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });

  const onSubmit: SubmitHandler<ClientAppointmentRequest> = async (data) => {
    const formData = {
      ...data,
      start: apptStart,
      end: apptEnd,
      service_id: serviceId,
      user_id: artist.id,
    };
    mutation.mutate(formData);
  };

  const onCancel = () => {
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Container
        maxW="7xl"
        bg={useColorModeValue("white", "gray.700")}
        color={useColorModeValue("gray.700", "whiteAlpha.900")}
        borderRadius="xl"
        as="form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <SimpleGrid columns={[1, null, null, 5]}>
          <GridItem colSpan={2}>
            <CustomerDetails />
          </GridItem>
          <GridItem colSpan={2}>
            <DatePickerCalendar
              availability={availability}
              onDateChange={setSelectedDate}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
          </GridItem>
          <GridItem colSpan={1}>
            <AvailableTimes
              availability={availability}
              selectedDate={selectedDate}
              setApptStart={setApptStart}
              setApptEnd={setApptEnd}
            />
          </GridItem>
        </SimpleGrid>
        <Box w="100%" p={4}>
          <Button
            variant="primary"
            type="submit"
            isLoading={methods.formState.isSubmitting}
            isDisabled={!methods.formState.isDirty}
          >
            Save
          </Button>
          <Button onClick={onCancel} m={3}>
            Cancel
          </Button>
        </Box>
      </Container>
    </FormProvider>
  );
}

function ScheduleService() {
  return (
    <Container maxW="container.xl" p={0}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <Text>Something went wrong: {error.message}</Text>
        )}
      >
        <Suspense
          fallback={
            <Box>
              {new Array(2).fill(null).map((_, index) => (
                <Box padding="6" boxShadow="lg" bg="white" key={index}>
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={4}
                    spacing="4"
                    skeletonHeight="2"
                  />
                </Box>
              ))}
            </Box>
          }
        >
          <BookingForm />
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
}
