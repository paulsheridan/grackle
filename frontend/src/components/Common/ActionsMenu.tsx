import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash } from "react-icons/fi";

import type {
  ClientPublic,
  UserPublic,
  ServicePublic,
  AppointmentPublic,
} from "../../client";
import EditUser from "../Admin/EditUser";
import EditClient from "../Clients/EditClient";
import EditService from "../Services/EditService";
import EditAppointment from "../Appointments/EditAppointment";
import Delete from "./DeleteAlert";

interface ActionsMenuProps {
  type: string;
  value: ClientPublic | UserPublic | ServicePublic | AppointmentPublic;
  disabled?: boolean;
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem
            onClick={editModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            Edit {type}
          </MenuItem>
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        </MenuList>
        {type === "User" ? (
          <EditUser
            user={value as UserPublic}
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        ) : type === "Client" ? (
          <EditClient
            client={value as ClientPublic}
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        ) : type === "Service" ? (
          <EditService
            service={value as ServicePublic}
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        ) : (
          <EditAppointment
            appointment={value as AppointmentPublic}
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        )}
        <Delete
          type={type}
          id={value.id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      </Menu>
    </>
  );
};

export default ActionsMenu;
