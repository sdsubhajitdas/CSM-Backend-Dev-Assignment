import axios from "axios";

export default axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
});
