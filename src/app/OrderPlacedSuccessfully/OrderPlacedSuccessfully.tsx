import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import OrderStepper from "../OrderStepper/OrderStepper";
import OrderSuccess from "../../assets/order-success-unscreen.gif";
import { useLocation, useNavigate } from "react-router-dom";
import { componentPaths } from "../../api/Path";
import { getItem, removeItem } from "../../utils/storageService";
import useCart from "../../hooks/userCart";
import { confirmStripePayment } from "../../api/ApiHelper";

const OrderPlacedSuccessfully = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setcart } = useCart();
  const user = getItem("user", {});
  const sessionId = getItem("sessionId", "");
  const orderId = getItem("orderId", "");

  useEffect(() => {
    window.document.title = "Order Placed Successfully";
    if (location.search.includes("?success=true")) {
      confirmPayment();
      removeItem("cart");
      setcart([]);
    }
  }, []);

  const confirmPayment = async () => {
    try {
      const result = await confirmStripePayment({
        sessionId,
        userId: user._id,
        orderId,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="vh-50 ">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            p: 2,
            gap: 2,
          }}
        >
          <Box p={3} width={{ xs: "100%", md: "30%" }} textAlign={"center"}>
            <img style={{ width: "100%" }} src={OrderSuccess} alt="erro" />
            <br />
            <h3>Order Placed Successfully !</h3>
          </Box>
          <OrderStepper />
          <Box p={2}>
            <Button
              variant="contained"
              sx={{ background: "black", "&:hover": { background: "#242125" } }}
              onClick={() => navigate(componentPaths.home)}
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
      </section>
    </>
  );
};

export default OrderPlacedSuccessfully;
