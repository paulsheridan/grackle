import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";

import {
  AppointmentsService,
  type ApiError,
  type AppointmentCreate,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface AddAppointmentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAppointment = ({ isOpen, onClose }: AddAppointmentProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      confirmed: false,
      start: "",
      end: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AppointmentCreate) =>
      AppointmentsService.createAppointment({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Appointment created successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const onSubmit: SubmitHandler<AppointmentCreate> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor="confirmed">Confirmed</FormLabel>
              <Switch id="confirmed" {...register("confirmed")} size="lg" />
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.start}>
              <FormLabel htmlFor="start">Start</FormLabel>
              <Input
                id="start"
                {...register("start", { valueAsDate: true })}
                placeholder="Start"
                type="datetime-local"
              />
              {errors.start && (
                <FormErrorMessage>{errors.start.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.end}>
              <FormLabel htmlFor="end">End</FormLabel>
              <Input
                id="end"
                {...register("end", { valueAsDate: true })}
                placeholder="End"
                type="datetime-local"
              />
              {errors.end && (
                <FormErrorMessage>{errors.end.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAppointment;
