import axios from "axios";

export default axios.create({
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  withCredentials: true,
});
