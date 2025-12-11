import { useSelector } from "react-redux";
import "./Banner.css"; // Import your CSS file
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../config/urlConfig";
import { Grid } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const { dashboard } = useSelector((state) => state?.dashboard);
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: banners?.length > 1, // Infinite only if there's more than 1 banner
    speed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 4000,
    fade: true,
    waitForAnimate: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: "1rem" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "25px",
          marginRight: "20px",
          height: "2px",
          background: i === currentSlide ? "white" : "rgba(255, 255, 255, 0.2)",
        }}
      />
    ),
  };
  useEffect(() => {
    if (dashboard?.banner) {
      setBanners(dashboard.banner);
    }
  }, [dashboard]);

  return (
    <>
      {banners?.length > 0 ? (
        <Slider className="custom-slider" {...settings}>
          {banners.map((slide, index) => (
            <Grid item key={`banner-${index}`} className="banner-container">
              <img
                src={`${BASE_URL}${slide?.AdvertisementBanner}`}
                alt={`Banner ${index}`}
                className="banner-image"
              />
             
            </Grid>
          ))}
        </Slider>
      ) : (
        <div className="no-banner-message">{null}</div>
      )}
    </>
  );
};

export default Banner;
