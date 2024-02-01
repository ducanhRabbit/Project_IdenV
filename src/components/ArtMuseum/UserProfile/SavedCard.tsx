import { HiHeart } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { BsTrashFill } from "react-icons/bs";
import "react-lazy-load-image-component/src/effects/blur.css";

import React from "react";


import { useAppSelector } from "../../../redux/hook";
import { ConfirmWarnState, Inspiration } from "../../../shared/types";

interface CardImgProps {
  content: Inspiration;
  setActiveConfirmWarn?: React.Dispatch<
    React.SetStateAction<ConfirmWarnState | null>
  >;
}

function CardImg({
  content,
  setActiveConfirmWarn,
}: CardImgProps) {
  const { id } = useParams();
  const { currentUser } = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();
  return (
    <div>
      <div className=" card-wrapper font-witch block text-white px-2 pb-4">
        <div
          className={`relative group border-2 w-full border-grey-300 object-cover rounded-[16px] overflow-hidden `}
        >
          <LazyLoadImage
            wrapperClassName="!block"
            className="object-cover"
            src={content.artworkURL}
            effect="blur"
            placeholder={<span className=" block h-[200px]"></span>}
          />
          <div className={`overlay-cover `}>
            <Link
              to={`/artMuseum/inspiration/${content._id}`}
              className={` overlay absolute w-full h-full top-0  group-hover:bg-black/50 duration-150`}
            ></Link>

            {currentUser && id === currentUser._id && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (setActiveConfirmWarn) {
                    setActiveConfirmWarn({
                      type: "delete",
                      data: content._id,
                    });
                  }
                }}
                className="delete-btn translate-y-[60px] group-hover:translate-y-0 duration-300 absolute bottom-4 right-4 p-2 primary-btn"
              >
                <BsTrashFill size={25} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <Link
            to={`/artMuseum/profile/${content?.postedBy._id}/created`}
            className="artist-info  gap-2 duration-500 ease-out w-full flex mt-2"
          >
            <div className="avatar w-[50px] h-[50px] rounded-full border-2 border-old-gold/80 overflow-hidden">
              <LazyLoadImage
                className="object-cover"
                effect="blur"
                src={content.postedBy.photo}
              ></LazyLoadImage>
            </div>
            <div className="flex flex-col">
              <div className="artist-name text-lg">
                {content.postedBy.firstName}
              </div>
              <div className="followers text-base">
                {content.postedBy.followers.length} follows
              </div>
            </div>
          </Link>
          <div className="popularity flex items-center gap-2">
                <span className="text-primary">
                <HiHeart size={30}></HiHeart>
                </span>
                <span>{content.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardImg;
