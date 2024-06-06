import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";

import {
  AppointmentsService,
  ClientAppointmentRequest,
  ServicePublic,
  UserPublic,
  type ApiError,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface ScheduleAppointmentProps {
  artist: UserPublic;
  service: ServicePublic;
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleAppointment = ({
  artist,
  service,
  isOpen,
  onClose,
}: ScheduleAppointmentProps) => {
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

  // const { data: availability } = useSuspenseQuery({
  //   queryKey: ["services"],
  //   queryFn: () =>
  //     ServicesService.getServiceAvailability({ svcId: service.id }),
  // });

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
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "md", md: "xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Your Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
            <FormControl mt={4}>
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <Input
                id="first_name"
                {...register("first_name")}
                placeholder="First Name"
                type="text"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="last_name">Last Name</FormLabel>
              <Input
                id="last_name"
                {...register("last_name")}
                placeholder="Last Name"
                type="text"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
              <Input
                id="pronouns"
                {...register("pronouns")}
                placeholder="Pronouns"
                type="text"
              />
            </FormControl>
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
            <FormControl mt={4}>
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
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isDirty}
            >
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScheduleAppointment;
