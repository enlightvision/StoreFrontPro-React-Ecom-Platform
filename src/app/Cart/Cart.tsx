import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Card,
  Chip,
  Fab,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Favorite } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getItem, setItem } from "../../utils/storageService";
import { addToWhishList, getProductsByIDs } from "../../api/ApiHelper";
import { serverUrl } from "../../constant";
import EmptyData from "../EmptyData/EmptyData";
import { Link, useNavigate } from "react-router-dom";
import { componentPaths } from "../../api/Path";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import useCart from "../../hooks/userCart";
import { messageSnakebar } from "../../utils/messageSnakebar";

type summaryDetailsTypes = {
  totalItems: number;
  totalAmount: number;
};

export default function Cart() {
  let { cart, setcart }: any = useCart();
  const isCart = cart?.length > 0;
  const [cartProducts, setcartProducts] = useState<{}[]>([]);
  const [summaryDetails, setsummaryDetails] = useState<summaryDetailsTypes>({
    totalItems: 0,
    totalAmount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.document.title = "Cart";
    isCart ? getCartProducts() : "";
    return () => {};
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
  }, [cart, cartProducts]);

  const CheckOutHandler = async () => {
    try {
      navigate(componentPaths.checkOut);
    } catch (error) {}
  };

  const getCartProducts = async () => {
    try {
      setcart(getItem("cart", []));
      const productsIds = cart.map((x: any) => x.productId);
      const result = await getProductsByIDs({ productsIds });
      if (result && result.status) {
        setcartProducts(result.data);
      }
    } catch (error) {
      setcartProducts([]);
    }
  };

  const removeCartItems = (id: string) => {
    cart = cart.filter((x: any) => x.productId != id);
    setItem("cart", cart);
    setcart(cart);
    cart.length > 0 && getCartProducts();
  };

  const updateCartItems = (updateQty: string, id: string) => {
    if (updateQty == "add") {
      let tmp: any = cartProducts.find((x: any) => x._id == id);
      cart = cart.map((x: any) =>
        x.productId == id && tmp.stoke > x.quantity
          ? { ...x, quantity: x.quantity + 1 }
          : x
      );
    } else {
      cart = cart.map((x: any) =>
        x.productId == id && x.quantity > 1
          ? { ...x, quantity: x.quantity - 1 }
          : x
      );
    }
    setItem("cart", cart);
    setcart(cart);
  };

  const addToWishList = async (productId: string) => {
    try {
      const user = getItem("user", {});
      if (!user || !user._id) {
        navigate("/login");
        messageSnakebar("Please Login !", "warning");
        return;
      }
      let isAdded = user?.wishlist?.find((x: string) => x == productId);
      if (isAdded) {
        messageSnakebar("Product Already Added To Wishlist!", "warning");
        return;
      }
      const result = await addToWhishList({ userId: user._id, productId });
      if (result.status) {
        messageSnakebar("Product Added To Wishlist!", "success");
        setItem("user", result.data);
      }
      removeCartItems(productId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="h-100 gradient-custom">
        <Box className="container py-5">
          <Fab
            sx={{ backgroundColor: "white" }}
            onClick={() => navigate(componentPaths.home)}
          >
            <ArrowBackIcon />
          </Fab>
          <Box className="row d-flex justify-content-center my-4">
            {cart && cart?.length > 0 ? (
              <>
                <Box className="col-md-8">
                  <Card className="card mb-4 " sx={{ boxShadow: 2 }}>
                    <Box className="card-header bg-white py-3 d-flex gap-2">
                      <h5 className="mb-0">
                        Cart - {cartProducts?.length} items
                      </h5>
                      <LocalMallOutlinedIcon />
                    </Box>
                    <Box className="card-body">
                      {cartProducts?.map((product: any, i) => (
                        <Box key={i}>
                          {/*  item */}
                          <Box className="row">
                            <Box className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                              {/* Image */}
                              <Box
                                className="bg-image hover-overlay hover-zoom ripple rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={serverUrl + product.images[0]}
                                  className="w-100"
                                  alt="Blue Jeans Jacket"
                                />
                              </Box>
                              {/* Image */}
                            </Box>
                            <Box className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                              {/* Data */}
                              <Link
                                to={"/product/" + product._id}
                                style={{
                                  color: "black",
                                  textDecoration: "none",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "1rem",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                  }}
                                >
                                  <strong>{product?.title}</strong>
                                </Typography>
                              </Link>
                              <p>Category: {product?.category}</p>
                              <Box>
                                {" "}
                                {Number(product?.stoke) <= 0 ? (
                                  <Chip label="Out of stock" color="error" />
                                ) : (
                                  <Chip label="In stock" color="success" />
                                )}
                              </Box>

                              <Button
                                sx={{ m: 1 }}
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => removeCartItems(product?._id)}
                              >
                                <DeleteIcon />
                              </Button>
                              <Button
                                sx={{ m: 1 }}
                                variant="contained"
                                color="warning"
                                size="small"
                                onClick={() => addToWishList(product?._id)}
                              >
                                <Favorite />
                              </Button>
                              {/* Data */}
                            </Box>
                            <Box className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                sx={{
                                  ".MuiOutlinedInput-input": {
                                    height: "0.4375em",
                                    fontSize: "medium",
                                    color: "inherit",
                                  },
                                  ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "black",
                                  },
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    updateCartItems("minus", product?._id);
                                  }}
                                >
                                  <RemoveIcon />
                                </IconButton>
                                <TextField
                                  size="small"
                                  type="number"
                                  sx={{ width: 50 }}
                                  value={
                                    cart.find(
                                      (x: any) => x.productId == product._id
                                    )?.quantity || 0
                                  }
                                  // value={cart[i]?.quantity || 0}
                                />
                                <IconButton
                                  onClick={() => {
                                    updateCartItems("add", product?._id);
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Box>
                              {/* Quantity */}
                              {/* Price */}
                              <p className="text-start text-md-center">
                                Price :
                                <strong>
                                  {" ₹ " +
                                    product?.price
                                      .toFixed()
                                      .replace(
                                        /(\d)(?=(\d{3})+(?!\d))/g,
                                        "$1,"
                                      )}
                                </strong>
                              </p>
                              {/* Price */}
                            </Box>
                          </Box>
                          {/*  item */}
                          <hr className="my-4" key={i + "hr"} />
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Box>
                <Box className="col-md-4">
                  <Box className="card mb-4" sx={{ boxShadow: 2 }}>
                    <Box className="card-header bg-white py-3">
                      <h5 className="mb-0">Summary</h5>
                    </Box>
                    <Box className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                          Products
                          <span>{cart?.length || 0}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                          Total Items
                          <span>{summaryDetails.totalItems}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          <Box>
                            <strong>Total amount</strong>
                            <strong>
                              <p className="mb-0">(including Tax)</p>
                            </strong>
                          </Box>
                          <span>
                            <strong>
                              {" "}
                              {" ₹ " +
                                summaryDetails?.totalAmount
                                  ?.toFixed()
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                            </strong>
                          </span>
                        </li>
                      </ul>
                      <Button
                        variant="contained"
                        disabled={cartProducts?.some((x: any) => x.stoke == 0)}
                        color="info"
                        onClick={CheckOutHandler}
                        startIcon={<ShoppingCartCheckoutOutlinedIcon />}
                      >
                        Go to checkout
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              <EmptyData title="Cart Items" />
            )}
          </Box>
        </Box>
      </section>
    </>
  );
}
