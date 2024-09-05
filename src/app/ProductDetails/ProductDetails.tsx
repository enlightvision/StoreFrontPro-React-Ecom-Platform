import {
  Box,
  Button,
  Chip,
  Fab,
  Grid,
  MenuItem,
  Rating,
  Select,
  Typography,
  Zoom,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../constant";
import {
  addToWhishList,
  getProductByID,
  getReviews,
} from "../../api/ApiHelper";
import { getItem, setItem } from "../../utils/storageService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { componentPaths } from "../../api/Path";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useCart from "../../hooks/userCart";
import useAuth from "../../hooks/useAuth";
import ProductReviewDialog from "../ProductReviewDialog/ProductReviewDialog";
import ProductReviewSlider from "../ProductReviewSlider/ProductReviewSlider";
import { messageSnakebar } from "../../utils/messageSnakebar";

type productDataTypes = {
  title: string;
  rating?: string;
  price: number;
  category: string;
  stoke: string;
  images: string[];
  descriptions: string;
};

const productDetailsScreen = (): any => {
  const [product, setproduct] = useState<productDataTypes>({
    title: "",
    price: 0,
    category: "",
    stoke: "1",
    images: [],
    descriptions: "",
  });
  const { id }: any = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setisFavorite] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setcart } = useCart();
  const { isAuthenticated } = useAuth();
  const [openReviewDialog, setopenReviewDialog] = useState<boolean>(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const handleChange = (event: any) => {
    setQuantity(event.target.value);
  };

  useEffect(() => {
    window.document.title = "Product";
    getproductDataById();
    getProductReviews();
    return () => {};
  }, []);

  useEffect(() => {
    const userWhishlist = getItem("user", {})?.wishlist;
    const isExist = userWhishlist?.find((x: any) => x == id);

    if (isExist) {
      setisFavorite(true);
    } else {
      setisFavorite(false);
    }

    return () => {};
  }, [isFavorite]);

  const getproductDataById = async () => {
    try {
      const result = await getProductByID(id);
      if (result.status) {
        return setproduct(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = () => {
    try {
      let cart = getItem("cart", []);
      const isItemInCart = cart?.find((x: any) => x.productId == id);
      if (isItemInCart) {
        cart = cart.map((x: any) =>
          x.productId == id ? { ...x, quantity } : x
        );
      } else {
        cart.push({ productId: id, quantity });
      }
      setItem("cart", cart);
      setcart(getItem("cart", []));
      messageSnakebar("Product Added To Cart!", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const addToWishList = async () => {
    try {
      const user = getItem("user", {});
      if (!user || !user._id) {
        navigate("/login");
        messageSnakebar("Please Login!", "warning");
        return;
      }
      let isAdded = user?.wishlist?.find((x: string) => x == id);
      if (isAdded) {
        messageSnakebar("Product Already Added To Wishlist!", "warning");
        setisFavorite(true);
        return;
      }
      const result = await addToWhishList({ userId: user._id, productId: id });
      if (result.status) {
        messageSnakebar("Product Added To Wishlist!", "success");
        setItem("user", result.data);
        setisFavorite(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelReviewDialog = async () => {
    if (!isAuthenticated) {
      navigate(componentPaths.login);
      messageSnakebar("Please Login!", "warning");
      return;
    }
    setopenReviewDialog(true);
  };

  const getProductReviews = async () => {
    try {
      const result = await getReviews(id);
      if (result.status) {
        setReviews(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ProductReviewDialog
        open={openReviewDialog}
        setOpen={setopenReviewDialog}
        getProductReviews={getProductReviews}
      />
      <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: { xs: 300, sm: 600, md: 800 },
            overflow: "hidden",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Box sx={{ p: 1, position: "absolute" }}>
              <Fab
                sx={{ backgroundColor: "white" }}
                onClick={() => navigate(componentPaths.home)}
              >
                <ArrowBackIcon fontSize="small" />
              </Fab>
            </Box>
            <Swiper
              style={{
                borderRadius: "5px",
                height: "100%",
              }}
              loop={true}
              spaceBetween={10}
              className="mySwiper2"
            >
              {product?.images.map((x, i) => (
                <SwiperSlide key={i}>
                  <img
                    className="img-fluid"
                    style={{
                      borderRadius: "5px",
                      objectFit: "contain",
                    }}
                    src={`${serverUrl + x}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            height: "60vh",
            p: 1,
            justifyContent: "center",
            display: { xs: "flex", md: "block" },
          }}
        >
          <Box className="product?_details">
            <h2 className="pt-3">{product?.title}</h2>
            <h3>
              {"₹ " +
                product?.price
                  .toFixed()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
            </h3>
            <div className="about">
              <span>
                {" "}
                {Number(product?.stoke) <= 0 ? (
                  <Chip label="Out of stock" color="error" />
                ) : !product.stoke ? (
                  ""
                ) : (
                  <Chip label="In stock" color="success" />
                )}
              </span>
            </div>
            <p>{product.descriptions}</p>
            <ul>
              <li>Dark blue suit for a tone-on-tone look</li>
              <li>Regular fit</li>
              <li>100% Cotton</li>
              <li>Free shipping with 4 days delivery</li>
            </ul>

            <Box
              p={2}
              paddingLeft={0}
              display={"flex"}
              alignItems={"center"}
              gap={3}
            >
              <Typography>Quantity :</Typography>
              <Select
                value={quantity}
                onChange={handleChange}
                label="Quantity"
                variant="standard"
                color="warning"
              >
                {Array.from(
                  { length: Number(product.stoke) + 1 },
                  (_, i) =>
                    i != 0 && (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    )
                )}
              </Select>
            </Box>

            <Box sx={{ display: "flex", gap: 3 }}>
              <Button
                variant="contained"
                color="success"
                sx={{ p: 1.5 }}
                startIcon={<ShoppingBasketIcon />}
                onClick={addToCart}
                disabled={Number(product?.stoke) <= 0}
              >
                Add to cart
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ p: 1 }}
                startIcon={
                  isFavorite ? (
                    <>
                      <Zoom
                        in={isFavorite}
                        style={{
                          transitionDelay: isFavorite ? "200ms" : "50ms",
                        }}
                      >
                        <FavoriteIcon />
                      </Zoom>
                    </>
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                onClick={addToWishList}
              >
                wishlist
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item md={3} p={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <h4 className="p-2 ps-0">Customers reviews</h4>
              <Rating
                size="large"
                value={Number(product?.rating) || 0}
                readOnly
                name="simple-controlled"
                title="asdsa"
              />{" "}
            </Box>
            <Box>
              <h5 className="ps-1">Review this product</h5>
              <Button
                color="inherit"
                variant="outlined"
                sx={{ borderRadius: "20px" }}
                onClick={handelReviewDialog}
              >
                write a product review
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} p={2}>
          {reviews && reviews.length > 0 && (
            <ProductReviewSlider reviews={reviews} />
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default productDetailsScreen;
