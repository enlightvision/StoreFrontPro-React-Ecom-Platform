import { Delete } from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  Fab,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";
import { useEffect, useState } from "react";
import { deleteWhishListProduct, getProductsByIDs } from "../../api/ApiHelper";
import { getItem, setItem } from "../../utils/storageService";
import { serverUrl } from "../../constant";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import EmptyData from "../EmptyData/EmptyData";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { componentPaths } from "../../api/Path";
import useCart from "../../hooks/userCart";
import { messageSnakebar } from "../../utils/messageSnakebar";

type WishListProductsTypes = {
  _id: string;
  title: string;
  brand: string;
  price: number;
  category: string;
  stoke: string;
  images: string[];
  descriptions: string;
};

const Wishlist = () => {
  const [user, setUser] = useState(() => getItem("user", {})); // Initialize user state
  const [wishListProducts, setWishListProducts] = useState<
    WishListProductsTypes[]
  >([]);
  const navigate = useNavigate();
  const { setcart }: any = useCart();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (user?.wishlist?.length > 0) {
        try {
          const result = await getProductsByIDs({ productsIds: user.wishlist });
          if (result.status) {
            setWishListProducts(result.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchWishlistProducts();
  }, [user]);

  const removeProductFromWishList = async (productId: string) => {
    try {
      const result = await deleteWhishListProduct(productId, user?._id);
      if (result.status) {
        messageSnakebar("Product Deleted From Wishlist!", "success");
        setItem("user", result.data);
      }
      setUser(() => getItem("user", {}));
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      let cart = getItem("cart", []);

      const result = await deleteWhishListProduct(productId, user?._id);

      if (result.status) {
        messageSnakebar("Product Added To Cart!", "success");
        setItem("user", result.data);
      }

      setUser(() => getItem("user", {}));

      const isExist = cart.find((x: any) => x.productId == productId);

      if (!isExist) {
        cart.push({ productId: productId, quantity: 1 });
        setItem("cart", cart);
        setcart(() => getItem("cart", []));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="h-100">
        <Box className="container h-100 py-5">
          <Fab
            sx={{ backgroundColor: "white" }}
            onClick={() => navigate(componentPaths.home)}
          >
            <ArrowBackIcon />
          </Fab>
          <Box className="row d-flex justify-content-center align-items-center h-100">
            <Box className="col-10">
              <Box className="d-flex justify-content-center align-items-center mb-4 ">
                <h3 className="fw-normal mb-0">Wish List</h3>
              </Box>

              {wishListProducts.length > 0 && user?.wishlist?.length ? (
                <List>
                  <TransitionGroup>
                    {wishListProducts.map((product) => (
                      <Collapse key={product._id}>
                        <ListItem>
                          <Card className="card rounded-3 mb-4">
                            <Box className="card-body p-4">
                              <Box className="row d-flex justify-content-around align-items-center flex-wrap">
                                <Box className="col-md-2 ">
                                  <img
                                    src={serverUrl + product.images[0]}
                                    className="img-fluid rounded-3"
                                    alt="Product"
                                  />
                                </Box>
                                <Box className="col-md-3">
                                  <Typography
                                    sx={{
                                      fontSize: "1rem",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                    className="lead mb-2"
                                  >
                                    {product.title}
                                  </Typography>
                                  <p>
                                    <span className="text-muted">Brand: </span>
                                    {product.brand}
                                  </p>
                                  <Box>
                                    {" "}
                                    <span>
                                      {" "}
                                      {Number(product?.stoke) <= 0 ? (
                                        <Chip
                                          label="Out of stock"
                                          color="error"
                                        />
                                      ) : (
                                        <Chip
                                          label="In stock"
                                          color="success"
                                        />
                                      )}
                                    </span>
                                  </Box>
                                </Box>
                                <Box className="col-md-2 col-lg-2">
                                  <h5 className="mb-0">
                                    {" ₹ " +
                                      product.price
                                        .toFixed()
                                        .replace(
                                          /(\d)(?=(\d{3})+(?!\d))/g,
                                          "$1,"
                                        )}
                                  </h5>
                                </Box>
                                <Box
                                  className="col-md-2 col-lg-1 col-xl-1 text-end"
                                  display={"flex"}
                                  gap={1}
                                  p={1}
                                >
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      removeProductFromWishList(product._id)
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                  <IconButton
                                    disabled={Number(product?.stoke) <= 0}
                                    color="success"
                                    onClick={() => addToCart(product._id)}
                                  >
                                    <ShoppingCartSharpIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        </ListItem>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </List>
              ) : (
                <EmptyData title="Whishlist Items" />
              )}
            </Box>
          </Box>
        </Box>
      </section>
    </>
  );
};
export default Wishlist;
