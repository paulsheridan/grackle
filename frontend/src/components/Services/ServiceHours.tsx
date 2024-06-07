import {
  GridItem,
  SimpleGrid,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Switch,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";

const ServiceHours = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "workinghours",
    },
  );

  return (
    <VStack w="full" h="full" spacing={6} align="flex-start">
      {/* <FormLabel htmlFor="workinghours">Working Hours</FormLabel> */}
      <Button
        variant="primary"
        type="button"
        onClick={() => append({ weekday: 1, open: "", close: "" })}
      >
        Add Working Hours
      </Button>
      {fields.map((field, index) => (
        <SimpleGrid columns={3} columnGap={3} rowGap={2} w="full">
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
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl mt={4} isRequired isInvalid={!!errors.open}>
              <FormLabel htmlFor="open">Open</FormLabel>
              <Input
                id="open"
                {...register(`workinghours[${index}].open`)}
                placeholder="Open"
                type="time"
              />
              {errors.open && (
                <FormErrorMessage>{errors.open.message}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl mt={4} isRequired isInvalid={!!errors.close}>
              <FormLabel htmlFor="close">Close</FormLabel>
              <Input
                id="close"
                {...register(`workinghours[${index}].close`)}
                placeholder="Close"
                type="time"
              />
              {errors.close && (
                <FormErrorMessage>{errors.close.message}</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <Button variant="primary" onClick={() => remove(index)}>
              Delete
            </Button>
          </GridItem>
        </SimpleGrid>
      ))}
    </VStack>
  );
};

export default ServiceHours;
