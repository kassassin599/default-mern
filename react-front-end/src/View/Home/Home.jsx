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
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import EditUserModel from "../../components/Popup/EditUserModel";

const Home = () => {
  const { getUserList, getUserLoading } = useSelector(
    (state) => state.adminAuth
  );

  const [modal, setModal] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [rowData, setRowData] = useState("");
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
    setId(data?._id);
    setEdtibleIndex(index);
    setRowData(data);
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
                          color={row?.flag === 2 ? "green" : "red"}
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
      {modal && <AddUserModel open={modal} close={handleCloseClick} />}
      {modal && id && (
        <EditUserModel
          id={id}
          rowData={rowData}
          open={modal}
          close={handleCloseClick}
        />
      )}
    </>
  );
};

export default Home;
