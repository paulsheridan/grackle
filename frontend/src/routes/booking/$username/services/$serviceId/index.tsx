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
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import {
  ApiError,
  AppointmentsService,
  ClientAppointmentRequest,
  ServicesService,
  UserPublic,
} from "../../../../../client";
import useCustomToast from "../../../../../hooks/useCustomToast";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import CustomerDetails from "../../../../../components/Scheduling/CustomerDetails";

export const Route = createFileRoute("/booking/$username/services/$serviceId/")(
  {
    component: ScheduleService,
  },
);

function BookingForm() {
  const [date, setDate] = useState(new Date());
  const { serviceId } = Route.useParams();
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { isSubmitting, errors, isDirty },
  // } = useForm<ClientAppointmentRequest>({
  //   mode: "onBlur",
  //   criteriaMode: "all",
  // });
  //
  const methods = useForm<ClientAppointmentRequest>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  const artist = queryClient.getQueryData<UserPublic>(["artist"]);

  const { data: availability } = useSuspenseQuery({
    queryKey: ["availability"],
    queryFn: () => ServicesService.getServiceAvailability({ svcId: serviceId }),
  });
  console.log(availability);

  const mutation = useMutation({
    mutationFn: (data: ClientAppointmentRequest) =>
      AppointmentsService.requestAppointment({
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Your appointment is booked!", "success");
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const onSubmit: SubmitHandler<ClientAppointmentRequest> = async (data) => {
    mutation.mutate(data);
  };

  const onCancel = () => {
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Container
        maxW="container.xl"
        bg={useColorModeValue("white", "gray.700")}
        color={useColorModeValue("gray.700", "whiteAlpha.900")}
        borderRadius="xl"
      >
        <Flex py={20}>
          <VStack
            w="full"
            h="full"
            p={6}
            spacing={10}
            alignItems="flex-start"
            as="form"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <CustomerDetails />
          </VStack>
          <VStack w="full" h="full" p={6} spacing={6} align="flex-start">
            <SimpleGrid columns={2} columnGap={3} rowGap={2} w="full">
              <GridItem colSpan={1}>
                <Heading size="xl">Pick a Date</Heading>
                <SingleDatepicker
                  name="date-input"
                  date={date}
                  onDateChange={setDate}
                />
              </GridItem>
            </SimpleGrid>
          </VStack>
          {/* <GridItem colSpan={2}>
            <Button
              variant="primary"
              type="submit"
              isLoading={methods.formState.isSubmitting}
              isDisabled={!methods.formState.isDirty}
            >
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </GridItem> */}
        </Flex>
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
              {new Array(2).fill(null).map(() => (
                <Box padding="6" boxShadow="lg" bg="white">
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
