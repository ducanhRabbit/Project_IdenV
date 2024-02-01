/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // colors: {
    //   white: "#c3cfd8",
    // },
    fontFamily: {
      witch: ["Griffy"],
      inter: ["Inter"]
    },
    extend: {
      colors:{
        "primary":"#cc0000",
        "primary-darken":"#ac0000",
        "primary-lighten":"#e60000",
        "marine": "#4290c3",
        "grey-100":"#ebebeb",
        "grey-200": "#bcbcbc",
        "grey-300": "#a3a3a3",

        "dark":"#333333",
        
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

};
