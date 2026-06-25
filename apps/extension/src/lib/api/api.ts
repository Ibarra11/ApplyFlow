import axios from "axios";
import { formatApiErrorMessage } from "@applyflow/schema";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.data) {
      error.message = formatApiErrorMessage(error.response.data, error.message);
    }

    return Promise.reject(error);
  },
);
