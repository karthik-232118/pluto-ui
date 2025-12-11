import axios from "axios";

import notify from "../assets/svg/utils/toast/Toast";
import { BASE_URL } from "./urlConfig";

const HEADERS = {
  "Api-Version": "v1",
  responseType: "application/json",
  "Content-Type": "application/json",
  Accept: "application/json",
};

const HEADERSMULTIPART = {
  "Api-Version": "v1",
  responseType: "application/json",
  "Content-Type": "multipart/form-data",
};

export const UnAuthApiService = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});

export const ApiService = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});

export const FileUploadService = axios.create({
  baseURL: BASE_URL,
  headers: HEADERSMULTIPART,
});

ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token != null || token != undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls

const admin = localStorage.getItem("user_type");

ApiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      notify("error", error?.response?.data?.message);

      if (admin !== "Admin") {
        window.location.href = "/";
        localStorage.removeItem("access_token");
      }
     
     
      // console.log(error)
      return error.response;
    } else if (error.response.status === 404) {
      notify("error", error?.response?.data?.message);
      return error.response;
    } else {
      return error.response;
    }
  }
);

FileUploadService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);
