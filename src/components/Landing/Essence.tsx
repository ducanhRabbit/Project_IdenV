import { LazyLoadImage } from "react-lazy-load-image-component";
import animationEffect from "../../shared/animationEffect";
import { motion } from "framer-motion";
function Essence() {
  const { initMotion, fadeEffect } = animationEffect;
  return (
    <div className="essence-container text-white flex flex-col lg:flex-row font-witch overflow-hidden">
      <motion.div
        {...initMotion}
        variants={fadeEffect}
        transition={{ duration: 0.3 }}
        className="lg:w-1/2 w-full poster relative before:content-[''] before:absolute before:w-[600px] before:h-[4px] before:bg-[url('https://i.ibb.co/PczTDMk/news-line-5e945cc.webp')] before:top-1/2 before:-right-[1px] before:translate-x-1/2 before:rotate-90  before:z-50"
      >
        <LazyLoadImage
          src="https://i.ibb.co/w4WY3QF/Essence-ss22.webp"
          className="w-full object-cover bg-right h-full"
          alt="Bai ze"
        />
      </motion.div>
      <div className="lg:w-1/2 w-full backstory flex flex-col p-10 md:p-16  bg-black/40">
        <motion.div
          {...initMotion}
          variants={fadeEffect}
          transition={{ duration: 0.3 }}
          className="backstory-content"
        >
          <h3 className="text-white text-[2.5rem] tracking-[0.15em] ">
            LATEST RELEASE
          </h3>
          <h2 className="text-xl my-4  tracking-[0.15em] relative before:content-[''] before:parallelogram before:absolute before:bottom-[-0.1rem] before:left-[-0.3rem] before:w-[110px] before:h-[0.3rem] before:bg-[#cc0000] ">
            ESSENCE 21: BAI ZE
          </h2>
          <p className="background-story text-xl leading-7 tracking-wide line-clamp-6">
            After the war swallowed up the last piece of homeland, the defeated
            monarch had no choice but to embark on a journey of escape. In the
            aimless escape is about to exhaust his last flame, a strange coastal
            town appeared in front of him: flowers, wine, warm inhabitants and
            female city lord... maybe this is his dream of a calm and peaceful
            utopia. However, the curse often reveals itself after sunset. Even
            the God who sits in the Colosseum never refuses unexpected prey. He
            has finally discovered that no one can leave this never-ending
            feast. The broken soul will eventually rekindle the desire to win
            under her salvation - he will become her warrior, and will become
            her trapped beast alone.
          </p>
        </motion.div>
        <motion.div
          {...initMotion}
          variants={fadeEffect}
          transition={{ duration: 0.3 }}
          className="learn-more mt-8"
        >
          <button className="py-4 px-8 font-semibold tracking-[0.15em]  text-xl border-primary border-2 hover:bg-primary-darken ease-in-out duration-500">
            LEARN MORE
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Essence;
