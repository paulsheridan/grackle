import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  type ServiceRegister,
  ServicesService,
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
  } = useForm<ServiceRegister>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      active: false,
      duration: 0,
      max_per_day: 0,
      start: "",
      end: "",
      workinghours: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ServiceRegister) =>
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
      queryClient.invalidateQueries({ queryKey: ["Services"] });
    },
  });

  const onSubmit: SubmitHandler<ServiceRegister> = (data) => {
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
              <Input
                id="active"
                {...register("active")}
                placeholder="Active"
                type="checkbox"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="duration">Duration</FormLabel>
              <Input
                id="duration"
                {...register("duration")}
                placeholder="Duration"
                type="number"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="max_per_day">Max Per Day</FormLabel>
              <Input
                id="max_per_day"
                {...register("max_per_day")}
                placeholder="Max Per Day"
                type="number"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="start">Start</FormLabel>
              <DatePicker
                id="start"
                {...register("start")}
                selected={new Date()}
                onChange={(date) => {
                  register("start").onChange(date);
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="end">End</FormLabel>
              <DatePicker
                id="end"
                {...register("end")}
                selected={new Date()}
                onChange={(date) => {
                  register("end").onChange(date);
                }}
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
              <Input
                id="workinghours"
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

export default AddService;
