import { Link } from "react-router-dom";

function Others() {
  return (
    <>
      <div className="others-background pt-8 relative bg-center w-full h-[550px] bg-[url('https://i.ibb.co/yBmgyZC/golden-cave.jpg')] object-cover">
        <div className="fadeToBottom w-full h-full absolute top-0"></div>
        <div className="max-w-[1200px] h-full mx-auto relative">
          <h3 className="text-white font-witch text-4xl md:text-5xl lg:text-7xl p-7 sm:pl-7 md:pl-12 opacity-90 sm:block">Others</h3>
          <div className="absolute w-[150px] sm:w-auto top-[50%] translate-y-[-50%] left-2 sm:left-12 cursor-pointer">
            <img
              className="animate-floating  "
              src="https://i.ibb.co/hyTcMLj/btn-gs-6c61879.webp"
              alt=""
            />
          </div>
          <div className="w-[120px] sm:w-auto absolute translate-x-[50%] right-[50%] top-9 cursor-pointer">
            <img
              className="animate-floating delay-2"
              src="https://i.ibb.co/7pNtTnV/btn-zb-1793626.webp"
              alt=""
            />
          </div>
          <Link to={"/artMuseum"} className="w-[150px] sm:w-auto absolute right-3 sm:right-8 sm:scale-[0.8] top-[50%] translate-y-[-50%] cursor-pointer">
            <img
              className="animate-floating delay-1"
              src="https://i.ibb.co/hWKc2mJ/btn-st-4891c34.webp"
              alt=""
            />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Others;
