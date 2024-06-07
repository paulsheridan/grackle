import {
  GridItem,
  SimpleGrid,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const ServiceForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <VStack w="full" h="full" p={6} spacing={6} align="flex-start">
      <SimpleGrid columns={2} columnGap={3} rowGap={2} w="full">
        <GridItem colSpan={2}>
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
        <GridItem colSpan={2}>
          <FormControl mt={4}>
            <FormLabel htmlFor="active">Active</FormLabel>
            <Switch id="active" {...register("active")} size="lg" />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl mt={4}>
            <FormLabel htmlFor="duration">Duration</FormLabel>
            <NumberInput defaultValue={15} min={15} max={240} step={15}>
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
              <FormErrorMessage>{errors.start.message}</FormErrorMessage>
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
              <FormErrorMessage>{errors.end.message}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default ServiceForm;
