import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { dispatch } from "../store/store";
import { AdminLoginApi } from "../store/slices/adminSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // console.log("email", email)

  const handleSubmit = async () => {
    let ValidationFlag = false;
    if (email === "") {
      ValidationFlag = true;
      setEmailError("Email Field is Required");
      setPasswordError("");
    } else if (password === "") {
      ValidationFlag = true;
      setPasswordError("Password Field is Required");
      setEmailError("");
    } else {
      ValidationFlag = false;
      setEmailError("");
      setPasswordError("");
    }

    if (!ValidationFlag) {
      dispatch(AdminLoginApi({ email, password })).then((res) => {
        console.log(res);
        localStorage.setItem("adminToken", res.token);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      });
    }
  };

  // console.log("import.meta.env.React_API_URL", import.meta.env.React_API_URL);
  return (
    <>
      <Container
        className="bg-light border"
        fluid="sm"
        style={{
          height: "90vh",
          width: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          body
          color="success"
          outline
          style={{
            width: "18rem",
          }}
        >
          <CardBody>
            <h1>Login</h1>
            <Form>
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
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Login;
// first last email address dob gender
