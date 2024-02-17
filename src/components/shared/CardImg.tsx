import { HiHeart } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../../axios/axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useScreenSize from "../../hook/useScreenSize";
import { Inspiration } from "../../shared/types";
import { useAppSelector } from "../../redux/hook";
import moment from "moment";

interface CardImgProps {
  content: Inspiration;
}

function CardImg({ content }: CardImgProps) {
  const { isMobile } = useScreenSize();
  const { currentUser } = useAppSelector((state) => state.user);
  const queryClient = useQueryClient();
  const likePostMutation = useMutation({
    mutationKey: ["addLike"],
    mutationFn: (id: string) => {
      return http.put(`inspiration/${id}/likes`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infinitInspiration"] });
      queryClient.invalidateQueries({ queryKey: ["savedPost"] });
      queryClient.invalidateQueries({ queryKey: ["searchInspiration"] });
    },
  });
  return (
    <div className=" card-wrapper font-witch block text-white">
      <div
        className={`relative group border-2 w-full min-h-[100px] border-grey-300 object-cover rounded-[16px] overflow-hidden `}
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
            className={` artist-info absolute left-4 top-3 max-w-[80%] gap-2 duration-500 ease-out w-full -translate-x-[80%] group-hover:translate-x-0 flex opacity-0 group-hover:opacity-100`}
          >
            <div className="avatar w-[45px] h-[45px] rounded-full border-2 border-grey-300 overflow-hidden">
              <LazyLoadImage
                className="object-cover"
                effect="blur"
                src={content.postedBy.photo}
              ></LazyLoadImage>
            </div>
            <div className="flex flex-col">
              <div className="artist-name hover:underline text-base">
                {content.postedBy.userName}
              </div>
              <div className="followers text-xs">
                {moment
                  .tz(content.createdAt, "Asia/Ho_Chi_Minh")
                  .format("DD.MM.YYYY HH:mm")
                  .toString()}
              </div>
            </div>
          </Link>
          <div
            className={
              "like-btn cursor-pointer group/heart flex translate-y-[60px] group-hover:translate-y-0 items-center duration-300 absolute bottom-4 left-4 rounded-full p-2 hover:pr-8 bg-white/80" +
              `${
                content.likes.some((item) => item._id === currentUser?._id)
                  ? " text-primary"
                  : " text-grey-300"
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
                  ? "text-primary"
                  : "text-grey-300"
              } test`}
            />
            <span className="text-[15px] absolute translate-y-[1px] right-3 opacity-0 group-hover/heart:opacity-100  font-medium leading-none">
              {content.likes.length}
            </span>
          </div>
        </div>
        {isMobile && (
          <Link
            to={`/artMuseum/inspiration/${content._id}`}
            className="absolute w-full h-full top-0"
          ></Link>
        )}
      </div>
      {isMobile && (
        <div>
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
                {content.postedBy.userName}
              </div>
              <div className="followers text-base">
                {content.postedBy.followers.length} follows
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CardImg;
