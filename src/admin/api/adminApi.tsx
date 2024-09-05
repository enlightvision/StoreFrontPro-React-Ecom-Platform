import axios from "../../api/interceptor";
import { ADMIN_API_URLS } from "./Config";

export const adminLogin = (data: any) => {
  return axios.post(ADMIN_API_URLS.adminLogin, data);
};
