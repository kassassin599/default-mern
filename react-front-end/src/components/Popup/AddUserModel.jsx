import React, { useRef, useState } from "react";
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
import { dispatch } from "../../store/store";
import { UpdateStatusApi, AddUserApi } from "../../store/slices/adminSlice";
import PreviewImage from "../common/PreviewImage";
import { IMAGES_FILE_SUPPORTED_FORMATS } from "../common/Validation";

function AddUserModel({ open, close, id, rowData }) {
  const fileRef = useRef(null);

  const [modal, setModal] = useState(false);

  const [profilePic, setProfilePic] = useState("");
  const [showProfile, setShowProfile] = useState("");
  const toggleClose = () => close();
  const toggle = () => setModal(!modal);

  const initialValues = {
    profile_pic: "",
    name: "",
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    // const newObj = {
    //   name: values.name,
    //   email: values.email,
    // };
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("profilePic", values.profile_pic);
    dispatch(AddUserApi(formData)).then((res) => {
      close();
    });
  };

  const profilePicValidationSchema = Yup.mixed()
    .test(
      "FILE_FORMAT",
      "(Note: Only JPEG, JPG, PNG image type allowed)",
      (value) =>
        !value || IMAGES_FILE_SUPPORTED_FORMATS.includes(value?.type.toString())
    )
    .test(
      "FILE_SIZE",
      "Please select an image smaller than 10 MB",
      (value) => !value || value.size <= 1024 * 1024 * 10
    );

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name field is required"),
    email: Yup.string()
      .email("Invalid Email")
      .required("Email field is required"),
    password: Yup.string()
      .required("Password field is required")
      .min(6, "Password must be at least 6 characters"),
    profile_pic: profilePicValidationSchema,
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
            <label htmlFor="password">password</label>
            <Input
              id="password"
              name="password"
              type="text"
              isValid={formik.touched.password && !formik.errors.password}
              isInvalid={formik.touched.password && formik.errors.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password ? (
              <div style={{ color: "red" }}>{formik.errors.password}</div>
            ) : null}

            <Input
              ref={fileRef}
              type="file"
              name="profile_pic"
              onChange={(event) => {
                formik.setFieldValue("profile_pic", event.target.files[0]);
              }}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "5px ",
                marginTop: "5px ",
              }}
              error={
                formik.touched.profile_pic && Boolean(formik.errors.profile_pic)
              }
              helperText={
                formik.touched.profile_pic && formik.errors.profile_pic
              }
              onBlur={formik.handleBlur}
              accept={IMAGES_FILE_SUPPORTED_FORMATS.join(",")}
            />
            <p>(Note: Only JPEG, JPG, PNG image type allowed)</p>
            {(formik.values.profile_pic && (
              <PreviewImage file={formik.values.profile_pic || profilePic} />
            )) ||
              (showProfile && (
                <img
                  src={showProfile || profilePic}
                  alt="preview"
                  width="100px"
                  height="100px"
                />
              ))}
            {formik.errors.profile_pic ? (
              <div style={{ color: "red" }}>{formik.errors.profile_pic}</div>
            ) : null}
            <Button type="submit">Update</Button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddUserModel;
