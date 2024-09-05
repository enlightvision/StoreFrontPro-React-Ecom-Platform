import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { getProductData } from "../../api/ApiHelper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "bootstrap/dist/css/bootstrap.min.css";
import { serverUrl } from "../../constant";
import { Button, Pagination } from "@mui/material";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import FilterDrawer from "../FilterDrawer/FilterDrawer";
import { Link } from "react-router-dom";
import EmptyData from "../EmptyData/EmptyData";

type productDataTypes = {
  title: string;
  price: number;
  category: { _id: string; category: string };
  stoke: string;
  images: string[];
  descriptions: string;
};

const ProductCard = ({
  search,
}: {
  search: { text?: string; search: boolean };
}) => {
  const [product, setproduct] = useState<productDataTypes[]>([]);
  const [openFilterDrawer, setopenFilterDrawer] = useState<boolean>(false);
  const [page, setpage] = useState<number>(1);
  const [count, setcount] = useState<number>(1);
  // @ts-ignore
  const [limit, setlimit] = useState<number>(12);
  const [query, setquery] = useState<any>({});

  useEffect(() => {
    if (query.category?.length == 0) delete query?.category;
    if (query.brands?.length == 0) delete query?.brands;
    if (query.price?.length == 0) delete query?.price;
    if (!query?.rating) delete query?.rating;
    if (!search || search.text == "") {
      delete search?.text;
    }
    getProducts();
  }, [page, query, search?.search == true]);

  const getProducts = async () => {
    try {
      // @ts-ignore
      const result = await getProductData(page, limit, query, search?.text);
      if (result && result.status) {
        setproduct(result.data.result);
        setcount(result.data.totalCount);
        return;
      }
      throw new Error("Request feild");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePagination = (
    // @ts-ignore
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setpage(value);
  };

  return (
    <>
      <h1 className="text-center p-3">Products</h1>
      <FilterDrawer
        openFilterDrawer={openFilterDrawer}
        setopenFilterDrawer={setopenFilterDrawer}
        setquery={setquery}
      />
      <Box textAlign={"end"} p={2}>
        <Button
          color="inherit"
          onClick={() => {
            setopenFilterDrawer(true);
          }}
        >
          <FilterListRoundedIcon sx={{ m: 1 }} />
          Filter
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} p={2} justifyContent={"center"}>
          {product && product.length > 0 ? (
            product.map((x: any, i) => (
              <Grid
                item
                p={1}
                xs={12}
                sm={5}
                md={4}
                lg={3}
                xl={2}
                key={i}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                border={"1px solid F"}
              >
                <Link to={"/product/" + x._id}>
                  <Card sx={{ width: 300 }}>
                    <CardMedia
                      sx={{
                        height: 300,
                        width: "100%",
                        objectFit: "cover",
                      }}
                      // sx={{ height: "13rem" }}
                      image={`${serverUrl + x.images[0]}`}
                      className="img-fluid"
                      title={x.title}
                    />
                    <CardContent>
                      <Typography
                        sx={{
                          fontSize: "small",
                          color: "gray",
                          fontWeight: 100,
                        }}
                      >
                        {x.category.category}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {x.title}
                      </Typography>
                      <Typography sx={{ fontSize: ".8rem" }}>
                        {/*@ts-ignore*/}
                        {" ₹ " +
                          x?.price
                            ?.toFixed()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))
          ) : (
            <>
              <EmptyData title="Products " />
              <Box color={"red"}>
                {"Product is not available  : - " + search?.text
                  ? search.text
                  : ""}
              </Box>
            </>
          )}
        </Grid>
        <Box
          textAlign={"center"}
          display={"flex"}
          justifyContent={"center"}
          m={2}
        >
          <Pagination
            count={Math.ceil(count / limit || 1)}
            page={page}
            onChange={handlePagination}
            variant="text"
            color="standard"
          />
        </Box>
      </Box>
    </>
  );
};
export default ProductCard;
