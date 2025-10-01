import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://reselling-app.onrender.com/api", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
