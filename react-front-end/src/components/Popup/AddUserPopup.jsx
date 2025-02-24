import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Form,
  Input,
} from "reactstrap";
import Signup from "../Signup";

function AddUserPopup({ open, close }) {
  const [modal, setModal] = useState(false);
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const toggleClose = () => close();
  //   const toggle = () => setModal(!modal);

  const handleSubmit = () => {
    let ValidationFlag = false;
    if (fname == "") {
      ValidationFlag = true;
      setFnameError("First Name cannot be empty");
      setEmailError("");
    } else if (email === "") {
      ValidationFlag = true;
      setEmailError("Email Field is Required");
      setFnameError("");
    } else {
      ValidationFlag = false;
      setFnameError("");
      setEmailError("");
    }
  };
  return (
    <div>
      <Modal isOpen={open} toggle={toggleClose}>
        <ModalHeader toggle={toggleClose}>Add User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="First Name here.."
                type="text"
                name="firstName"
                value={fname}
                onChange={(e) => setFname(e ? e.target.value : "")}
                invalid={fname.length > 0 ? true : false}
              />
            </FormGroup>
            <h6 style={{ color: "red" }}>{fnameError}</h6>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                id="exampleEmail"
                placeholder="with a placeholder"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e ? e.target.value : "")}
                invalid={emailError.length > 0 ? true : false}
              />
            </FormGroup>
            <h6 style={{ color: "red" }}>{emailError}</h6>
            <Button color="primary" onClick={() => handleSubmit()}>Submit</Button>
          </Form>
        </ModalBody>
        {/* <ModalFooter>
          <Button color="primary">Do Something</Button>{" "}
          <Button color="secondary">Cancel</Button>
        </ModalFooter> */}
      </Modal>
    </div>
  );
}

export default AddUserPopup;
