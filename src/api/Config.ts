const API_URLS = {
  register: "/user/register",
  login: "/user/login",
  updateUser: "/user",
  addWhishList: "/user/whishlist",
  deleteWhishListProduct: (productId: string, userId: string) =>
    `/user/whishlist?productId=${productId}&userId=${userId}`,
  getProducts: "/product/all",
  getCategoryAndBrand: "/product/product-brands-category",
  getProductsByIDs: "/product/cartproducts",
  getProduct: (id: string) => `/product/${id}`,
  addReview: "/review",
  getReviews: (productId: string) => `/review/${productId}`,
  verifyCoupon: (code: string) => `/coupon/apply/${code}`,
  getCouponbyId: (id: string) => `/coupon/${id}`,
  stripePayment: "/payment/create-checkout-session",
  confirmStripePayment: "/payment/verify",
  checkOutOrder: "/order",
  getOrderbyUserID: (userId: string) => `/order/user/${userId}`,
};

export { API_URLS };
