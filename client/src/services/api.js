import axios from "axios";

const api = axios.create({
  baseURL: "https://banking-system-ya5n.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;