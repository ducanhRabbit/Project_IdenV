import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import http from "../axios/axios";
import { setCurrentUser } from "../redux/reducers/userReducer";

import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/hook";
import GalleryHeader from "../components/ArtMuseum/Header/HomeHeader";

function ArtMuseum() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const fetchUser = async (uid:string) => {
      try {
        const userdata = await http.get(`/user/${uid}`);
          dispatch(setCurrentUser(userdata.data));
      } catch (err) {
        if(localStorage.getItem('user')){
          dispatch(setCurrentUser(null));
          toast.error("Yours session is expired")
          localStorage.removeItem("user")
          setTimeout(()=>{
            navigate("/auth")
          },1000)
        }
      }
    };
    if (storedUser) {
      const loggedUser = JSON.parse(storedUser)
      fetchUser(loggedUser.uid);
    }
  }, [dispatch,window.location]);
  return (
    <div className="font-witch">
      <GalleryHeader />
      <Outlet />
    </div>
  );
}

export default ArtMuseum;
