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
import { useForm, type SubmitHandler } from "react-hook-form";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ClientAppointmentRequest>({
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
    reset();
  };

  return (
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
          onSubmit={handleSubmit(onSubmit)}
        >
          <VStack spacing={1} alignItems="flex-start">
            <Heading size="xl">Your details</Heading>
          </VStack>
          <SimpleGrid columns={2} columnGap={3} rowGap={2} w="full">
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="first_name">First Name</FormLabel>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  placeholder="First Name"
                  type="text"
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="last_name">Last Name</FormLabel>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  placeholder="Last Name"
                  type="text"
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
                <Input
                  id="pronouns"
                  {...register("pronouns")}
                  placeholder="Pronouns"
                  type="text"
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl isInvalid={!!errors.birthday}>
                <FormLabel htmlFor="birthday">Birthday</FormLabel>
                <Input
                  id="birthday"
                  {...register("birthday", { valueAsDate: true })}
                  placeholder="Birthday"
                  type="date"
                />
                {errors.birthday && (
                  <FormErrorMessage>{errors.birthday.message}</FormErrorMessage>
                )}
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                <InputGroup>
                  <InputLeftAddon>+1</InputLeftAddon>
                  <Input
                    id="phone_number"
                    {...register("phone_number")}
                    placeholder="Phone Number"
                    type="tel"
                  />
                </InputGroup>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="Email"
                  type="email"
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel htmlFor="preferred_contact">
                  Preferred Contact
                </FormLabel>
                <Input
                  id="preferred_contact"
                  {...register("preferred_contact")}
                  placeholder="Preferred Contact"
                  type="text"
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!isDirty}
              >
                Save
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </GridItem>
          </SimpleGrid>
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
      </Flex>
    </Container>
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
