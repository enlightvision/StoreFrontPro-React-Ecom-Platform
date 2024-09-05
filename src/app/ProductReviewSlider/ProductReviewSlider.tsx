import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Box, Rating } from "@mui/material";
import { serverUrl } from "../../constant";

type Props = {
  reviews: any[];
};

const ProductReviewSlider = ({ reviews }: Props) => {
  const progressCircle: any = useRef(null);
  const progressContent: any = useRef(null);
  const onAutoplayTimeLeft = (_s: any, time: any, progress: any) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        // pagination={{
        //   clickable: true,
        // }}
        style={{ width: "50vh", height: 300 }}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper shadow-lg rounded-3"
      >
        {reviews &&
          reviews.map((review: any) => (
            <SwiperSlide key={review._id} className="p-2">
              <Box className="row h-100">
                <Box className="col-12 d-flex gap-2 align-items-center  flex-column h-30">
                  <Box className="d-flex align-items-center p-2 gap-4">
                    <img
                      src={serverUrl + review.userId.avatar}
                      className="img-fluid rounded-circle"
                      alt="user"
                      style={{
                        width: "80px",
                        height: "80px",
                        boxShadow: "#9b8c8c9c 3px 3px 17px",
                      }}
                    />
                    <Box sx={{ float: "right" }}>
                      <p className="p-">
                        {review.userId.firstName + " " + review.userId.lastName}
                      </p>
                      <Rating readOnly value={review.rating} />
                    </Box>
                  </Box>
                </Box>
                <Box
                  className="col-12"
                  sx={{
                    textAlign: "justify",
                    textWrap: "wrap",
                    p: 3,
                    fontSize: ".8em",
                  }}
                >
                  {review.review} Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Omnis, vel. Quas, est tenetur. Voluptate,
                  illo culpa tenetur tempore reprehenderit iste sed sint
                  recusandae non. Molestias facere, eius nobis veniam quaerat
                  iste. Unde expedita fugiat sed doloremque necessitatibus nam,
                  molestiae dicta.
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </>
  );
};

export default ProductReviewSlider;
