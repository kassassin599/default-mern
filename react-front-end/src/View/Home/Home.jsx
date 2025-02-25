import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddUserModel from "../../components/Popup/AddUserModel";
import AddUserPopup from "../../components/Popup/AddUserPopup";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "./Home.css";
import Swal from "sweetalert2";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Form,
  Input,
  Card,
  CardBody,
} from "reactstrap";
import "rsuite/dist/rsuite.min.css";
import { IconButton } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import MinusRoundIcon from "@rsuite/icons/MinusRound";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import { dispatch } from "../../store/store";
import {
  GetAllUsersApi,
  UpdateStatusApi,
  UpdateUserApi,
} from "../../store/slices/adminSlice";
import { useSelector } from "react-redux";

const Home = () => {
  const { getUserList, getUserLoading } = useSelector(
    (state) => state.adminAuth
  );

  const [modal, setModal] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [name, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setFnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [edtibleIndex, setEdtibleIndex] = useState(null);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const getToken = localStorage.getItem("adminToken");

  useEffect(() => {
    dispatch(GetAllUsersApi(1, 10, ""));
  }, []);

  const toggle = () => setModalCheck(!modalCheck);

  const handleOpenClick = () => setModal(true);
  const handleCloseClick = () => {
    setModal(false);
    setEdtibleIndex(null);
  };

  const handleEdit = (data, index) => {
    setModal(true);
    setFname(data?.name);
    setEmail(data?.email);
    setId(data?._id);
    setEdtibleIndex(index);
  };
  const handleSearch = (e) => {
    let str = e ? e.target.value : "";
    if (str.length > 3) {
      console.log(e ? e.target.value : "");
      dispatch(GetAllUsersApi(1, 10, str));
    } else if (str.length === 0) {
      dispatch(GetAllUsersApi(1, 10, ""));
    }
    setSearch(e ? e.target.value : "");
  };
  const handleDelete = async (data, index) => {
    setId(data?._id);
    const flag = 3;
    setEdtibleIndex(index);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }

      dispatch(UpdateStatusApi(data?._id, flag)).then((res) => {
        dispatch(GetAllUsersApi(1, 10, ""));
      });
    });
  };
  const handleStatus = async (data, index) => {
    setId(data?._id);

    let flag = 2;

    data.flag == 1 ? (flag = 2) : (flag = 1);

    setEdtibleIndex(index);
    if (flag == 2) {
      Swal.fire({
        title: "Are you sure?",
        text: "This user will be disabled!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, disable it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Disabled!",
            text: "This user has been disabled.",
            icon: "success",
          });
          dispatch(UpdateStatusApi(data?._id, flag)).then((res) => {
            dispatch(GetAllUsersApi(1, 10, ""));
          });
        }
      });
    } else if (flag == 1) {
      Swal.fire({
        title: "Are you sure?",
        text: "This user will be enabled!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, enable it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Enabled!",
            text: "This user has been enabled.",
            icon: "success",
          });
          dispatch(UpdateStatusApi(data?._id, flag)).then((res) => {
            dispatch(GetAllUsersApi(1, 10, ""));
          });
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let ValidationFlag = false;
    if (name === "") {
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

    if (!ValidationFlag) {
      if (edtibleIndex === null) {
        // setUsers([...users, { name: name, email: email }]);
        setEmail("");
        setFname("");
        setModal(false);
        setEdtibleIndex(null);
      } else {
        // const updatedUsers = users.map((user, i) => {
        //   if (i === edtibleIndex) {
        //     return { name: name, email: email }; // Return updated user
        //   }
        //   return user; // Return existing user
        // });

        // setUsers(updatedUsers);
        dispatch(UpdateUserApi(id, { name, email })).then((res) => {
          dispatch(GetAllUsersApi(1, 10, ""));
        });
        setEdtibleIndex(null);
        setEmail("");
        setFname("");
        setModal(false);
      }
    }
  };
  // console.log("edtibleIndex", edtibleIndex, nameError);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <h1 className="title-text">User Database</h1>
      {/* <Button color="danger" onClick={toggle}>
        Click Me
      </Button> */}
      {/* <div className="dd-flex"> */}
      <div>
        <div className="blank-space"></div>
        <Link to="/login">
          <Button className="user-button">Login</Button>
        </Link>
        <Link to="/sign-up">
          <Button className="user-button">SignUp</Button>
        </Link>
        <br />
        <br />
        <br />
        <Label className="search-user-field">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => handleSearch(e)}
            placeholder="Search by name"
          />
        </Label>
        <Button className="add-user-button" onClick={() => handleOpenClick()}>
          Add User
        </Button>
      </div>
      <Card className="data-card">
        <CardBody>
          <Table>
            <thead className="table-headers">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getUserList?.docs?.length > 0 ? (
                <>
                  {getUserList?.docs?.map((row, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      {/* <td>{row?.name}</td> */}
                      <td
                        style={{
                          textDecoration:
                            row?.flag === 2 ? "line-through" : "none",
                        }}
                      >
                        {row?.name}
                      </td>
                      <td>{row?.email}</td>
                      <td>
                        {/* <Button
                      className="row-button"
                      color="info"
                      onClick={() => handleEdit(index)}
                    >
                      <img width={"20px"} src={editIcon} />
                    </Button> */}
                        {/* <Button className="row-button" color="danger" onClick={() => handleDelete(index)}>
                      <img src={editDelete}/>
                    </Button> */}
                        <IconButton
                          className="row-button"
                          icon={<EditIcon />}
                          appearance="primary"
                          color="blue"
                          onClick={() => handleEdit(row, index)}
                        ></IconButton>
                        <IconButton
                          className="row-button"
                          icon={<TrashIcon />}
                          appearance="primary"
                          color="red"
                          onClick={() => handleDelete(row, index)}
                        ></IconButton>
                        <IconButton
                          className="row-button"
                          icon={
                            row?.flag === 2 ? (
                              <PlusRoundIcon />
                            ) : (
                              <MinusRoundIcon />
                            )
                          }
                          appearance="primary"
                          color="orange"
                          onClick={() => handleStatus(row, index)}
                        ></IconButton>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr style={{ textAlign: "center" }}>
                  <td colSpan="4">
                    {getUserLoading ? "Loading" : "No Data Found"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      {/* {modal && <AddUserPopup open={modal} close={handleCloseClick} />} */}
      <Modal isOpen={modal} toggle={handleCloseClick}>
        <ModalHeader toggle={handleCloseClick}>
          {edtibleIndex === null ? "Add" : "Update"} User
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="Name">First Name</Label>
              <Input
                id="Name"
                placeholder="First Name here.."
                type="text"
                name="name"
                value={name}
                onChange={(e) => setFname(e ? e.target.value : "")}
                invalid={name.length > 0 ? true : false}
              />
            </FormGroup>
            <h6 style={{ color: "red" }}>{nameError}</h6>
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
            <Button
              color="primary"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              {edtibleIndex === null ? "Submit" : "Update"}
            </Button>
          </Form>
        </ModalBody>
        {/* <ModalFooter>
          <Button color="primary">Do Something</Button>
          <Button color="secondary">Cancel</Button>
        </ModalFooter> */}
      </Modal>
    </>
  );
};

export default Home;
