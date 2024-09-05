import axios from "axios";
import { serverUrl } from "../constant";
import { getItem, setItem } from "../utils/storageService";

// Store requests
axios.defaults.baseURL = serverUrl;
axios.create({ headers: { "Content-Type": "application/json" } });

axios.interceptors.request.use(
  (config) => {
    const accessToken = getItem("accessToken", "");
    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    console.log("Error :", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    const data = response?.data;
    return data;
  },
  async (error) => {
    if (error?.response?.status == 401) {
      try {
        //@ts-ignore
        const refreshTokenResponse = await handleRefreshToken();
        const originalRequest = error.config;
        return await axios(originalRequest);
      } catch (refershTokenError) {
        throw refershTokenError;
      }
    }
    throw error;
    // return Promise.reject(error)
  }
);

export default axios;

const handleRefreshToken = async () => {
  try {
    const refreshToken = getItem("refreshToken", "");
    const result = await axios.post("/user/refresh-token", {
      refreshToken: `Bearer ${refreshToken}`,
    });
    console.log(result);
    const { accessToken }: any = result.data;
    setItem("accessToken", accessToken);
    return result.data;
  } catch (error) {
    console.log("Error :", error);
    throw error;
  }
};
