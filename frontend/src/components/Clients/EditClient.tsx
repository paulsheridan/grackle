import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  type ClientPublic,
  type ClientUpdate,
  ClientsService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface EditClientProps {
  client: ClientPublic;
  isOpen: boolean;
  onClose: () => void;
}

const EditClient = ({ client, isOpen, onClose }: EditClientProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ClientUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: client,
  });

  const mutation = useMutation({
    mutationFn: (data: ClientUpdate) =>
      ClientsService.updateClient({ clientId: client.id, requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Client updated successfully.", "success");
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

  const onSubmit: SubmitHandler<ClientUpdate> = async (data) => {
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
          <ModalHeader>Edit Client</ModalHeader>
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

export default EditClient;
