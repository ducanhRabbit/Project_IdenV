import { ToastContainer } from "react-toastify";
import MasonryGallery from "../components/ArtMuseum/MasonryGallery";

function HomeGallery() {
  
  return (
    <div className="bg-black">
      <ToastContainer></ToastContainer>
      <div className='gallery-bg w-full h-screen bg-[url("https://i.ibb.co/hW7HvgL/2233514.jpg")] bg-gallery70 sm:bg-gallery45 lg:bg-galleryTopCent bg-cover'>
        <div className="relative overlay fadeToBottom w-full h-screen"></div>
      </div>
      <div className="bg-black py-4">
        <h3 className="text-5xl text-center  text-white">
          Art Museum ID<span className="text-primary">V</span>
        </h3>
      </div>
      <MasonryGallery/>
    </div>
  );
}

export default HomeGallery;
