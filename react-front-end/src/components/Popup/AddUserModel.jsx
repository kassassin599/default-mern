import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Signup from "../Signup";


function AddUserModel({ open, close }) {
  const [modal, setModal] = useState(false);

  const toggleClose = () => close();
  const toggle = () => setModal(!modal);
  return (
    <div>
      
      <Modal isOpen={open} toggle={toggleClose}>
        <ModalHeader toggle={toggleClose}>Add User</ModalHeader>
        <ModalBody>
          <Signup/>
        </ModalBody>
        <ModalFooter>
          <Button color="primary">Do Something</Button>{" "}
          <Button color="secondary">Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AddUserModel;
