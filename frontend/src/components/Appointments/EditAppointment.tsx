// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import {
//   Button,
//   FormControl,
//   FormErrorMessage,
//   FormLabel,
//   Input,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
// } from "@chakra-ui/react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { type SubmitHandler, useForm } from "react-hook-form";

// import {
//   type ApiError,
//   type AppointmentPublic,
//   type AppointmentUpdate,
//   AppointmentsService,
// } from "../../client";
// import useCustomToast from "../../hooks/useCustomToast";

// interface EditAppointmentProps {
//   client: AppointmentPublic;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const EditAppointment = ({ client, isOpen, onClose }: EditAppointmentProps) => {
//   const queryClient = useQueryClient();
//   const showToast = useCustomToast();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting, errors, isDirty },
//   } = useForm<AppointmentUpdate>({
//     mode: "onBlur",
//     criteriaMode: "all",
//     defaultValues: client,
//   });

//   const mutation = useMutation({
//     mutationFn: (data: AppointmentUpdate) =>
//       AppointmentsService.updateAppointment({
//         id: client.id,
//         requestBody: data,
//       }),
//     onSuccess: () => {
//       showToast("Success!", "Appointment updated successfully.", "success");
//       onClose();
//     },
//     onError: (err: ApiError) => {
//       const errDetail = (err.body as any)?.detail;
//       showToast("Something went wrong.", `${errDetail}`, "error");
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["clients"] });
//     },
//   });

//   const onSubmit: SubmitHandler<AppointmentUpdate> = async (data) => {
//     mutation.mutate(data);
//   };

//   const onCancel = () => {
//     reset();
//     onClose();
//   };

//   return (
//     <>
//       <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         size={{ base: "sm", md: "md" }}
//         isCentered
//       >
//         <ModalOverlay />
//         <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
//           <ModalHeader>Edit Appointment</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="email">Email</FormLabel>
//               <Input
//                 id="email"
//                 {...register("email")}
//                 placeholder="Email"
//                 type="email"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="first_name">First Name</FormLabel>
//               <Input
//                 id="first_name"
//                 {...register("first_name")}
//                 placeholder="First Name"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="last_name">Last Name</FormLabel>
//               <Input
//                 id="last_name"
//                 {...register("last_name")}
//                 placeholder="Last Name"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
//               <Input
//                 id="pronouns"
//                 {...register("pronouns")}
//                 placeholder="Pronouns"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="birthday">Birthday</FormLabel>
//               <DatePicker
//                 id="birthday"
//                 {...register("birthday")}
//                 selected={new Date(client.birthday)}
//                 onChange={(date) => {
//                   register("birthday").onChange(date);
//                 }}
//                 dateFormat="MM/dd/yyyy"
//                 placeholderText="MM/DD/YYYY"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="preferred_contact">
//                 Preferred Contact
//               </FormLabel>
//               <Input
//                 id="preferred_contact"
//                 {...register("preferred_contact")}
//                 placeholder="Preferred Contact"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
//               <Input
//                 id="phone_number"
//                 {...register("phone_number")}
//                 placeholder="Phone Number"
//                 type="text"
//               />
//             </FormControl>
//           </ModalBody>
//           <ModalFooter gap={3}>
//             <Button
//               variant="primary"
//               type="submit"
//               isLoading={isSubmitting}
//               isDisabled={!isDirty}
//             >
//               Save
//             </Button>
//             <Button onClick={onCancel}>Cancel</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default EditAppointment;
