import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  VStack,
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

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

export const Route = createFileRoute("/booking/$username/services/$serviceId/")(
  {
    component: ScheduleService,
  },
);

function ScheduleService() {
  const [date, setDate] = useState(new Date());
  const { username } = Route.useParams() as { username: string };
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

  const mutation = useMutation({
    mutationFn: (data: ClientAppointmentRequest) =>
      AppointmentsService.requestAppointment({
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Your appointment is booked!", "success");
      onClose();
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
    onClose();
  };

  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <VStack spacing={3} alignItems="flex-start">
        <Heading size="2xl">Your details</Heading>
      </VStack>
      <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
        <GridItem colSpan={1}>
          <FormControl mt={4} isRequired isInvalid={!!errors.email}>
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
        <GridItem colSpan={2}>
          <FormControl mt={4}>
            <FormLabel htmlFor="first_name">First Name</FormLabel>
            <Input
              id="first_name"
              {...register("first_name")}
              placeholder="First Name"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl mt={4}>
            <FormLabel htmlFor="last_name">Last Name</FormLabel>
            <Input
              id="last_name"
              {...register("last_name")}
              placeholder="Last Name"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl mt={4}>
            <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
            <Input
              id="pronouns"
              {...register("pronouns")}
              placeholder="Pronouns"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl mt={4} isInvalid={!!errors.birthday}>
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
          <FormControl mt={4}>
            <FormLabel htmlFor="preferred_contact">Preferred Contact</FormLabel>
            <Input
              id="preferred_contact"
              {...register("preferred_contact")}
              placeholder="Preferred Contact"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl mt={4}>
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
      <SingleDatepicker name="date-input" date={date} onDateChange={setDate} />
    </VStack>
  );
}
