import { API_URLS } from "./Config";
import axios from "./interceptor";

export const registerUserAPI = async (data: any) => {
  return await axios.post(API_URLS.register, data);
};

export const loginUserAPI = async (data: any) => {
  return await axios.post(API_URLS.login, data);
};

export const getProductData = async (
  page: number,
  limit: number,
  query: any,
  search: string
) => {
  return await axios.post(API_URLS.getProducts, {
    ...query,
    page,
    limit,
    search: search,
  });
};

export const updateUserProfile = async (data: any) => {
  return await axios.patch(API_URLS.updateUser, data);
};

export const getCategoryAndBrand = async () => {
  return await axios.get(API_URLS.getCategoryAndBrand);
};

export const getProductByID = async (id: string) => {
  return await axios.get(API_URLS.getProduct(id));
};

export const getProductsByIDs = async (data: any) => {
  return await axios.post(API_URLS.getProductsByIDs, data);
};

export const addToWhishList = async (data: any) => {
  return await axios.put(API_URLS.addWhishList, data);
};

export const deleteWhishListProduct = async (
  productId: string,
  userId: string
) => {
  return await axios.delete(API_URLS.deleteWhishListProduct(productId, userId));
};

export const verifyCoupon = async (code: string) => {
  return await axios.get(API_URLS.verifyCoupon(code));
};

export const getCouponbyId = async (id: string) => {
  return await axios.get(API_URLS.getCouponbyId(id));
};

export const stripePayment = async (data: any) => {
  return await axios.post(API_URLS.stripePayment, data);
};

export const confirmStripePayment = async (data: any) => {
  return await axios.post(API_URLS.confirmStripePayment, data);
};

export const checkOutOrder = async (data: any) => {
  return await axios.post(API_URLS.checkOutOrder, data);
};

export const getOrderbyUserID = async (userId: string) => {
  return await axios.get(API_URLS.getOrderbyUserID(userId));
};

export const addReview = async (data: any) => {
  return await axios.post(API_URLS.addReview, data);
};

export const getReviews = async (productId: string) => {
  return await axios.get(API_URLS.getReviews(productId));
};

// export const loginUserAPI = async (data: any) => {
//     try {
//         let result = await axios.post(`${Url}/user/login`, data)
//         console.log(result, "resilt");
//         let responseData = result.data
//         return responseData
//     } catch (err) {
//         return enqueueSnackbar<"error">(err?.response?.data?.message, { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } })
//     }
// }
// export const getProductData = async (page: number, limit: number) => {
//     return await axios.get(`/product?page=${page}&limit=${limit}`)
// }
