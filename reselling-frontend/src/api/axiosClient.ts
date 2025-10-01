import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://reselling-app.onrender.com", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
