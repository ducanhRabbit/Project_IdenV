import { useRef } from "react";
import Slider from "./Slider";
import { motion, useScroll, useTransform } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Annoucement from "./Announcement";
function New() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });
  // Parallax Effect
  let y = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"]);
  return (
    <div>
      <div className="wrapper pb-[6rem] z-10 relative min-h-[650px] overflow-hidden">
        <motion.div
          style={{ y }}
          ref={ref}
          className="bg-black parallax absolute w-full -top-20 -bottom-10 h-[calc(100%+15rem)] -z-20"
        >
          <LazyLoadImage
            src="https://i.ibb.co/yRzM6yk/dbd-gallery-background.webp"
            className="opacity-40 object-cover w-full h-full"
            alt=""
          />
        </motion.div>
        {/* <div className="overlay w-full -z-10 absolute top-0 bottom-0 bg-gray-800/20"></div> */}
        <h2 className=" text-7xl py-12 text-center text-white font-witch ">
          News
        </h2>
        <div className="content max-w-[1200px] mx-auto flex flex-col md:flex-row ">
          <motion.div
            initial={{ x: -20 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-[60%] "
          >
            <div className="slider-container w-[85%] h-auto mx-auto ">
              <Slider />
            </div>
            <div className="relative mt-8 news-tabs w-[85%] px-2 pt-3 pb-8 mx-auto font-witch bg-[#0b0b0b]/60">
              <Annoucement/>
            </div>
          </motion.div>
          <div className="flex-1 relative">
            <motion.img
              initial={{ x: 30 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              src="https://i.ibb.co/Xt5ZvPN/Dream-Witch1.webp"
              alt=""
              className="absolute w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default New;
