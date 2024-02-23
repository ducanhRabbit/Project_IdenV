import { FormEventHandler, useEffect, useState } from "react";
import { BsSearch, BsChevronDown } from "react-icons/bs";
import { BiChevronsRight } from "react-icons/bi";

import { RiFolderUserFill } from "react-icons/ri";
import { MdSettings, MdLogout, MdLogin } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MdNotifications } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillHouseDoorFill } from "react-icons/bs";
import { TbMessageCircle } from "react-icons/tb";
import { MdCreate } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../css/ArtMuseum/GalleryHeader.css";
import { getAuth, signOut } from "firebase/auth";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UserSuggest from "./UserSuggest";
import InspirationSuggest from "./InspirationSuggest";
import MenuModal from "./MenuModal";
import http from "../../../axios/axios";
import BlackBackdrop from "../../shared/BlackBackDrop";
import { setCurrentUser } from "../../../redux/reducers/userReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import useDebounce from "../../../hook/useDebounce";
import useScreenSize from "../../../hook/useScreenSize";
import { NavMenu } from "../../../shared/types";

function GalleryHeader() {
  const auth = getAuth();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { currentUser } = useAppSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [suggestUser, setSuggestUser] = useState<any>();
  const [suggestInspiration, setSuggestInspiration] = useState<any>();
  const [activeSearchBox, setActiveSearchBox] = useState(false);
  const [activeMobileNav, setActiveMobileNav] = useState(false);
  const debounceValue = useDebounce(searchValue, 500);
  const { isMobile } = useScreenSize();
  const navigate = useNavigate()
  const searchHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };
  const handleLogout = () => {
    if (currentUser) {
      localStorage.removeItem("user");
      localStorage.removeItem("isSignedIn");
      http.post(`/user/logout/${currentUser.uid}`);
      signOut(auth).catch((err) => {
        console.log(err.message);
      });
      dispatch(setCurrentUser(null));
      navigate('/artMuseum')
    }
  };
  const menuList: NavMenu[] = [
    {
      tag: "Your account",
      subMenu: [
        {
          tag: "Profile",
          link: `/artMuseum/profile/${currentUser?._id}`,
        },
        {
          tag: "Edit",
          link: `/artMuseum/editProfile`,
        },
      ],
    },
    {
      tag: "More Options",
      subMenu: [
        {
          tag: "Settings",
        },
        {
          tag: "Your privacy rights",
        },
        {
          tag: "Get help",
        },
        !currentUser
          ? {
              tag: "Log in",
              link: "/auth",
            }
          : {
              tag: "Log out",
              action: () => {
                handleLogout();
              },
            },
      ],
    },
  ];

  useEffect(() => {
    setActiveMobileNav(false);
    setActiveSearchBox(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!debounceValue) setActiveSearchBox(false);
    const getData = async () => {
      try {
        if (!debounceValue) return;
        const res = await Promise.all([
          http.get(`/user/search?key=${debounceValue}`).then((data) => {
            setSuggestUser(data.data);
          }),
          http
            .get(`/inspiration/search?key=${debounceValue}`)
            .then((data) => {
              setSuggestInspiration(data.data);
            })
            .then(() => {
              setActiveSearchBox(true);
            }),
        ]);
        return res;
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [debounceValue]);
  const [parent] = useAutoAnimate();
  return (
    <>
      <header
        ref={parent}
        className={`w-full absolute md:fixed z-[100]  duration-300  p-4 ${
          activeMobileNav ? "bg-black" : "bg-black/70"
        }`}
      >
        <nav className="gap-4 flex justify-between items-center">
          <Link to={"/"} className="logo w-[150px] ">
            <img
              src="https://i.ibb.co/P6s1tJB/061502rd9416tmkjgu31mx.png"
              className="w-full object-cover"
              alt=""
            />
          </Link>
          <div className="flex gap-8">
            <Link
              to={"/artMuseum"}
              className={`md:block hidden text-white relative text-lg after:content-[''] ${
                location.pathname === "/artMuseum"
                  ? "after:block"
                  : "after:hidden"
              }  after:absolute after:w-full after:p-[2px] after:bg-[#cc0000] after:bottom-0 after:rounded-full`}
            >
              Home
            </Link>
            <Link
              to={"/artMuseum/createInspiration"}
              className={`md:block hidden text-white relative text-lg after:content-[''] ${
                location.pathname === "/artMuseum/createInspiration"
                  ? "after:block"
                  : "after:hidden"
              }  after:absolute after:w-full after:p-[2px] after:bg-[#cc0000] after:bottom-0 after:rounded-full`}
            >
              Create
            </Link>
          </div>
          <div className="search hidden md:block relative group/searchBox flex-1 max-w-[650px]">
            <form className="relative" onSubmit={searchHandler}>
              <input
                placeholder="Search..."
                className="w-full px-12 rounded-full outline-none py-2"
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
              <Link
                to={`/artMuseum/search?key=${debounceValue}`}
                className="text-[#111] cursor-pointer absolute py-2 px-4 top-1/2 -translate-y-1/2 left-0"
              >
                <BsSearch className="" size={20} />
              </Link>
            </form>
            {activeSearchBox && (
              <div className="absolute h-[80vh] hidden group-focus-within/searchBox:block mt-2 rounded-3xl w-full bg-white font-witch px-4 py-3 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
                <div className=" flex flex-col h-full gap-2 second-track">
                  <div className="flex-1 min-h-0 h-full overflow-auto ">
                    <div className="text-xl mb-1 pl-2">Users:</div>
                    {suggestUser?.length > 0 ? (
                      <UserSuggest suggestList={suggestUser} />
                    ) : (
                      <div className="pl-5 w-full mb-2 ">User not found!</div>
                    )}

                    <hr></hr>
                    <div className="text-xl  pl-2 mt-3 mb-1">Inspirations:</div>
                    {suggestInspiration?.length > 0 ? (
                      <InspirationSuggest suggestList={suggestInspiration} />
                    ) : (
                      <div className="pl-5 w-full mb-2 ">
                        Inspiration not found!
                      </div>
                    )}
                  </div>
                  {(suggestUser?.length > 0 ||
                    suggestInspiration?.length > 0) && (
                    <Link
                      to={`/artMuseum/search?key=${debounceValue}`}
                      className="py-2 text-center cursor-pointer hover:text-[#cc0000] duration-150"
                    >
                      View more results{" "}
                      <BiChevronsRight className="inline-block" size={20} />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="right">
            <div className="flex text-white items-center">
              <div className="notification hidden md:block">
                <div className="p-2">
                  <MdNotifications size={25} />
                </div>
              </div>
              <div className="message hidden md:block">
                <div className="p-2">
                  <TbMessageCircle size={25} />
                </div>
              </div>
              <Link
                to={`/artMuseum/profile/${currentUser?._id}`}
                className="user cursor-pointer px-2 flex items-center gap-2 justify-center"
              >
                <LazyLoadImage
                  className="w-[45px] h-[45px] block rounded-full light-border object-cover"
                  src={
                    currentUser
                      ? currentUser.photo
                      : "https://i.ibb.co/VTbTWLQ/Lucky-Valentine-DM2021.webp"
                  }
                  alt=""
                />
              </Link>
              {isMobile ? (
                <button onClick={() => setActiveMobileNav((prev) => !prev)}>
                  <GiHamburgerMenu size={20} />
                </button>
              ) : (
                <div className="option">
                  <MenuModal menuList={menuList}>
                    <div className="p-1">
                      <BsChevronDown size={15} />
                    </div>
                  </MenuModal>
                </div>
              )}
            </div>
          </div>
        </nav>
        {activeMobileNav && (
          <div className="font-witch text-white md:hidden p-2 pt-4">
            <div className="search relative rounded-full group/searchBox overflow-hidden">
              <form className="relative">
                <input
                  placeholder="Search..."
                  className="w-full px-16 rounded-full outline-none text-black py-2"
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
                <Link to={`/artMuseum/search?key=${debounceValue}`}>
                  <button className="text-[#111] h-full cursor-pointer absolute py-2 px-4 primary-btn rounded-none top-1/2 -translate-y-1/2 left-0">
                    <BsSearch className="" color="white" size={20} />
                  </button>
                </Link>
              </form>
            </div>
            <div className="mt-4">
              <Link
                to={"/artMuseum"}
                className={`flex relative gap-4 items-center p-2 py-3 after:content-['']  after:h-[60%] after:w-[4px] after:absolute after:right-0 after:bg-[#cc0000] overflow-hidden ${
                  location.pathname === "/artMuseum"
                    ? "after:block"
                    : "after:hidden"
                } before:block before:content-[''] before:absolute before:-bottom-[2px] before:h-[6px] before:w-[75%] before:left-1/2 before:-translate-x-1/2 before:bg-[url(./assets/img/news_line_5e945cc.webp)] `}
              >
                <BsFillHouseDoorFill size={24} />
                <span className="text-2xl">Home</span>
              </Link>
              <Link
                to={"/artMuseum/createInspiration"}
                className={`flex relative gap-4 items-center p-2 py-3 after:content-[''] after:h-[70%] after:w-[4px] after:absolute after:right-0 after:bg-[#cc0000] overflow-hidden ${
                  location.pathname === "/artMuseum/createInspiration"
                    ? "after:block"
                    : "after:hidden"
                } before:block before:content-[''] before:absolute before:-bottom-[2px] before:h-[6px] before:w-[75%] before:left-1/2 before:-translate-x-1/2 before:bg-[url(./assets/img/news_line_5e945cc.webp)]`}
              >
                <MdCreate size={24} />
                <span className="text-2xl">Create</span>
              </Link>
              <Link
                to={`/artMuseum/profile/${currentUser?._id}/created`}
                className={`flex relative gap-4 items-center p-2 py-3 after:content-[''] after:h-[70%] after:w-[4px] after:absolute after:right-0 after:bg-[#cc0000] overflow-hidden ${
                  location.pathname === "/artMuseum/profile"
                    ? "after:block"
                    : "after:hidden"
                } before:block before:content-[''] before:absolute before:-bottom-[2px] before:h-[6px] before:w-[75%] before:left-1/2 before:-translate-x-1/2 before:bg-[url(./assets/img/news_line_5e945cc.webp)]`}
              >
                <RiFolderUserFill size={24} />
                <span className="text-2xl">Profile</span>
              </Link>
              <Link
                to={"/artMuseum"}
                className={`flex relative gap-4 items-center p-2 py-3 after:content-[''] after:h-[70%] after:w-[4px] after:absolute after:right-0 after:bg-[#cc0000] overflow-hidden ${
                  location.pathname === "/artMuseum/setting"
                    ? "after:block"
                    : "after:hidden"
                } before:block before:content-[''] before:absolute before:-bottom-[2px] before:h-[6px] before:w-[75%] before:left-1/2 before:-translate-x-1/2 before:bg-[url(./assets/img/news_line_5e945cc.webp)]`}
              >
                <MdSettings size={24} />
                <span className="text-2xl">Setting</span>
              </Link>
              {localStorage.getItem("user") ? (
                <button
                  onClick={handleLogout}
                  className="flex gap-4 items-center p-2 py-3"
                >
                  <MdLogout size={24} />
                  <span className="text-2xl">Log out</span>
                </button>
              ) : (
                <Link to={"/auth"} className="flex gap-4 items-center p-2 py-3">
                  <MdLogin size={24} />
                  <span className="text-2xl">Log in</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      {activeMobileNav && isMobile && (
        <BlackBackdrop
          onCloseBlackBackdrop={() => {
            setActiveMobileNav(false);
          }}
        ></BlackBackdrop>
      )}
    </>
  );
}

export default GalleryHeader;
