const animationEffect = {
  initMotion: {
    initial: "hidden",
    whileInView: "visible",
    viewport: {once:true}
  },
  fadeEffect: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeX20: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
};

export default animationEffect;
