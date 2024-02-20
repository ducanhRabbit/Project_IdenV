import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaDiscord } from "react-icons/fa";
import { AiFillYoutube, AiOutlineTwitter } from "react-icons/ai";
import { HiGlobeAlt } from "react-icons/hi";
import { FiInstagram } from "react-icons/fi";
import { BsFacebook } from "react-icons/bs";
import { BiCopyright } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import Language from "../components/Landing/Language";
import New from "../components/Landing/New/New";
import Essence from "../components/Landing/Essence";
import Character from "../components/Landing/Character/Character";
import Others from "../components/Landing/Others";
import Sidebar from "../components/Landing/Sidebar";
import animationEffect from "../shared/animationEffect";
import useScreenSize from "../hook/useScreenSize";
import { Link, useLocation } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import BlackBackdrop from "../components/shared/BlackBackDrop";
import Features from "../components/Landing/Features";

function Landing() {
  const { fadeEffect, initMotion, fadeX20 } = animationEffect;
  const { screenHeight } = useScreenSize();
  const horizontalReccomended = screenHeight <= 500;
  const location = useLocation()
  let [sidebarOpen, setSidebarOpen] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflowY = horizontalReccomended ? "hidden" : "auto";
  }, [screenHeight]);

  useEffect(()=>{
    window.scrollTo({
      top:0,
      behavior:"smooth"
    })
  },[location.pathname])

  const navList = [
    {
      tag: "Home",
      link: "/",
    },
    {
      tag: "News",
      link: "/",
    },
    {
      tag: "Characters",
      link: "/",
    },
    {
      tag: "Features",
      link: "/",
    },
    {
      tag: "Art Museum",
      link: "/artMuseum",
    },
  ];

  return (
    <>
      {horizontalReccomended && (
        <div className="direction-reccomended w-screen h-screen flex justify-center items-center fixed z-50 text-white text-3xl scroll overflow-hidden font-witch bg-black/60">
          Browse horizontally is reccomended
        </div>
      )}
      <div className="background bg-[url('https://i.ibb.co/qpLf4MG/bg5-c6fded1.jpg')] relative z-10 bg-fixed bg-[left_5%_top_20%] w-full ">
        <section className="banner font-witch relative before:content-[''] before:absolute before:w-full before:h-[4px] before:bg-[url('https://i.ibb.co/PczTDMk/news-line-5e945cc.webp')] before:bottom-0 before:z-20">
          <div className="md:aspect-video min-h-[600px] bg-black/60 w-full overflow-hidden h-screen ">
            <div className="flex items-center justify-between top-bar w-full absolute  text-white h-20 text-xl">
              <div className="relative logo inline-block  w-[130px] md:w-[180px] mt-3 ml-5">
                <motion.a
                  {...initMotion}
                  variants={fadeEffect}
                  href="#"
                  className=" inline-block "
                >
                  <LazyLoadImage
                    src="https://i.ibb.co/P6s1tJB/061502rd9416tmkjgu31mx.png"
                    alt=""
                    className=""
                  />
                </motion.a>
              </div>
              <div className="navigation relative hidden lg:block">
                <ul className="flex justify-around">
                  {navList.map((item, index) => {
                    return (
                      <motion.li
                        {...initMotion}
                        transition={{
                          duration: 0.3,
                          delay: 0.08 * index,
                          ease: "easeInOut",
                        }}
                        viewport={{ once: true }}
                        variants={{
                          hidden: { x: -20, opacity: 0 },
                          visible: { x: 0, opacity: 1 },
                        }}
                        key={index}
                        className={`${
                          index === navList.length - 1 ? "mr-0" : "mr-8"
                        } relative before:content-[''] before:absolute before:w-0 before:h-[4px] before:bg-primary before:-bottom-1 before:rounded-full hover:before:w-full before:duration-300`}
                      >
                        <Link to={item.link}>{item.tag}</Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
              <div className="coa hidden lg:block">
                <motion.div
                  {...initMotion}
                  variants={fadeX20}
                  transition={{ delay: 0.08 * navList.length, duration: 0.3 }}
                  className="social-media flex items-center"
                >
                  <a href="#" className="">
                    <FaFacebookF className="hover:text-primary" />
                  </a>
                  <a href="#" className="mx-6 hover:text-primary">
                    <AiFillYoutube />
                  </a>
                  <a href="#">
                    <AiOutlineTwitter className="hover:text-primary" />
                  </a>
                  <div className="language ml-3 mr-5">
                    <HiGlobeAlt className="inline-block mr-1" />
                    <Language />
                  </div>
                </motion.div>
              </div>
              {/* Mobile Navbar */}
              <div
                className="burger-menu lg:hidden mr-6"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <GiHamburgerMenu size={25} />
              </div>
            </div>
            <video
              className="w-screen  object-cover absolute md:aspect-video -z-10 block h-full"
              src="./src/assets/video/IdentityV - New Storyline.mp4"
              autoPlay
              muted
              loop
            ></video>
            <div className="content  text-white flex w-full h-full justify-center items-center">
              <div className="relative -top-2 text-center text-white -mt-5">
                <motion.h3
                  {...initMotion}
                  variants={fadeEffect}
                  transition={{ duration: 0.3 }}
                  className="text-center text-[2em] md:text-[4rem] cursor-default"
                >
                  ~ Dear detective ~
                </motion.h3>
                <motion.p
                  {...initMotion}
                  variants={fadeEffect}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="text-center text-[1.6em] md:text-[3em] cursor-default"
                >
                  ~ Welcome back to the manor ~
                </motion.p>
                <motion.div
                  {...initMotion}
                  variants={fadeEffect}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="mt-4 lg:mt-6 inline-block w-[50px] md:w-auto"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <img
                    src="https://i.ibb.co/XtP4bVG/play.webp"
                    alt=""
                    className="cursor-pointer"
                  />
                </motion.div>
                <motion.button
                  {...initMotion}
                  variants={fadeEffect}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="block mt-4 lg:mt-6 py-2 px-6 w-1/2 lg:w-1/3 text-[1.2em] lg:text-[1.5em] mx-auto rounded primary-btn cursor-pointer"
                >
                  Play now
                </motion.button>
                {isOpen && (
                  <>
                    <BlackBackdrop
                      className="a"
                      onCloseBlackBackdrop={() => {
                        setIsOpen(false);
                      }}
                    >
                      <video
                        className=" absolute w-full md:w-[70%] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2  aspect-video z-50 block"
                        src="../src/assets/video/IdentityV - New Storyline.mp4"
                        controls
                      ></video>
                    </BlackBackdrop>
                  </>
                )}
              </div>
            </div>
            <div className="absolute bottom-3 right-1/2 animate-bounceLoop">
              <img
                src="https://i.ibb.co/sCfjYTr/Next-no-Circle.png"
                alt=""
                className="rotate-90 translate-x-1/2  scale-50"
              />
            </div>
          </div>
          <div className="absolute z-[99999]">
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
        </section>
        <section className="overflow-hidden relative before:content-[''] before:absolute before:w-full before:h-[4px] before:bg-[url('https://i.ibb.co/PczTDMk/news-line-5e945cc.webp')] before:bottom-0 before:z-50">
          <New />
        </section>
        <section className="essence relative before:content-[''] before:absolute before:w-full before:h-[4px] before:bg-[url('https://i.ibb.co/PczTDMk/news-line-5e945cc.webp')] before:bottom-0 before:z-20">
          <Essence />
        </section>
        <section className="character relative before:content-[''] before:absolute before:w-full before:h-[4px] before:bg-[url('https://i.ibb.co/PczTDMk/news-line-5e945cc.webp')] before:bottom-0">
          <Character />
        </section>
        <section className="feature relative before:content-[''] before:absolute before:w-full before:h-[4px] before:bg-[url('https://i.ibb.co/PczTDMk/news-line-5e945cc.webp')] before:bottom-0 before:z-50">
          <Features />
        </section>
        <section className="others relative before:content-[''] before:absolute before:w-full before:h-[4px] before:bg-[url('https://i.ibb.co/PczTDMk/news-line-5e945cc.webp')] before:bottom-0">
          <Others />
        </section>
        <footer className=" bg-black ">
          <div className="community w-full mx-auto max-w-[1200px] text-white font-witch">
            <div className="flex flex-col justify-center items-center p-10 md:p-20">
              <div className="footer-title text-4xl text-center capitalize mb-4">
                Join The Identity{" "}
                <span className="text-primary font-bold">V</span> community
              </div>
              <div className="icon-list flex flex-wrap w-full md:w-4/6 gap-8 justify-center items-center mb-8">
                <a href="#" className="btn-community hover:bg-primary-darken">
                  <AiFillYoutube />
                </a>
                <a href="#" className="btn-community hover:bg-primary-darken">
                  <BsFacebook />
                </a>
                <a href="#" className="btn-community hover:bg-primary-darken">
                  <FaTwitter />
                </a>
                <a href="#" className="btn-community hover:bg-primary-darken">
                  <FaDiscord />
                </a>
                <a href="#" className="btn-community hover:bg-primary-darken">
                  <FiInstagram />
                </a>
              </div>
              <div className="footer-logo w-3/4 flex justify-center items-center mb-8">
                <div>
                  <img
                    src="https://i.ibb.co/XVxXb7m/NetEase.png"
                    className="scale-90 mr-4 h-full w-full"
                    alt=""
                  />
                </div>
                <div>
                  <img
                    src="https://i.ibb.co/0hcFDKX/Joker-Studio.png"
                    className="object-contain h-full w-full ml-4 scale-90"
                    alt=""
                  />
                </div>
              </div>
              <div className="copyright text-xs md:text-base text-center">
                <BiCopyright className="inline-block" />
                Joker Studio <BiCopyright className="inline-block" />
                2020 NetEaseInc. All Rights Reserved
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Landing;
