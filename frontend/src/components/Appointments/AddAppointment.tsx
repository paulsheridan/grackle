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
//   type AppointmentRegister,
//   AppointmentsService,
// } from "../../client";
// import useCustomToast from "../../hooks/useCustomToast";

// interface AddAppointmentProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const AddAppointment = ({ isOpen, onClose }: AddAppointmentProps) => {
//   const queryClient = useQueryClient();
//   const showToast = useCustomToast();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<AppointmentRegister>({
//     mode: "onBlur",
//     criteriaMode: "all",
//     defaultValues: {
//       start: "",
//       end: "",
//       client_id: "",
//       service_id: "",
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: (data: AppointmentRegister) =>
//       AppointmentsService.createAppointment({ requestBody: data }),
//     onSuccess: () => {
//       showToast("Success!", "Appointment created successfully.", "success");
//       reset();
//       onClose();
//     },
//     onError: (err: ApiError) => {
//       const errDetail = (err.body as any)?.detail;
//       showToast("Something went wrong.", `${errDetail}`, "error");
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["Appointments"] });
//     },
//   });

//   const onSubmit: SubmitHandler<AppointmentRegister> = (data) => {
//     mutation.mutate(data);
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
//           <ModalHeader>Add Appointment</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="email">Email</FormLabel>
//               <Input
//                 id="client"
//                 {...register("client")}
//                 placeholder="Client"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="first_name">First Name</FormLabel>
//               <Input
//                 id="service"
//                 {...register("service")}
//                 placeholder="Service"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="last_name">Last Name</FormLabel>
//               <Input
//                 id="start"
//                 {...register("last_name")}
//                 placeholder="Last Name"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
//               <Input
//                 id="end"
//                 {...register("pronouns")}
//                 placeholder="Pronouns"
//                 type="text"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="birthday">Birthday</FormLabel>
//               <Input
//                 id="birthday"
//                 {...register("birthday")}
//                 placeholder="Birthday"
//                 type="text"
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
//             <Button variant="primary" type="submit" isLoading={isSubmitting}>
//               Save
//             </Button>
//             <Button onClick={onClose}>Cancel</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default AddAppointment;
