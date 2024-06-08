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
import {
  ApiError,
  AppointmentsService,
  ClientAppointmentRequest,
  ServicesService,
  UserPublic,
} from "../../../../../client";
import useCustomToast from "../../../../../hooks/useCustomToast";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import CustomerDetails from "../../../../../components/Scheduling/CustomerDetails";
import Availability from "../../../../../components/Scheduling/Availability";

export const Route = createFileRoute("/booking/$username/services/$serviceId/")(
  {
    component: ScheduleService,
  },
);

function BookingForm() {
  const { serviceId } = Route.useParams();
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
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
        maxW="4xl"
        bg={useColorModeValue("white", "gray.700")}
        color={useColorModeValue("gray.700", "whiteAlpha.900")}
        borderRadius="xl"
        as="form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Flex>
          <SimpleGrid columns={[1, null, 2]}>
            <CustomerDetails />
            <Availability />
          </SimpleGrid>
          {/* <Button
            variant="primary"
            type="submit"
            isLoading={methods.formState.isSubmitting}
            isDisabled={!methods.formState.isDirty}
          >
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button> */}
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
