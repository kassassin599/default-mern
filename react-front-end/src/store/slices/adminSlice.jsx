import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { React_API_URL } from "../../config";
import { dispatch } from "../store";
import axiosHelper from "../../ulities/axiosHelper";

const PROXY = React_API_URL + "admin/";

// console.log("PROXY", PROXY);

const initialState = {
  adminToken: null || localStorage.getItem("adminToken"),
  adminDetails: {},
  getUserList: {
    docs: [],
    totalDocs: 0,
    limit: 0,
    page: 0,
    totalPages: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  },
  getUserLoading: true,
};

const adminSlice = createSlice({
  name: "Admin",
  initialState,
  reducers: {
    Login_Success: (state, { payload }) => {
      //   console.log(payload);
      state.adminToken = payload.token;
      state.adminDetails = payload.result;
    },
    Login_Failed: (state, action) => {
      state.adminToken = null;
      state.adminDetails = {};
    },

    Get_All_User: (state, { payload }) => {
      state.getUserList = payload.result;
      state.getUserLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
// export const {} = slices.actions;

export default adminSlice.reducer;

export const AdminLoginApi = (data) => async () => {
  try {
    const response = await axios.post(`${PROXY}login`, data);
    dispatch(adminSlice.actions.Login_Success(response.data));
    return response.data;
  } catch (error) {
    // dispatch(slices.actions.Login_Failed(error));
    return error;
  }
};

export const GetAllUsersApi =
  (page = "", limit = "", search = "", token = "") =>
  async () => {
    try {
      const newAuth = {
        header: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // const response = await axios.get(
      //   `${PROXY}get-all-user?page=${page}&limit=${limit}&search=${search}`,
      //   newAuth
      // );
      const response = await axiosHelper(
        "get",
        `${PROXY}get-all-user?page=${page}&limit=${limit}&search=${search}`
      );
      dispatch(adminSlice.actions.Get_All_User(response.data));
      return response.data;
    } catch (error) {
      // dispatch(slices.actions.Login_Failed(error));
      return error;
    }
  };

export const UpdateUserApi = (id, data) => async () => {
  try {
    // const response = await axios.put(`${PROXY}update/${id}`, data);
    const response = await axiosHelper("put", `${PROXY}update/${id}`, data);
    return response.data;
  } catch (error) {
    // dispatch(slices.actions.Login_Failed(error));
    return error;
  }
};

export const UpdateStatusApi = (id, type) => async () => {
  try {
    // const response = await axios.put(`${PROXY}change-status/${id}`, {
    //   flag: type,
    // });
    const response = await axiosHelper("put", `${PROXY}change-status/${id}`, {
      flag: type,
    });
    return response.data;
  } catch (error) {
    // dispatch(slices.actions.Login_Failed(error));
    return error;
  }
};

