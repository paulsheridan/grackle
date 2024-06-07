import {
  Button,
  GridItem,
  SimpleGrid,
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
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useFieldArray,
  useForm,
  FormProvider,
  type SubmitHandler,
} from "react-hook-form";

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
  const { control } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "workinghours",
    },
  );

  return (
    <>
      <FormProvider {...methods}>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: "sm", md: "xl" }}
          isCentered
          scrollBehavior={"inside"}
        >
          <ModalOverlay />
          <ModalContent
            as="form"
            maxW="container.xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <ModalHeader>Add Service</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack w="full" h="full" p={6} spacing={6} align="flex-start">
                <SimpleGrid columns={2} columnGap={3} rowGap={2} w="full">
                  <GridItem colSpan={1}>
                    <FormControl mt={4} isRequired>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Name"
                        type="text"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl mt={4}>
                      <FormLabel htmlFor="active">Active</FormLabel>
                      <Switch id="active" {...register("active")} size="lg" />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl mt={4}>
                      <FormLabel htmlFor="duration">Duration</FormLabel>
                      <NumberInput
                        defaultValue={15}
                        min={15}
                        max={240}
                        step={15}
                      >
                        <NumberInputField
                          {...register("duration", {
                            required: "This field is required",
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl mt={4}>
                      <FormLabel htmlFor="max_per_day">Max Per Day</FormLabel>
                      <NumberInput defaultValue={1} min={1} max={20}>
                        <NumberInputField
                          {...register("max_per_day", {
                            required: "This field is required",
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl mt={4} isRequired isInvalid={!!errors.start}>
                      <FormLabel htmlFor="start">Start</FormLabel>
                      <Input
                        id="start"
                        {...register("start", { valueAsDate: true })}
                        placeholder="Start"
                        type="date"
                      />
                      {errors.start && (
                        <FormErrorMessage>
                          {errors.start.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <FormControl mt={4} isRequired isInvalid={!!errors.end}>
                      <FormLabel htmlFor="end">End</FormLabel>
                      <Input
                        id="end"
                        {...register("end", { valueAsDate: true })}
                        placeholder="End"
                        type="date"
                      />
                      {errors.end && (
                        <FormErrorMessage>
                          {errors.end.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </SimpleGrid>
              </VStack>
              <VStack w="full" h="full" p={6} spacing={6} align="flex-start">
                <FormLabel htmlFor="workinghours">Working Hours</FormLabel>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => append({ weekday: 1, open: "", close: "" })}
                >
                  Add Working Hours
                </Button>
                {fields.map((field, index) => (
                  <GridItem colSpan={1}>
                    <FormControl mt={4}>
                      <FormLabel htmlFor="weekday">Weekday</FormLabel>
                      <NumberInput defaultValue={0} min={0} max={6}>
                        <NumberInputField
                          {...register(`workinghours[${index}].weekday`)}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl mt={4} isRequired isInvalid={!!errors.open}>
                      <FormLabel htmlFor="open">Open</FormLabel>
                      <Input
                        id="open"
                        {...register(`workinghours[${index}].open`)}
                        placeholder="Open"
                        type="time"
                      />
                      {errors.open && (
                        <FormErrorMessage>
                          {errors.open.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl mt={4} isRequired isInvalid={!!errors.close}>
                      <FormLabel htmlFor="close">Close</FormLabel>
                      <Input
                        id="close"
                        {...register(`workinghours[${index}].close`)}
                        placeholder="Close"
                        type="time"
                      />
                      {errors.close && (
                        <FormErrorMessage>
                          {errors.close.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <Button variant="primary" onClick={() => remove(index)}>
                      Delete
                    </Button>
                  </GridItem>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button variant="primary" type="submit" isLoading={isSubmitting}>
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
