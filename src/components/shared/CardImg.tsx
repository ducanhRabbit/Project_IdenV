import { HiHeart } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../../axios/axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BsTrashFill } from "react-icons/bs";
import "react-lazy-load-image-component/src/effects/blur.css";
import useScreenSize from "../../hook/useScreenSize";
import { ConfirmWarnState, Inspiration } from "../../shared/types";
import React from "react";
import { useAppSelector } from "../../redux/hook";



interface CardImgProps {
  content: Inspiration;
  indexPage: number;
  tab: string;
  setActiveConfirmWarn?: React.Dispatch<React.SetStateAction<ConfirmWarnState | null>>;
}

function CardImg({
  content,
  indexPage,
  tab,
  setActiveConfirmWarn,
}: CardImgProps) {
  const { id } = useParams();
  const { isMobile } = useScreenSize();
  const { currentUser } = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();
  const likePostMutation = useMutation({
    mutationKey: ["addLike"],
    mutationFn: (id: string) => {
      return http.put(`inspiration/${id}/likes`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(
        { queryKey: ["infinitInspiration"] },
        {
          // refetchPage: (page:number, index:number) => {
          //   console.log(index, indexPage);
          //   return index === indexPage;
          // },
        }
      );
      queryClient.invalidateQueries(
        { queryKey: ["savedPost"] },
        {
          // refetchPage: (page:number, index:number) => {
          //   console.log(index, indexPage);
          //   return index === indexPage;
          // },
        }
      );
      queryClient.invalidateQueries(
        { queryKey: ["searchInspiration"] },
        {
          // refetchPage: (page:number, index:number) => {
          //   console.log(index, indexPage);
          //   return index === indexPage;
          // },
        }
      );
    },
  });

  return (
    <div>
      <div className=" card-wrapper font-witch block text-white px-2 pb-4">
        <div
          className={`relative group border-2 w-full border-old-gold/80 object-cover rounded-[16px] overflow-hidden `}
        >
          <LazyLoadImage
            wrapperClassName="!block"
            className="object-cover"
            src={content.artworkURL}
            effect="blur"
            placeholder={<span className=" block h-[200px]"></span>}
          />
          <div className={`${isMobile && "hidden"} overlay-cover `}>
            <Link
              to={`/artMuseum/inspiration/${content._id}`}
              className={` overlay absolute w-full h-full top-0  group-hover:bg-black/50 duration-150`}
            ></Link>
            <Link
              to={`/artMuseum/profile/${content?.postedBy._id}/created`}
              className={` artist-info absolute left-4 top-3 max-w-[80%] gap-2 duration-500 ease-out w-full -translate-x-[80%] group-hover:translate-x-0 flex`}
            >
              <div className="avatar w-[45px] h-[45px] rounded-full border-2 border-old-gold/80 overflow-hidden">
                <LazyLoadImage
                  className="object-cover"
                  effect="blur"
                  src={content.postedBy.photo}
                ></LazyLoadImage>
              </div>
              <div className="flex flex-col">
                <div className="artist-name hover:underline text-lg">
                  {content.postedBy.firstName}
                </div>
                <div className="followers text-xs">
                  {content.postedBy.followers.length} follows
                </div>
              </div>
            </Link>
            {tab === "saved" && currentUser && id === currentUser._id && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (setActiveConfirmWarn) {
                    setActiveConfirmWarn({
                      type: "delete",
                      data: content._id,
                    });
                  }
                  console.log(content?._id);
                }}
                className="delete-btn translate-y-[60px] group-hover:translate-y-0 duration-300 absolute bottom-4 right-4 p-2 primary-btn"
              >
                <BsTrashFill size={25} />
              </button>
            )}

            <div
              className={
                "like-btn group/heart flex translate-y-[60px] group-hover:translate-y-0 items-center duration-300 absolute bottom-4 left-4 rounded-full p-2 hover:pr-8 bg-white/80" +
                `${
                  content.likes.some((item) => item._id === currentUser?._id)
                    ? " text-[#e7255f]"
                    : " text-[#a3a3a3]"
                }`
              }
              onClick={(e) => {
                e.preventDefault();
                likePostMutation.mutate(content._id);
              }}
            >
              <HiHeart
                size={25}
                className={`${
                  content.likes.some((item) => item._id === currentUser?._id)
                    ? "text-[#e7255f]"
                    : "text-[#a3a3a3]"
                }`}
              />
              <span className="text-[15px] absolute translate-y-[1px] right-3 opacity-0 group-hover/heart:opacity-100  font-medium leading-none">
                {content.likes.length}
              </span>
            </div>
          </div>
        </div>
        {isMobile && (
          <div>
            <Link
              to={`/artMuseum/profile/${content?.postedBy._id}/created`}
              className="artist-info  gap-2 duration-500 ease-out w-full flex mt-2"
            >
              <div className="avatar w-[60px] h-[60px] rounded-full border-2 border-old-gold/80 overflow-hidden">
                <LazyLoadImage
                  className="object-cover"
                  effect="blur"
                  src={content.postedBy.photo}
                ></LazyLoadImage>
              </div>
              <div className="flex flex-col">
                <div className="artist-name text-xl">
                  {content.postedBy.firstName}
                </div>
                <div className="followers text-lg">
                  {content.postedBy.followers.length} follows
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardImg;
