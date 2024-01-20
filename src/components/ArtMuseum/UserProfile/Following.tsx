import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import http from "../../../axios/axios";
import { User } from "../../../shared/types";

interface FollowingProps{
  userData:User,
  isOwner:boolean
}

function Following({ userData,isOwner }:FollowingProps) {
  const [isFollowed, setIsFollowed] = useState(true);
  const followMutation = useMutation({
    mutationKey: ["followUser",userData._id],
    mutationFn: async (idUser:string) => {
      const res = await http.post(`/user/follow/${idUser}`);
      return res;
    },
  });
  return (
    <div className="flex justify-between items-center my-2">
      <div className="following-info flex gap-4 items-center">
        <LazyLoadImage
          className="rounded-full object-cover bg-black/[0.06]"
          width={50}
          height={50}
          src={userData.photo}
        ></LazyLoadImage>
        <div className="following-name">{userData.userName}</div>
      </div>
      <div className="follow-controller">
        {isOwner && (isFollowed ? (
          <button
            onClick={() => {
              setIsFollowed(false);
              followMutation.mutate(userData._id)
            }}
            className="secondary-btn px-4 py-2 min-w-[90px]"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() => {
              setIsFollowed(true);
              followMutation.mutate(userData._id)
            }}
            className="primary-btn px-4 py-2 min-w-[90px]"
          >
            Follow
          </button>
        ))}
        
      </div>
    </div>
  );
}

export default Following;
