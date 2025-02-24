import axios from "axios";
import { Bounce, toast } from "react-toastify";
// import { BASE_PATH } from "config";
// import { Navigate } from 'react-router-dom';
// import { dispatch } from "store";
// import { openSnackbar } from "store/slices/snackbar";

const axiosHelper = async (requestMethod, BaseUrl, body) => {
  const auth = localStorage.getItem("adminToken");
  try {
    const response = await axios({
      method: requestMethod,
      url: BaseUrl,
      data: body,
      config: (axios.defaults.headers.common.Authorization = `Bearer ${auth}`),
    });
    {
      requestMethod !== "get" &&
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
    }
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    return error?.response;
  }
};

export default axiosHelper;
