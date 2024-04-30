import {
  Button,
  InputGroup,
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
  InputLeftAddon,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ClientCreate, ClientsService } from "../../client";
import type { ApiError } from "../../client/core/ApiError";
import useCustomToast from "../../hooks/useCustomToast";
import { emailPattern } from "../../utils";

interface AddClientProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClient = ({ isOpen, onClose }: AddClientProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      pronouns: "",
      birthday: "",
      preferred_contact: "",
      phone_number: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ClientCreate) =>
      ClientsService.createClient({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Client created successfully.", "success");
      reset();
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

  const onSubmit: SubmitHandler<ClientCreate> = (data) => {
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
          <ModalHeader>Add Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
              {errors.email && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.first_name}>
              <FormLabel htmlFor="first_name">First name</FormLabel>
              <Input
                id="first_name"
                {...register("first_name")}
                placeholder="First name"
                type="text"
              />
              {errors.first_name && (
                <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.last_name}>
              <FormLabel htmlFor="last_name">Last name</FormLabel>
              <Input
                id="last_name"
                {...register("last_name")}
                placeholder="Last name"
                type="text"
              />
              {errors.last_name && (
                <FormErrorMessage>{errors.last_name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.pronouns}>
              <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
              <Input
                id="pronouns"
                {...register("pronouns")}
                placeholder="Pronouns"
                type="text"
              />
              {errors.pronouns && (
                <FormErrorMessage>{errors.pronouns.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.birthday}>
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
            <FormControl
              mt={4}
              isRequired
              isInvalid={!!errors.preferred_contact}
            >
              <FormLabel htmlFor="preferred_contact">
                Preferred Contact
              </FormLabel>
              <Input
                id="preferred_contact"
                {...register("preferred_contact")}
                placeholder="Preferred Contact"
                type="text"
              />
              {errors.preferred_contact && (
                <FormErrorMessage>
                  {errors.preferred_contact.message}
                </FormErrorMessage>
              )}
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

export default AddClient;
