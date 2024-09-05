import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getItem, setItem } from "../../utils/storageService";
import {
  checkOutOrder,
  getCouponbyId,
  getProductsByIDs,
  verifyCoupon,
} from "../../api/ApiHelper";
import { serverUrl } from "../../constant";
import Validation from "../Validation/Validation";
import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";
import { componentPaths } from "../../api/Path";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { messageSnakebar } from "../../utils/messageSnakebar";

let states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];

type summaryDetailsTypes = {
  totalItems: number;
  totalAmount: number;
};

type inputDetails = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const Checkout = () => {
  let cart = getItem("cart", []);
  const user: any = getItem("user", {});
  const isCart = cart.length > 0;
  const isCoupon = getItem("couponId", "");
  const [cartProducts, setcartProducts] = useState<{}[]>([]);
  const [error, setError] = useState<any[]>([]);
  const [discount, setDiscount] = useState<any>();
  const navigate = useNavigate();

  const getState = states.find((x: string) =>
    user?.address?.includes(x.toLowerCase())
  );

  const [inputValue, setInputValue] = useState<inputDetails>({
    fullName: `${user?.firstName + " " + user?.lastName}`,
    address: user?.address ? user.address : "",
    city: "",
    pincode: "",
    state: getState || "",
  });

  const [summaryDetails, setsummaryDetails] = useState<summaryDetailsTypes>({
    totalItems: 0,
    totalAmount: 0,
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [coupon, setCoupon] = useState<{ coupon: string; apply: boolean }>({
    coupon: "",
    apply: false,
  });

  useEffect(() => {
    window.document.title = "CheckOut";
    isCart && getCartProducts();
    isCoupon && getCouponDetails();
  }, []);

  useEffect(() => {
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach((cartItem: any) => {
      const product: any = cartProducts.find(
        (product: any) => product._id === cartItem.productId
      );
      if (product) {
        totalItems += cartItem.quantity;
        totalPrice += cartItem.quantity * product.price;
      }
    });

    setsummaryDetails({
      totalAmount: totalPrice,
      totalItems,
    });
  }, [cartProducts]);

  const getCartProducts = async () => {
    try {
      const productsIds = cart.map((x: any) => x.productId);
      const result = await getProductsByIDs({ productsIds });
      if (result && result.status) {
        setcartProducts(result.data);
      }
    } catch (error) {
      setcartProducts([]);
    }
  };

  const getCouponDetails = async () => {
    try {
      const result = await getCouponbyId(isCoupon);
      if (result.status) {
        setDiscount(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckOut = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitted(true);

    const validation = Validation(inputValue, "checkout");

    if (validation.length > 0) {
      setError(validation);
      return;
    }

    try {
      const cart = getItem("cart", []);

      const data = {
        address: inputValue.address,
        city: inputValue.city,
        state: inputValue.state,
        pincode: inputValue.pincode,
        userId: user._id,
        products: cart,
        ...(isCoupon && { couponId: isCoupon }),
      };

      const result = await checkOutOrder(data);
      if (result.status) {
        setItem("orderId", result.data._id);
        navigate(componentPaths.payment + "?activeStep=1");
      }
    } catch (error: any) {
      console.log(error);
      messageSnakebar(error?.response?.data?.message, "error");
    }
  };

  const handleRedeemCoupon = async () => {
    try {
      if (!coupon.coupon || coupon.coupon == "") {
        messageSnakebar("Please Enter Coupon Code!", "error");
        return;
      }

      const result = await verifyCoupon(coupon.coupon);

      if (result && result.status) {
        messageSnakebar("Coupon Apply Successfully!", "success");
        setItem("couponId", result.data._id);
        setDiscount(result.data);
      }
    } catch (error: any) {
      console.log(error);
      messageSnakebar(error?.response?.data?.message, "error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string | any; value: any }>
  ) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      const validation = Validation(
        { ...inputValue, [name]: value },
        "checkout"
      );
      setError(validation.length > 0 ? validation : []);
    }
  };

  return (
    <>
      <Box
        width={{ xs: "100%", lg: "70%" }}
        sx={{ margin: "auto", pt: 5, overflow: "hidden" }}
      >
        <CheckoutSteps />
      </Box>
      <Box py={10} height={"100%"}>
        <Box className="container">
          <Box className="row">
            <Box className="col-xl-8 col-lg-8 mb-4">
              <Card className="card shadow-0 border">
                <FormControl className="p-4">
                  <h5 className="card-title mb-3">
                    Shpping Address {<BusinessOutlinedIcon />}
                  </h5>{" "}
                  <Box className="row">
                    <Box className="col-sm-4 mb-3">
                      <p className="mb-0">Full name</p>
                      <Box className="form-outline">
                        <TextField
                          type="text"
                          id="typeText"
                          size="small"
                          name="fullName"
                          placeholder="Type here"
                          className="form-control"
                          value={inputValue?.fullName}
                          error={error.some((e) => e.key === "fullName")}
                          helperText={
                            error.find((e) => e.key === "fullName")?.message
                          }
                          onChange={handleChange}
                        />
                      </Box>
                    </Box>
                    <Box className="col-sm-8 mb-3">
                      <p className="mb-0">Address</p>
                      <Box className="form-outline">
                        <TextField
                          type="text"
                          id="typeText"
                          size="small"
                          name="address"
                          placeholder="Type here"
                          value={inputValue?.address}
                          className="form-control"
                          error={error.some((e) => e.key === "address")}
                          helperText={
                            error.find((e) => e.key === "address")?.message
                          }
                          onChange={handleChange}
                        />
                      </Box>
                    </Box>
                    <Box className="col-sm-4 mb-3">
                      <p className="mb-0">Town/City</p>
                      <Box className="form-outline">
                        <TextField
                          type="text"
                          id="typeText"
                          name="city"
                          size="small"
                          placeholder="City"
                          value={inputValue.city}
                          className="form-control"
                          error={error.some((e) => e.key === "city")}
                          helperText={
                            error.find((e) => e.key === "city")?.message
                          }
                          onChange={handleChange}
                        />
                      </Box>
                    </Box>
                    <Box className="col-sm-4 col-6 mb-3">
                      <p className="mb-0">Pin code</p>
                      <Box className="form-outline">
                        <TextField
                          type="text"
                          size="small"
                          name="pincode"
                          id="typeText"
                          value={inputValue.pincode}
                          placeholder="Enter Pin Code"
                          className="form-control"
                          error={error.some((e) => e.key === "pincode")}
                          helperText={
                            error.find((e) => e.key === "pincode")?.message
                          }
                          onChange={handleChange}
                        />
                      </Box>
                    </Box>
                    <Box className="col-sm-4 col-6 mb-3 ">
                      <p className="mb-0">Select State</p>
                      <FormControl fullWidth required>
                        <Select
                          value={inputValue.state || ""}
                          size="small"
                          name="state"
                          // @ts-ignore
                          onChange={handleChange}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          error={
                            isSubmitted && inputValue.state == "" ? true : false
                          }
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {states.map((state, i) => (
                            <MenuItem value={state} key={i}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error>
                          {isSubmitted && inputValue.state == ""
                            ? "Please select state"
                            : ""}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() =>
                              setCoupon((pre: any) => ({
                                ...pre,
                                apply: !pre.apply,
                              }))
                            }
                          />
                        }
                        label="Have Coupon?"
                      />
                    </Box>
                  </Box>
                  <Box textAlign={"end"}>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => navigate(componentPaths.cart)}
                    >
                      Back
                    </Button>
                    {/* @ts-ignore */}
                    <Button
                      variant="contained"
                      color="info"
                      sx={{ marginLeft: "10px" }}
                      // sx={{ marginLeft: "10px", background: "#3b3b3b" }}
                      onClick={handleCheckOut}
                    >
                      Continue To Payment
                    </Button>
                  </Box>
                </FormControl>
              </Card>
              {/* Checkout */}
            </Box>
            <Box className=" col-12 col-xl-4 col-lg-4 d-flex justify-content-center justify-content-lg-end">
              <Box className="ms-lg-4 mt-4 mt-lg-0" style={{ maxWidth: 320 }}>
                <h6 className="mb-3">Summary</h6>
                <Box className="d-flex justify-content-between">
                  <p className="mb-2">Total price:</p>
                  <p className="mb-2">
                    {
                      <strong>
                        {" "}
                        {" ₹ " +
                          summaryDetails?.totalAmount
                            ?.toFixed()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                      </strong>
                    }
                  </p>
                </Box>
                <Box className="d-flex justify-content-between">
                  <p className="mb-2">Discount:</p>
                  {discount ? (
                    <p className="mb-2 text-danger">
                      {" "}
                      -{" "}
                      {discount?.discountType == "amount"
                        ? "₹" + discount.discount
                        : discount.discount + "%"}
                    </p>
                  ) : (
                    0
                  )}
                </Box>

                {/* <Box className="d-flex justify-content-between">
                  <p className="mb-2">Shipping cost:</p>
                  <p className="mb-2">+ $14.00</p>
                </Box> */}
                <hr />
                <Box className="d-flex justify-content-between">
                  <p className="mb-2">Total : - </p>
                  <p className="mb-2 fw-bold">
                    {" "}
                    <strong>
                      {" "}
                      {discount &&
                      discount.discount &&
                      discount.discountType == "amount"
                        ? " ₹ " +
                          (summaryDetails?.totalAmount - discount.discount)
                            ?.toFixed()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                        : discount &&
                          discount.discount &&
                          discount.discountType == "percent"
                        ? " ₹ " +
                          (
                            (summaryDetails?.totalAmount *
                              (100 - discount.discount)) /
                            100
                          )
                            ?.toFixed()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                        : " ₹ " +
                          summaryDetails?.totalAmount
                            ?.toFixed()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </strong>
                  </p>
                </Box>
                <Box className={coupon.apply ? "d-flex visible" : "invisible"}>
                  <TextField
                    type="text"
                    className="form-control border"
                    name=""
                    size="small"
                    placeholder="Apply Coupons"
                    value={coupon?.coupon}
                    onChange={(e: any) =>
                      setCoupon({ ...coupon, coupon: e.target.value })
                    }
                  />
                  <Button variant="outlined" onClick={handleRedeemCoupon}>
                    Apply
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="row">
            <Divider sx={{ pt: 2, pb: 2 }} textAlign="center">
              Items in cart {<ShoppingCartOutlinedIcon />}
            </Divider>
            {cartProducts.length > 0 &&
              cartProducts.map((x: any) => (
                <Box className="d-flex align-items-center mb-4" key={x._id}>
                  <Box className="me-3 position-relative">
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-secondary">
                      1
                    </span>
                    <img
                      src={serverUrl + x.images[0]}
                      style={{ height: 96, width: "96x" }}
                      className="img-sm rounded border"
                    />
                  </Box>
                  <Box className="">
                    <Link
                      style={{
                        fontSize: "1rem",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: 300,
                      }}
                      to={"/product/" + x._id}
                      className="nav-link"
                    >
                      {x.title}
                    </Link>
                    <Box className="price text-muted">
                      Total : -{" "}
                      <strong>
                        {" ₹ " +
                          x?.price
                            .toFixed()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </strong>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default Checkout;
