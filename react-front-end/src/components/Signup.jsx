import React, { useState } from "react";
import "./Signup.css";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

const Signup = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [dobError, setDobError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // console.log("email", email)

  const handleSubmit = () => {
    let ValidationFlag = false;
    if (fname == "") {
      ValidationFlag = true;
      setFnameError("First Name cannot be empty");
      setLnameError("");
      setAddressError("");
      setDobError("");
      setPasswordError("");
      setEmailError("");
    } else if (lname === "") {
      ValidationFlag = true;
      setLnameError("Last Name cannot be empty");
      setFnameError("");
      setAddressError("");
      setDobError("");
      setPasswordError("");
      setEmailError("");
    } else if (address === "") {
      ValidationFlag = true;
      setAddressError("Adress cannot be empty");
      setFnameError("");
      setLnameError("");
      setDobError("");
      setPasswordError("");
      setEmailError("");
    } else if (dob === "") {
      ValidationFlag = true;
      setDobError("Adress cannot be empty");
      setFnameError("");
      setLnameError("");
      setAddressError("");
      setPasswordError("");
      setEmailError("");
    } else if (email === "") {
      ValidationFlag = true;
      setEmailError("Email Field is Required");
      setFnameError("");
      setLnameError("");
      setAddressError("");
      setDobError("");
      setGenderError("");
      setPasswordError("");
    } else if (password === "") {
      ValidationFlag = true;
      setPasswordError("Password Field is Required");
      setEmailError("");
      setFnameError("");
      setLnameError("");
      setAddressError("");
      setDobError("");
      setGenderError("");
    } else {
      ValidationFlag = false;
      setFnameError("");
      setLnameError("");
      setAddressError("");
      setDobError("");
      setGenderError("");
      setPasswordError("");
      setEmailError("");
    }
  };

  console.log("password", passwordError, emailError);
  return (
    <>
      <h3 className="title">Signup</h3>
      <Form className="data-card">
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
          <Label for="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last Name here.."
            type="text"
            name="lastName"
            value={lname}
            onChange={(e) => setLname(e ? e.target.value : "")}
            invalid={lname.length > 0 ? true : false}
          />
        </FormGroup>
        <h6 style={{ color: "red" }}>{lnameError}</h6>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input
            id="address"
            placeholder="Address here.."
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e ? e.target.value : "")}
            invalid={address.length > 0 ? true : false}
          />
        </FormGroup>
        <h6 style={{ color: "red" }}>{addressError}</h6>
        <FormGroup>
          <Label for="dob">Date of birth</Label>
          <Input
            id="dob"
            placeholder="Date of birth here.."
            type="date"
            name="date"
            value={dob}
            onChange={(e) => setDob(e ? e.target.value : "")}
            invalid={dob.length > 0 ? true : false}
          />
        </FormGroup>
        <h6 style={{ color: "red" }}>{dobError}</h6>
        <FormGroup>
          <label for="gender">Gender</label>
          <input
            className="gender-input"
            type="radio"
            name="gender"
            value="male"
            id="male"
            checked={gender === "male"}
            onChange={(e) => setGender(e.target.value)}
          />
          Male
          <input
            className="gender-input"
            type="radio"
            name="gender"
            value="female"
            id="female"
            checked={gender === "female"}
            onChange={(e) => setGender(e.target.value)}
          />
          Female
        </FormGroup>
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
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            id="examplePassword"
            name="password"
            placeholder="password placeholder"
            type="password"
            value={password}
            onChange={(e) => setPassword(e ? e.target.value : "")}
            invalid={passwordError.length > 0 ? true : false}
          />
        </FormGroup>
        {/* <FormFeedback tooltip>{passwordError}</FormFeedback> */}
        <h6 style={{ color: "red" }}>{passwordError}</h6>
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </Form>
    </>
  );
};

export default Signup;
// first last email address dob gender
