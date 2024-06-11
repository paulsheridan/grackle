import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const CustomerDetails = () => {
  const {
    register,
    formState: { errors, isDirty, isSubmitting },
  } = useFormContext();

  return (
    <VStack w="full" h="full" p={6} spacing={6} align="center">
      <Heading size="xl">Your details</Heading>
      <SimpleGrid columns={2} columnGap={3} rowGap={2} w="full">
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel htmlFor="first_name">First Name</FormLabel>
            <Input
              id="first_name"
              {...register("first_name")}
              placeholder="First Name"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel htmlFor="last_name">Last Name</FormLabel>
            <Input
              id="last_name"
              {...register("last_name")}
              placeholder="Last Name"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
            <Input
              id="pronouns"
              {...register("pronouns")}
              placeholder="Pronouns"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl isInvalid={!!errors.birthday}>
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
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
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
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl isRequired isInvalid={!!errors.email}>
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
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel htmlFor="preferred_contact">Preferred Contact</FormLabel>
            <Input
              id="preferred_contact"
              {...register("preferred_contact")}
              placeholder="Preferred Contact"
              type="text"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormLabel>Look, Buttons!</FormLabel>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isDirty}
          >
            Save
          </Button>
          <Button ml={3}>Cancel</Button>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default CustomerDetails;
