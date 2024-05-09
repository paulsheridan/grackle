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
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  type AppointmentPublic,
  type AppointmentUpdate,
  AppointmentsService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface EditAppointmentProps {
  appointment: AppointmentPublic;
  isOpen: boolean;
  onClose: () => void;
}

const EditAppointment = ({
  appointment,
  isOpen,
  onClose,
}: EditAppointmentProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<AppointmentUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: appointment,
  });

  const mutation = useMutation({
    mutationFn: (data: AppointmentUpdate) =>
      AppointmentsService.updateAppointment({
        apptId: appointment.id,
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Appointment updated successfully.", "success");
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

  const onSubmit: SubmitHandler<AppointmentUpdate> = async (data) => {
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
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Edit Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor="confirmed">Confirmed</FormLabel>
              <Switch id="confirmed" {...register("confirmed")} size="lg" />
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.start}>
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
            <FormControl mt={4} isInvalid={!!errors.end}>
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

export default EditAppointment;
