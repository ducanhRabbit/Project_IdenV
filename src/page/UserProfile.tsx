import { useState, Fragment, useEffect } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../axios/axios";
import useOpenModal from "../hook/useOpenModal";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { MdClose } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import BlackBackdrop from "../components/shared/BlackBackDrop";
import { useAppSelector } from "../redux/hook";
import CreatedTab from "../components/ArtMuseum/UserProfile/CreatedTab";
import SavedTab from "../components/ArtMuseum/UserProfile/SavedTab";
import ReadMoreBtn from "../components/shared/ReadMoreBtn";
import Following from "../components/ArtMuseum/UserProfile/Following";
import { User } from "../shared/types";
import { AxiosResponse } from "axios";
function UserProfile() {
  const { id } = useParams();
  const pathName = useLocation();
  const [activeTabs, setActiveTabs] = useState<string | null>(
    localStorage.getItem("currentTab") || "created"
  );
  const [activeReadmore, setActiveReadmore] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [config, setConfig] = useState({});
  const { currentUser } = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();
  const { data: userInfoData } = useQuery({
    queryKey: ["userInfo", id],
    queryFn: ():Promise<AxiosResponse<User>> => {
      const res = http.get(`/user/info/${id}`);
      return res
    },
    refetchOnWindowFocus: false,
  });
  const followMutation = useMutation({
    mutationKey: ["followUser"],
    mutationFn: async (idUser:string) => {
      const res = await http.post(`/user/follow/${idUser}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });
  const isFollowing = userInfoData?.data.followers.some(
    (item) => item._id === currentUser?._id
  );
  useEffect(() => {
    if (localStorage.getItem("currentTab")) {
      setActiveTabs(localStorage.getItem("currentTab"));
    }
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathName.pathname, pathName.search, activeTabs]);

  useEffect(() => {
    const sortByPopularity = searchParams.get("sortBy") || "popular";
    const changeConfig = (key:string, value:string) => {
      setConfig((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
    changeConfig("sortBy", sortByPopularity);
  }, [window.location.search]);
  console.log("rerender");
  const isOwner = currentUser?._id === userInfoData?.data._id;
  const { isOpen, openModal, closeModal } = useOpenModal();
  const OwnersBtns = () => {
    return (
      <div className="flex justify-center gap-3">
        <button className="py-3 px-4 bg-[#cc0000] rounded-[12px]">
          <FaShareAlt className="text-white" />
        </button>
        <Link
          to={"../editProfile"}
          className="py-3 px-4 bg-[#ebebeb] rounded-[12px]"
        >
          Edit Profile
        </Link>
      </div>
    );
  };
  const GuestBtns = () => {
    return (
      <div className="flec justify-center gap-3">
        <button className="py-3 px-4 mr-4 bg-[#ebebeb] rounded-[12px]">
          Message
        </button>
        {isFollowing ? (
          <button
            onClick={() => {
              if(userInfoData){
                followMutation.mutate(userInfoData?.data._id);
              }
            }}
            className={"primary-btn px-4 py-3 bg-[#111111] hover:bg-[#111111]"}
          >
            Following
          </button>
        ) : (
          <button
            onClick={() => {
              if(userInfoData){
                followMutation.mutateAsync(userInfoData?.data._id).then(() => {
                  toast(
                    <div className="flex items-center font-witch gap-2">
                      <img
                        className="w-[50px] h-[50px] rounded-lg"
                        src={userInfoData?.data.photo}
                        alt=""
                      />
                      <div className="flex-1 text-center text-lg">Following!</div>
                    </div>,
                    {
                      position: "bottom-center",
                      theme: "light",
                      autoClose: 3000,
                      closeButton: false,
                    }
                  );
                });
              }
            }}
            className={"primary-btn px-4 py-3"}
          >
            Follow
          </button>
        )}
      </div>
    );
  };
  console.log(userInfoData?.data.photo);
  return (
    <>
      <ToastContainer />
      {activeReadmore && (
        <>
          <BlackBackdrop
            className={"z-[110]"}
            onCloseBlackBackdrop={() => {
              setActiveReadmore(false);
            }}
          />
          <div className="fixed z-[110] font-witch top-1/2 w-[calc(100%-16px)] -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white md:w-[50vw] md:h-[60vh] rounded-2xl">
            <div className="flex flex-col h-full">
              <div className="header relative text-4xl p-8 shrink-0 shadow-[0px_2px_8px__rgba(0,0,0,0.12)]">
                About {userInfoData?.data.userName}
                <div className="controller absolute top-1 right-1 md:right-8 md:top-4">
                  <button
                    onClick={() => {
                      setActiveReadmore(false);
                    }}
                    className="close-btn p-1 rounded-full hover:bg-black/[0.06]"
                  >
                    <MdClose size={30} />
                  </button>
                </div>
              </div>
              <div className="content flex-1 overflow-y-auto min-w-0 min-h-0 h-full">
                <div className="mx-4 h-[400px]">
                  <div className="flex items-center gap-8 my-4">
                    <FaUser size={20} />
                    <span>
                      {userInfoData?.data.following.length} followings
                    </span>
                  </div>
                  <div className="break-all text-lg">
                    {userInfoData?.data.story}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="bg-black w-full min-h-screen font-witch pt-[80px] px-2">
        <div className="userInfo-container w-full flex h-full justify-center items-center pt-[100px] mb-12">
          <div className="user-wrapper max-w-[448px] bg-white w-full rounded-[32px]">
            <div className=" relative">
              <div className="avatar absolute top-0 -translate-y-2/3 left-1/2 -translate-x-1/2 ">
                <div className="rounded-full w-[120px] h-[120px] overflow-hidden border-[4px] border-white bg-white">
                  <LazyLoadImage
                    className="w-full h-full object-cover"
                    src={
                      userInfoData?.data.photo ||
                      "https://i.pinimg.com/564x/1c/76/01/1c760197e36e22dc7b3f7a211709a0af.jpg"
                    }
                    alt=""
                    effect="blur"
                    wrapperClassName="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center pt-12 pb-6">
                <div className="fullName text-4xl my-2">
                  {userInfoData?.data.userName}
                </div>
                <div className="email text-xl text-[#5f5f5f]">
                  {userInfoData?.data.email}
                </div>
                <div className="text-center px-4 py-2">
                  <ReadMoreBtn
                    limitedLetter={140}
                    setActiveReadmore={setActiveReadmore}
                  >
                    {userInfoData?.data.story || ""}
                  </ReadMoreBtn>
                </div>
                {/* <div className="quote px-4 my-3 text-center break-all line-clamp-3">{userInfoData?.data.story.length}</div> */}
                <div
                  onClick={() => {
                    if (userInfoData?.data && userInfoData?.data.following.length > 0) {
                      openModal();
                    }
                  }}
                  className="followers text-lg cursor-pointer hover:underline"
                >
                  {userInfoData?.data.following.length} Following
                </div>
                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => {
                      queryClient.invalidateQueries({queryKey: ["userInfo"]});
                      closeModal();
                    }}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed w-full inset-0 ">
                      <div className="flex min-h-full items-center justify-center text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className=" font-witch mx-2 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                              as="h3"
                              className="text-3xl text-center p-4 font-medium leading-6 text-gray-900"
                            >
                              Following
                            </Dialog.Title>
                            <div className="max-h-[300px] overflow-y-auto">
                              {userInfoData?.data.following.map(
                                (item, index) => (
                                  <Following
                                    userData={item}
                                    key={index}
                                    isOwner={isOwner}
                                  />
                                )
                              )}
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
                <div className="options my-2">
                  {userInfoData?.data._id === currentUser?._id ? (
                    <OwnersBtns></OwnersBtns>
                  ) : (
                    <GuestBtns></GuestBtns>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white pb-8">
          <div className="flex gap-6 justify-center mb-2">
            <button
              onClick={() => {
                setActiveTabs("created");
                localStorage.setItem("currentTab", "created");
                setSearchParams({});
              }}
              className={
                'text-[22px] p-2 relative after:content-[""] after:absolute after:w-[50%] after:h-[3px] after:bg-[#cc0000] after:bottom-0 after:left-1/2 after:-translate-x-1/2 ' +
                (activeTabs === "created" ? "after:block" : "after:hidden")
              }
            >
              Created
            </button>

            <button
              onClick={() => {
                setActiveTabs("saved");
                localStorage.setItem("currentTab", "saved");
                setSearchParams({});
              }}
              className={
                'text-[22px] p-2 relative after:content-[""] after:absolute after:w-[50%] after:h-[3px] after:bg-[#cc0000] after:bottom-0 after:left-1/2 after:-translate-x-1/2 ' +
                (activeTabs === "saved" ? "after:block" : "after:hidden")
              }
            >
              Saved
            </button>
          </div>
          {activeTabs === "saved" ? (
            <SavedTab config={config} />
          ) : (
            <CreatedTab />
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile;
