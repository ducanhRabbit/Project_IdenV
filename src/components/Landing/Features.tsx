import { useEffect, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

import "./Swiper.css";

import { Navigation, Controller, EffectFade } from "swiper/modules";
import useScreenSize from "../../hook/useScreenSize";
import animationEffect from "../../shared/animationEffect";
import { motion } from "framer-motion";
import { Swiper as SwiperType } from "swiper/types";

export default function Features() {
  const { initMotion, fadeX20 } = animationEffect;
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>();
  const [showsSwiper, setShowsSwiper] = useState<SwiperType>();
  const { screenWidth, isMobile } = useScreenSize();
  const isTablet = screenWidth <= 1023;
  const slideArray = [
    {
      id: 1,
      image: "https://i.ibb.co/2yF3yqN/2bco293cqh881.webp",
      content: "Unpredictable multiplayer action",
    },
    {
      id: 2,
      image: "https://i.ibb.co/wStsrRG/jZAKMr1.jpg",
      content: "Survival is better together",
    },
    {
      id: 3,
      image: "https://i.ibb.co/Zccysds/1910287.jpg",
      content: "The thrill of the hunt",
    },
    {
      id: 4,
      image: "https://i.ibb.co/CHtBzDp/Essence-2nd-Anny.webp",
      content: "Play hunter or survival",
    },
    {
      id: 5,
      image: "https://i.ibb.co/zPtbyvL/e7cvfy9f2vu41.jpg",
      content: "Rewarding Progression",
    },
  ];
  useEffect(() => {});
  return (
    <div className="pb-20 pt-12 font-witch bg-[url('https://i.ibb.co/xSSZYSL/jie-he-33.jpg')] relative overflow-hidden bg-cover bg-left-top before:content-[''] before:absolute before:w-full before:top-0 before:bottom-0 before:bg-gray-800/60">
      <div className=" feature-container text-white px-8 w-full lg:w-11/12 2xl:w-[1200px] mx-auto relative">
        <div className="feature-syncing-slide flex flex-col w-full">
          <h3 className="py-12 text-4xl  lg:text-7xl font-witch">
            Game Features
          </h3>
          <div className="gallery w-full flex flex-col lg:flex-row">
            <motion.div
              {...initMotion}
              variants={fadeX20}
              transition={{ duration: 0.5 }}
              className="show-wrap relative w-full lg:w-[60%] xl:w-[68%] after:content-[''] after:absolute after:top-[-4px] after:left-[-4px] after:w-[150px] after:h-[150px] after:bg-primary before:content-[''] before:absolute before:bottom-[-4px] before:right-[-4px] before:w-[150px] before:h-[150px] before:bg-primary"
            >
              <Swiper
                grabCursor={true}
                spaceBetween={10}
                navigation={false}
                modules={[Navigation, Controller, EffectFade]}
                effect="fade"
                className="showSlider "
                slidesPerView={1}
                centeredSlides={true}
                slideToClickedSlide={true}
                controller={{
                  control: thumbsSwiper,
                }}
                onSwiper={setShowsSwiper}
              >
                {slideArray.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-[250px] md:h-[450px] lg:h-full">
                      <img
                        className="w-full h-full object-cover"
                        src={slide.image}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
            {/* PC screen */}
            <div className="thumb-wrap lg:pl-8 w-full mt-8 lg:-mt-40 lg:w-[400px] flex lg:relative">
              <div className="slide-navigation w-full  h-full lg:absolute">
                <motion.div
                  {...initMotion}
                  variants={fadeX20}
                  transition={{ duration: 0.5 }}
                  className="nav-slide-wrap w-full h-full flex items-center "
                >
                  <Swiper
                    autoHeight={true}
                    spaceBetween={0}
                    slidesPerView={isMobile ? 3 : 5}
                    modules={[Navigation, Controller]}
                    direction={isTablet ? "horizontal" : "vertical"}
                    className="thumbSlider flex flex-col w-full !h-full pb-8 lg:!h-[85%]"
                    centeredSlides={true}
                    slideToClickedSlide={true}
                    controller={{
                      control: showsSwiper,
                    }}
                    onSwiper={setThumbsSwiper}
                  >
                    {slideArray.map((slide, index) => (
                      <SwiperSlide key={index}>
                        <div className="gallery-tab py-[15px] w-full flex justify-end  items-center">
                          <div className="w-full h-full flex flex-col-reverse lg:flex-row items-center justify-center relative  ">
                            <div className="tab-text h-[50px] lg:h-full opacity-0 w-0  lg:right-0 p-3 flex-col lg:flex-row lg:bottom-0 bottom-[-10px] justify-center lg:justify-start flex ease-in-out duration-300 items-center bg-primary mt-[2px] lg:mt-0">
                              <span className="lg:w-[150px] w-full text-center  leading-tight lg:text-left">
                                {slide.content}
                              </span>
                            </div>
                            <div className="tab-img w-32 lg:absolute right-12 flex items-center">
                              <div className="h-[110px] w-full relative nav-img duration-300 before:content-[''] before:absolute before:top-[-4px] before:left-[-4px] before:h-[calc(100%_+_8px)] before:w-0 before:bg-primary after:content-[''] after:absolute after:top-[-4px] after:right-[-4px] after:h-[calc(100%_+_8px)] after:w-0 after:-z-10 after:bg-primary">
                                <img
                                  src={slide.image}
                                  className="block w-full h-full object-cover absolute   "
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
