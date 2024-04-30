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
import { useForm, type SubmitHandler } from "react-hook-form";

import {
  ServicesService,
  type ApiError,
  type ServiceCreate,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface AddServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddService = ({ isOpen, onClose }: AddServiceProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      active: false,
      duration: 0,
      max_per_day: 0,
      start: "",
      end: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ServiceCreate) =>
      ServicesService.createService({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Service created successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail;
      showToast("Something went wrong.", `${errDetail}`, "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const onSubmit: SubmitHandler<ServiceCreate> = (data) => {
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
          <ModalHeader>Add Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                {...register("name")}
                placeholder="Name"
                type="text"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="active">Active</FormLabel>
              <Switch id="active" {...register("active")} size="lg" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="duration">Duration</FormLabel>
              <Input
                id="duration"
                {...register("duration")}
                placeholder="Duration"
                type="text"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="max_per_day">Max Per Day</FormLabel>
              <Input
                id="max_per_day"
                {...register("max_per_day")}
                placeholder="Max Per Day"
                type="text"
              />
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.start}>
              <FormLabel htmlFor="start">Start</FormLabel>
              <Input
                id="start"
                {...register("start", { valueAsDate: true })}
                placeholder="Start"
                type="date"
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
                type="date"
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

export default AddService;
