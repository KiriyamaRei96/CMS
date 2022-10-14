import axios from "axios";
import getCookie from "./getCookie";

export const callApi = axios.create({
  baseURL: process.env.REACT_APP_CMS_API,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // Authorization: getCookie("token"),
  },
});
