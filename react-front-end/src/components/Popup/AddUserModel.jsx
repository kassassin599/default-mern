import React, { useState } from "react";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Input,
  Card,
  CardBody,
} from "reactstrap";
import Signup from "../Signup";
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";

function AddUserModel({ open, close }) {
  const [modal, setModal] = useState(false);

  const toggleClose = () => close();
  const toggle = () => setModal(!modal);

  const initialValues = {
    name: "",
    email: "",
  };

  const onSubmit = async (values) => {
    const newObj = {
      name: values.name,
      email: values.email,
    };
    alert(JSON.stringify(values, null, 2));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name field is required"),
    email: Yup.string()
      .email("Invalid Email")
      .required("Email field is required"),
  });

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name Field is Required";
    }

    if (!values.email) {
      errors.email = "Email Field is Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    //...

    return errors;
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    // validate,
    validationSchema,
    onSubmit,
  });
  return (
    <div>
      <Modal isOpen={open} toggle={toggleClose}>
        <ModalHeader toggle={toggleClose}>Add User</ModalHeader>
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              name="name"
              type="text"
              isValid={formik.touched.name && !formik.errors.name}
              isInvalid={formik.touched.name && formik.errors.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}
            {/* <ErrorMessage name="name" /> */}
            <label htmlFor="email">Email Address</label>
            <Input
              id="email"
              name="email"
              type="email"
              isValid={formik.touched.email && !formik.errors.email}
              isInvalid={formik.touched.email && formik.errors.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : null}
            <Button type="submit">Submit</Button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddUserModel;
