import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function CarauselSlider() {
  return (
    <>
      <Box p={2}>
        <Swiper className="mySwiper" rewind={true}>
          <SwiperSlide>
            <img
              className="h-100 w-100"
              style={{
                objectFit: "fill",
              }}
              src="../SliderImages/slide1.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="h-100 w-100"
              style={{
                objectFit: "fill",
              }}
              src="../SliderImages/slide2.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="h-100 w-100"
              style={{
                objectFit: "fill",
              }}
              src="../SliderImages/slide3.jpg"
              alt=""
            />
          </SwiperSlide>
        </Swiper>
      </Box>
    </>
  );
}
