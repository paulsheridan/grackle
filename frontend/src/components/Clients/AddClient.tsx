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
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  type ClientRegister,
  ClientsService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

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
  } = useForm<ClientRegister>({
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
    mutationFn: (data: ClientRegister) =>
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
      queryClient.invalidateQueries({ queryKey: ["Clients"] });
    },
  });

  const onSubmit: SubmitHandler<ClientRegister> = (data) => {
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
            <FormControl mt={4}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                {...register("email")}
                placeholder="Email"
                type="email"
              />
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
            <FormControl mt={4}>
              <FormLabel htmlFor="birthday">Birthday</FormLabel>
              <Input
                id="birthday"
                {...register("birthday")}
                placeholder="Birthday"
                type="text"
              />
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
              <Input
                id="phone_number"
                {...register("phone_number")}
                placeholder="Phone Number"
                type="text"
              />
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
