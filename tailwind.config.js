/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors:{
      white: '#c3cfd8'
    },
    fontFamily: {
      witch: ["Witch-Party"],
    },
    extend: {
      backgroundPosition: {
        gallery70: "70%",
        gallery45: "45%",
        galleryTopCent: "50% 0",
      },
      gridTemplateColumns: {
        236: "repeat(auto-fill,minmax(236px,1fr))",
      },
      gridAutoRows: {
        10: "10px",
      },
      gridRowEnd: {
        small: "span 26",
      },
      keyframes: {
        bouncing: {
          "0%,100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(-15px)", opacity: "0.2" },
        },
        floating: {
          "0%,100%": { transform: "translateY(0)", scale: "1", opacity: "1" },
          "50%": {
            transform: "translateY(-20px)",
            scale: "0.9",
            opacity: "0.9",
          },
        },
        heartBeat: {
          "0%": { scale: "1", opacity: "1" },
          "100%": { scale: "1.5", opacity: "0" },
        },
      },
      animation: {
        hitHeart: "heartBeat 0.3s linear",
        bounceLoop: "bouncing 2s infinite ease-in-out",
        floating: "floating 5s infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};


