import { getProductsByIDs, stripePayment } from "../../api/ApiHelper";
import { loadStripe } from "@stripe/stripe-js";
import { serverUrl, STRIPE_PUBLIC_KEY } from "../../constant";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { getItem, setItem } from "../../utils/storageService";
import EmptyData from "../EmptyData/EmptyData";
import { TransitionGroup } from "react-transition-group";
import { useEffect, useState } from "react";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";

type productDataTypes = {
  _id?: string;
  title: string;
  brand: string;
  price: number;
  category: string;
  stoke: string;
  images: string[];
  descriptions: string;
};

const Payment = () => {
  const [products, setProducts] = useState<productDataTypes[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    window.document.title = "Payment";
    getProducts();
  }, []);

  const handlePayment = async () => {
    try {
      setloading(true);
      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      const cart = getItem("cart", []);
      const session: any = await stripePayment({ data: cart });
      if (session) {
        setItem("sessionId", session.id);
      }
      await stripe?.redirectToCheckout({
        sessionId: session.id,
      });
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const getProducts = async () => {
    try {
      const cart = getItem("cart", []);
      const productsIds = cart.map((x: any) => x.productId);
      const result = await getProductsByIDs({ productsIds });
      if (result && result.status) {
        setProducts(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="h-100">
        <Box className="container h-100 py-5">
          <Box className="row d-flex justify-content-center align-items-center h-100">
            <Box className="col-10">
              <Box className="d-flex justify-content-center align-items-center mb-4 ">
                <h3 className="fw-normal mb-0">Payment </h3>
              </Box>
              <CheckoutSteps />
              {products && products.length > 0 ? (
                <List>
                  <TransitionGroup>
                    {products.map((product) => (
                      <Collapse key={product._id}>
                        <ListItem>
                          <Card className="card rounded-3 mb-4">
                            <Box className="card-body p-4">
                              <Box className="row d-flex justify-content-around align-items-center flex-wrap">
                                <Box className="col-md-3">
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
                                      width: 200,
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
                                <Box className="col-md-2">
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
            <Box textAlign={"center"}>
              <Button
                variant="contained"
                type="button"
                color="success"
                onClick={handlePayment}
                disabled={loading}
                endIcon={
                  loading ? (
                    <CircularProgress size={20} color="primary" />
                  ) : (
                    <PaymentIcon />
                  )
                }
              >
                Payment
              </Button>
            </Box>
          </Box>
        </Box>
      </section>
    </>
  );
};

export default Payment;
