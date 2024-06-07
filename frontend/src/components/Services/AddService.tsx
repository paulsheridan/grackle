import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import {
  ServicesService,
  type ApiError,
  type ServiceCreate,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import ServiceForm from "./ServiceForm";
import ServiceHours from "./ServiceHours";

interface AddServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddService = ({ isOpen, onClose }: AddServiceProps) => {
  // const methods = useForm();
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const methods = useForm<ServiceCreate>({
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
      methods.reset();
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
      <FormProvider {...methods}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: "md", md: "5xl" }}
          isCentered
          scrollBehavior={"inside"}
        >
          <ModalOverlay />
          <ModalContent as="form" onSubmit={methods.handleSubmit(onSubmit)}>
            <ModalHeader>Add Service</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <SimpleGrid columns={[1, null, 2]}>
                <ServiceForm />
                <ServiceHours />
              </SimpleGrid>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant="primary"
                type="submit"
                isLoading={methods.formState.isSubmitting}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </FormProvider>
    </>
  );
};

export default AddService;
