import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

import AddUser from "../Admin/AddUser";
import AddClient from "../Clients/AddClient";
import AddService from "../Services/AddService";
import AddAppointment from "../Appointments/AddAppointment";

interface NavbarProps {
  type: string;
}

const Navbar = ({ type }: NavbarProps) => {
  const addUserModal = useDisclosure();
  const addClientModal = useDisclosure();
  const addServiceModal = useDisclosure();
  const addAppointmentModal = useDisclosure();

  return (
    <>
      <Flex py={8} gap={4}>
        {/* TODO: Complete search functionality */}
        {/* <InputGroup w={{ base: '100%', md: 'auto' }}>
                    <InputLeftElement pointerEvents='none'>
                        <Icon as={FaSearch} color='ui.dim' />
                    </InputLeftElement>
                    <Input type='text' placeholder='Search' fontSize={{ base: 'sm', md: 'inherit' }} borderRadius='8px' />
                </InputGroup> */}
        <Button
          variant="primary"
          gap={1}
          fontSize={{ base: "sm", md: "inherit" }}
          onClick={
            type === "User"
              ? addUserModal.onOpen
              : type === "Client"
                ? addClientModal.onOpen
                : type === "Appointment"
                  ? addAppointmentModal.onOpen
                  : addServiceModal.onOpen
          }
        >
          <Icon as={FaPlus} /> Add {type}
        </Button>
        <AddUser isOpen={addUserModal.isOpen} onClose={addUserModal.onClose} />
        <AddClient
          isOpen={addClientModal.isOpen}
          onClose={addClientModal.onClose}
        />
        <AddService
          isOpen={addServiceModal.isOpen}
          onClose={addServiceModal.onClose}
        />
        <AddAppointment
          isOpen={addAppointmentModal.isOpen}
          onClose={addAppointmentModal.onClose}
        />
      </Flex>
    </>
  );
};

export default Navbar;
