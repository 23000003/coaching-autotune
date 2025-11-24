import axios from "axios";

const URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: URL,
  withCredentials: true,
});
