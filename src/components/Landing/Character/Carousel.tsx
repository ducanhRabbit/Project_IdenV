import React, { useEffect, useRef, useState } from "react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { useDispatch } from "react-redux";
import { getCharInfo } from "../../../redux/reducers/charInfoReducer";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useAppSelector } from "../../../redux/hook";
import useScreenSize from "../../../hook/useScreenSize";
import { Character } from "../../../shared/types";
import { Swiper as SwiperType } from "swiper/types";

interface CarouselProps {
  data: Character[]|undefined;
  currentRole: string
  setCurrentActive: React.Dispatch<React.SetStateAction<number>>
}

function Carousel({ data, currentRole,setCurrentActive}: CarouselProps) {
  const [carouselSwiper,setCarouselSwiper] = useState<SwiperType|null>(null)
  const { currentChar } = useAppSelector((state) => state.charInfo);
  const arrowRef = useRef(null);
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();

  // useEffect(() => {
  //   if(arrowRef.current){
  //     arrowRef.current.swiper.slideTo(0);
  //   }
  // }, [charType]);
  
  useEffect(()=>{
    if(carouselSwiper){
      carouselSwiper.slideTo(0)
    }
  },[currentRole])
  return (
    <div className="carousel-container min-h-[100px] relative">
      <Swiper
      onSwiper={setCarouselSwiper}
        ref={arrowRef}
        initialSlide={0}
        loop={false}
        spaceBetween={10}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
        modules={[Navigation, Controller]}
        className="mySwiper2 "
        slidesPerView={isMobile ? 4 : 5}
        slidesPerGroup={isMobile ? 4 : 5}
        slideToClickedSlide={true}
      >
        {data?.map((char, index) => (
          <SwiperSlide  key={index}>
              <div
              key={index}
              className={`cursor-pointer`}
              onClick={() => {
                dispatch(getCharInfo(char));
                setCurrentActive(index)
              }}
            >
              <div
                className={
                  `${char === currentChar? currentRole === 'survival'?'!bg-[url("https://i.ibb.co/QjBmNwB/head-Img-bg-h2-51e8ff2.webp")]':'!bg-[url("https://i.ibb.co/g3SKLNh/head-Img-bg-h-a705533.webp")]' :'bg-[url("https://i.ibb.co/F35TjBx/head-Img-bg-edf860a.webp")]'} mx-auto  p-[3px] bg-no-repeat bg-center w-[70px] min-h-[64px] ease-in-out duration-500`
                }
              >
                <img className=" mx-auto w-full " src={char.portrait} alt="" />
              </div>
              <p className="text-center text-xs mt-1 overflow-hidden text-ellipsis max-w-[70px] mx-auto">
                {char.career}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="next-btn z-50 hidden md:block absolute top-1/2 translate-y-[-60%] right-[-40px] cursor-pointer">
        <img src="https://i.ibb.co/sCfjYTr/Next-no-Circle.png" alt="" />
      </div>
      <div className="prev-btn hidden md:block absolute top-1/2 translate-y-[-60%] left-[-40px] cursor-pointer">
        <img src="https://i.ibb.co/JCDnkM8/Prev-no-Circle.png" alt="" />
      </div>
    </div>
  );
}

export default Carousel;
