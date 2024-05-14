import axios from "axios";

const apiUrl = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});