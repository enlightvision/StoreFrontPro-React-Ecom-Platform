import { useEffect, useState } from "react";
import { getOrderbyUserID } from "../../api/ApiHelper";
import { getItem } from "../../utils/storageService";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { serverUrl } from "../../constant";
import OrderStepper from "../OrderStepper/OrderStepper";

const OrderHistory = () => {
  const user = getItem("user", {});
  const [orders, setOrders] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    getOrders();

    return () => {};
  }, []);
  useEffect(() => {
    if (orders.length > 0 && orders[0]) {
      setActiveStep(
        orders[0].orderStatus == "pending"
          ? 0
          : orders[0].orderStatus == "shipped"
          ? 1
          : orders[0].orderStatus == "order-in-route"
          ? 2
          : orders[0].orderStatus == "order-delivered"
          ? 3
          : 4
      );
    }
  }, [orders]);

  console.log(orders);

  const getOrders = async () => {
    try {
      const result = await getOrderbyUserID(user._id);
      if (result.status) {
        setOrders(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h4 className="text-center p-3">Order History</h4>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 3,
          p: 1,
        }}
      >
        <List
          sx={{
            width: "100%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 2,
            borderRadius: "5px",
          }}
        >
          {orders && orders.length > 0
            ? orders.map((order) =>
                order.products.map((product: any) => (
                  <>
                    <ListItem
                      key={product.productId._id}
                      sx={{
                        p: 0,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{ width: 180, height: 180 }}
                          src={serverUrl + product.productId.images[0]}
                        >
                          <ImageIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Box>
                        <ListItemText
                          primary={product.productId.title}
                          secondary={order.createdAt.split("T")[0]}
                          sx={{
                            fontSize: "1rem",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        />
                        <Typography sx={{ fontSize: ".8rem" }}>
                          {/*@ts-ignore*/}
                          {" ₹ " +
                            product.productId?.price
                              ?.toFixed()
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider key={"di" + product.productId._id} />
                  </>
                ))
              )
            : ""}
        </List>
        <Box sx={{ width: { xs: 300, md: 500 }, p: 3 }} textAlign={"center"}>
          <OrderStepper activeStep={activeStep} />
        </Box>
      </Box>
    </>
  );
};
export default OrderHistory;
