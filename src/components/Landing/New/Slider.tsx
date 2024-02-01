
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./Slider.css";
function Slider() {
  // after:content-[''] after:bg-[url('./assets/img/fea_bg_d3fcd82.webp')] after:w-full after:h-[calc(100%_-_2px)] after:top-0 after:left-0 after:bg-cover after:bg-no-repeat after:absolute

  const newsSlides = [
    {
      id: 1,
      photo: "https://i.ibb.co/4YpYbHX/3rdAnni.webp",
    },
    {
      id: 2,
      photo: "https://i.ibb.co/WK9pf1V/79d2b6de-0062-4406-aa16-2ecc661c95bd.jpg",
    },
    {
      id: 3,
      photo: "https://i.ibb.co/85P5kx7/5f3d25be-0ef5-4698-8da2-6ad19184d432.jpg",
    },
    {
      id: 4,
      photo: "https://i.ibb.co/VDWDxgJ/c01d95cd-c94f-4ab1-87d0-235f55f8e56b.jpg",
    },
  ];

  return (
    <Swiper
      pagination={false}
      modules={[Pagination]}
      loop={true}
      className="mySwiper "
      autoplay={{
        delay: 8000,
        pauseOnMouseEnter: true,
        disableOnInteraction:false
      }}
    >
      {newsSlides.map((slide, index) => (
        <SwiperSlide key={index}>
          <a href="#" className="block w-full h-full relative ">
            <div className="border-[4px] line-frame">
            <img
              src={slide.photo}
              className="!object-fill"
              alt=""
            />

            </div>
            
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Slider;
