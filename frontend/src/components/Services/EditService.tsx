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
  type ServicePublic,
  type ServiceUpdate,
  ServicesService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface EditServiceProps {
  service: ServicePublic;
  isOpen: boolean;
  onClose: () => void;
}

const EditService = ({ service, isOpen, onClose }: EditServiceProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ServiceUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: service,
  });

  const mutation = useMutation({
    mutationFn: (data: ServiceUpdate) =>
      ServicesService.updateService({
        svcId: service.id,
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Service updated successfully.", "success");
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

  const onSubmit: SubmitHandler<ServiceUpdate> = async (data) => {
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
          <ModalHeader>Edit Service</ModalHeader>
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
              <FormLabel htmlFor="max_per_day">Max Bookable Per Day</FormLabel>
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

export default EditService;
