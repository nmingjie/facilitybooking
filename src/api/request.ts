import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";

import statusCode from "./config/statusCode";
import { store } from "@/redux";

const request = axios.create({
  timeout: 10000,
  withCredentials: true,
  baseURL: '',
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const redux_token: string = store.getState().user.token;
    const token: string | null = sessionStorage.getItem('token');
    if (token) {
      config.headers["Authorization"] = `${token || redux_token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  (error: AxiosError) => {
    const { response } = error
    response && statusCode(response.status);
    return Promise.reject(error);
  }
);

export default request;